"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { ScheduleForm, ScheduleType } from "@/components/ScheduleForm";
import { MealPlanSection } from "@/components/MealPlanSection";
import { GroceryListSection } from "@/components/GroceryListSection";
import { BudgetSummary } from "@/components/BudgetSummary";
import { Calendar, ShoppingCart, RefreshCw, User, Plus } from "lucide-react";
import {
  getMealPlan,
  consolidateGroceryList,
  ActiveSubstitution,
} from "@/utils/planner";

type TabType = "planner" | "groceries" | "substitutions" | "profile";

export default function Home() {
  // Theme state (Dark Mode by default for sleek aesthetics)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Workflow initialization state
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("planner");

  // Form states
  const [schedule, setSchedule] = useState<ScheduleType>("standard");
  const [budgetLimit, setBudgetLimit] = useState<number>(250); // Daily budget in Rupees (₹)
  const [dietaryAlignments, setDietaryAlignments] = useState<string[]>([]);
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

  // Reset active substitutions when schedule, dietary alignments, or cuisine changes
  useEffect(() => {
    setActiveSubs([]);
    setCheckedItems([]);
  }, [schedule, dietaryAlignments, cuisine]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // 1. Fetch filtered meals based on schedule, dietary alignments, and cuisine style
  const meals = useMemo(() => {
    return getMealPlan(dietaryAlignments, schedule, cuisine);
  }, [dietaryAlignments, schedule, cuisine]);

  // 2. Generate consolidated grocery list based on current meals & substitutions
  const groceryItems = useMemo(() => {
    return consolidateGroceryList(meals, activeSubs, checkedItems);
  }, [meals, activeSubs, checkedItems]);

  // 3. Calculate total cost of current grocery list
  const totalCost = useMemo(() => {
    return groceryItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  }, [groceryItems]);

  // 4. Callback to handle swapping of ingredients
  const handleSwapIngredient = useCallback(
    (recipeId: string, ingredientId: string, substituteIndex: number) => {
      setActiveSubs((prev) => {
        const filtered = prev.filter(
          (sub) => !(sub.recipeId === recipeId && sub.ingredientId === ingredientId)
        );
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

  // Initialize planner
  const handleInitializePlan = useCallback(() => {
    setIsInitialized(true);
    setActiveTab("planner");
  }, []);

  // Reset plan to return to Setup Page
  const handleNewPlan = useCallback(() => {
    setIsInitialized(false);
  }, []);

  // Optimize and trigger cheaper swaps instantly
  const handleOptimizeNow = useCallback(() => {
    // Find all cheaper swaps and apply them
    meals.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        const hasCheaperSub = ing.substitutes.findIndex((sub) => sub.type === "cheaper");
        if (hasCheaperSub !== -1) {
          handleSwapIngredient(recipe.id, ing.id, hasCheaperSub);
        }
      });
    });
  }, [meals, handleSwapIngredient]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300 flex flex-col font-sans">
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {!isInitialized ? (
        // Workflow Phase 1: Interactive Setup Page
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <ScheduleForm
            schedule={schedule}
            setSchedule={setSchedule}
            budgetLimit={budgetLimit}
            setBudgetLimit={setBudgetLimit}
            dietaryAlignments={dietaryAlignments}
            setDietaryAlignments={setDietaryAlignments}
            cuisine={cuisine}
            setCuisine={setCuisine}
            initializePlan={handleInitializePlan}
          />
        </main>
      ) : (
        // Workflow Phase 2 & 3: Main Dashboard with Sidebar
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0 flex flex-col justify-between bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-[24px] p-5 shadow-sm min-h-[300px] lg:min-h-[500px]">
            <div className="space-y-6">
              {/* Brand logo details */}
              <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="h-8 w-8 relative flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-850">
                  <img src="/prepal.png" alt="PrepPal Logo" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-none">PrepPal</h4>
                  <span className="text-3xs text-zinc-400 dark:text-zinc-500 font-extrabold tracking-widest uppercase mt-1 block">
                    Sous-Chef
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="flex flex-col gap-1" aria-label="Sidebar navigation">
                {[
                  { id: "planner", label: "Planner", icon: <Calendar className="h-4 w-4" /> },
                  { id: "groceries", label: "Groceries", icon: <ShoppingCart className="h-4 w-4" /> },
                  { id: "substitutions", label: "Substitutions", icon: <RefreshCw className="h-4 w-4" /> },
                  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 ring-1 ring-emerald-500/10"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* "+ New Plan" button to return to setup */}
            <button
              onClick={handleNewPlan}
              className="w-full mt-6 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-900/10"
            >
              <Plus className="h-4 w-4" />
              New Plan
            </button>
          </aside>

          {/* Main Content Pane */}
          <main className="flex-1 space-y-8">
            {activeTab === "planner" && (
              <div className="animate-fade-in">
                <MealPlanSection
                  meals={meals}
                  activeSubs={activeSubs}
                  onSwapIngredient={handleSwapIngredient}
                />
              </div>
            )}

            {activeTab === "groceries" && (
              <div className="space-y-6 animate-fade-in">
                {/* Feasibility Bar */}
                <BudgetSummary
                  totalCost={totalCost}
                  budgetLimit={budgetLimit}
                  onOptimizeClick={handleOptimizeNow}
                />

                {/* Groceries Checklist + Sides */}
                <GroceryListSection
                  items={groceryItems}
                  onToggleItem={handleToggleGroceryItem}
                  onClearChecked={handleClearChecked}
                  recipesRaw={meals}
                  activeSubs={activeSubs}
                  onSwapIngredient={handleSwapIngredient}
                />
              </div>
            )}

            {activeTab === "substitutions" && (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-[32px] p-6 md:p-8 shadow-sm transition-colors duration-300 space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Active Substitutions</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Manage ingredient alternatives to fit dietary requirements or budget constraints.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meals.flatMap((recipe) =>
                    recipe.ingredients
                      .filter((ing) => ing.substitutes.length > 0)
                      .map((ing) => {
                        const activeSub = activeSubs.find(
                          (sub) => sub.recipeId === recipe.id && sub.ingredientId === ing.id
                        );
                        const currentIdx = activeSub ? activeSub.substituteIndex : -1;
                        return (
                          <div
                            key={ing.id}
                            className="p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3"
                          >
                            <div>
                              <span className="text-3xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold block mb-1">
                                {recipe.name}
                              </span>
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                                {ing.name}
                              </h4>
                            </div>
                            <div className="space-y-1.5">
                              <button
                                onClick={() => handleSwapIngredient(recipe.id, ing.id, -1)}
                                className={`w-full py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                                  currentIdx === -1
                                    ? "bg-emerald-950 border-emerald-950 text-white dark:bg-white dark:text-zinc-950 dark:border-white"
                                    : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                }`}
                              >
                                <span>Base: {ing.name}</span>
                                <span className="font-mono">₹{ing.estimatedCost.toFixed(2)}</span>
                              </button>
                              {ing.substitutes.map((sub, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSwapIngredient(recipe.id, ing.id, idx)}
                                  className={`w-full py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                                    currentIdx === idx
                                      ? "bg-emerald-955 border-emerald-955 text-white dark:bg-white dark:text-zinc-955 dark:border-white"
                                      : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                  }`}
                                >
                                  <span>{sub.name} ({sub.type})</span>
                                  <span className="font-mono">₹{sub.estimatedCost.toFixed(2)}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-[32px] p-8 shadow-sm transition-colors duration-300 space-y-6 animate-fade-in text-center max-w-md mx-auto">
                <div className="h-24 w-24 rounded-full overflow-hidden mx-auto bg-zinc-100 dark:bg-zinc-800 border-2 border-emerald-700 flex items-center justify-center">
                  <img src="/prepal.png" alt="Profile" className="h-16 w-16 object-contain" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">The Disciplined Sous-Chef</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">ID: PREPPAL-BETA-01</p>
                </div>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 space-y-2 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Dietary Preferences:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {dietaryAlignments.length > 0 ? dietaryAlignments.join(", ") : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Daily Budget Limit:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">₹{budgetLimit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Preferred Cuisine:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">{cuisine}</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-zinc-150 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500 mt-12 transition-colors duration-300">
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
