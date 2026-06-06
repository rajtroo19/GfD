"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { ScheduleForm, ScheduleType } from "@/components/ScheduleForm";
import { MealPlanSection } from "@/components/MealPlanSection";
import { GroceryListSection } from "@/components/GroceryListSection";
import { BudgetSummary } from "@/components/BudgetSummary";
import {
  getMealPlan,
  consolidateGroceryList,
  ActiveSubstitution,
} from "@/utils/planner";

export default function Home() {
  // Theme state (Dark Mode by default for sleek aesthetics)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Form states
  const [schedule, setSchedule] = useState<ScheduleType>("standard");
  const [budgetLimit, setBudgetLimit] = useState<number>(250); // Daily budget in Rupees (₹)
  const [dietPreference, setDietPreference] = useState<string>("everything");
  const [cuisine, setCuisine] = useState<string>("gujarati");

  // Interactive planning states
  const [activeSubs, setActiveSubs] = useState<ActiveSubstitution[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // Sync dark mode class with root html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [isDarkMode]);

  // Reset active substitutions when schedule, diet preference, or cuisine changes
  useEffect(() => {
    setActiveSubs([]);
    setCheckedItems([]);
  }, [schedule, dietPreference, cuisine]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // 1. Fetch filtered meals based on schedule, diet, and cuisine style (Memoized)
  const meals = useMemo(() => {
    return getMealPlan(dietPreference, schedule, cuisine);
  }, [dietPreference, schedule, cuisine]);

  // 2. Generate consolidated grocery list based on current meals & substitutions (Memoized)
  const groceryItems = useMemo(() => {
    return consolidateGroceryList(meals, activeSubs, checkedItems);
  }, [meals, activeSubs, checkedItems]);

  // 3. Calculate total cost of current grocery list (Memoized)
  const totalCost = useMemo(() => {
    return groceryItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  }, [groceryItems]);

  // 4. Callback to handle swapping of ingredients
  const handleSwapIngredient = useCallback(
    (recipeId: string, ingredientId: string, substituteIndex: number) => {
      setActiveSubs((prev) => {
        // Remove existing sub if present
        const filtered = prev.filter(
          (sub) => !(sub.recipeId === recipeId && sub.ingredientId === ingredientId)
        );
        // Add new sub configuration if substituteIndex !== -1
        if (substituteIndex === -1) {
          return filtered;
        }
        return [...filtered, { recipeId, ingredientId, substituteIndex }];
      });
    },
    []
  );

  // 5. Callback to handle grocery checklist toggles
  const handleToggleGroceryItem = useCallback((itemId: string) => {
    setCheckedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  // 6. Callback to clear completed/checked items
  const handleClearChecked = useCallback(() => {
    setCheckedItems([]);
  }, []);

  // 7. Handler to apply recommended cheaper swaps from the budget warning card
  const handleApplyCheaperSwap = useCallback(
    (recipeId: string, ingredientId: string, substituteIndex: number) => {
      handleSwapIngredient(recipeId, ingredientId, substituteIndex);
    },
    [handleSwapIngredient]
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300 flex flex-col font-sans">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* Intro Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 bg-clip-text text-transparent">
            Your Schedule-Adaptive Kitchen Assistant
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            PrepPal aligns your cooking reality with your daily schedule. Enter your daily time constraints, cuisine style, dietary needs, and budget to receive a personalized meal plan, dynamic substitutions, and an interactive cost check in Indian Rupees (₹).
          </p>
        </section>

        {/* Form and Budget Summary side-by-side or stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Input Form */}
            <ScheduleForm
              schedule={schedule}
              setSchedule={setSchedule}
              budgetLimit={budgetLimit}
              setBudgetLimit={setBudgetLimit}
              dietPreference={dietPreference}
              setDietPreference={setDietPreference}
              cuisine={cuisine}
              setCuisine={setCuisine}
            />

            {/* Step 2: Meal Plan display */}
            <MealPlanSection
              meals={meals}
              activeSubs={activeSubs}
              onSwapIngredient={handleSwapIngredient}
            />
          </div>

          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            {/* Step 4: Budget calculations */}
            <BudgetSummary
              totalCost={totalCost}
              budgetLimit={budgetLimit}
              groceryItems={groceryItems}
              onTriggerSwapSuggestions={handleApplyCheaperSwap}
              recipesRaw={meals}
            />

            {/* Step 3: Grocery List Checklist */}
            <GroceryListSection
              items={groceryItems}
              onToggleItem={handleToggleGroceryItem}
              onClearChecked={handleClearChecked}
            />
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 PrepPal App. Built with Next.js & Tailwind CSS.</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Enterprise Grade Quality Compliant
          </span>
        </div>
      </footer>
    </div>
  );
}
