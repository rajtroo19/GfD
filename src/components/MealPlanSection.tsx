"use client";

import React from "react";
import { Clock, RefreshCw, CheckCircle2 } from "lucide-react";
import { Recipe, ActiveSubstitution } from "@/utils/planner";

interface MealPlanSectionProps {
  meals: Recipe[];
  activeSubs: ActiveSubstitution[];
  onSwapIngredient: (recipeId: string, ingredientId: string, substituteIndex: number) => void;
}

export const MealPlanSection: React.FC<MealPlanSectionProps> = ({
  meals,
  activeSubs,
  onSwapIngredient,
}) => {
  // Find meals by type
  const breakfast = meals.find((m) => m.type === "breakfast");
  const lunch = meals.find((m) => m.type === "lunch");
  const dinner = meals.find((m) => m.type === "dinner");

  // Helper to get active info for an ingredient
  const getIngredientInfo = (recipeId: string, ing: any) => {
    const activeSub = activeSubs.find(
      (sub) => sub.recipeId === recipeId && sub.ingredientId === ing.id
    );
    const currentIndex = activeSub ? activeSub.substituteIndex : -1;
    const isSwapped = currentIndex !== -1;
    const name = isSwapped ? ing.substitutes[currentIndex].name : ing.name;
    const cost = isSwapped ? ing.substitutes[currentIndex].estimatedCost : ing.estimatedCost;
    const qty = isSwapped ? ing.substitutes[currentIndex].quantity : ing.quantity;
    return { name, cost, qty, isSwapped, currentIndex };
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Today's Schedule
        </span>
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
          {meals[0]?.scheduleComplexity === "busy"
            ? "Busy "
            : meals[0]?.scheduleComplexity === "relaxed"
            ? "Relaxed "
            : "Standard "}
          {(() => {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return days[new Date().getDay()];
          })()}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl">
          {meals[0]?.scheduleComplexity === "busy"
            ? "High-efficiency, 15-minute meals tailored for a packed workday. Minimal prep, maximum nutrition."
            : meals[0]?.scheduleComplexity === "relaxed"
            ? "Leisurely cooking options designed for a relaxed day. Full-flavored traditional meals with rich spices."
            : "Balanced meal options designed to keep cooking healthy, delicious, and under 30 minutes of effort."}
        </p>
        <div className="flex gap-2 mt-3">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-150 dark:border-emerald-900/40">
            {meals[0]?.scheduleComplexity === "busy" ? "Low Effort" : meals[0]?.scheduleComplexity === "relaxed" ? "Chef Style" : "Medium Effort"}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-150 dark:border-emerald-900/40">
            {meals.reduce((acc, m) => acc + m.prepTime + m.cookTime, 0)}m Total
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Breakfast and Dinner */}
        <div className="space-y-6">
          {/* Breakfast Card */}
          {breakfast && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[420px] transition-colors duration-300">
              <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src="/berry_oats.png"
                  alt="Overnight berry oats"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-900/95 px-3 py-1 rounded-full text-xs font-bold text-zinc-900 dark:text-white shadow-sm">
                  Breakfast
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{breakfast.prepTime}m Prep</span>
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {breakfast.name}
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light line-clamp-3">
                    {breakfast.instructions[0]} {breakfast.instructions[1] || ""}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-6">
                  {(() => {
                    // Find first ingredient with substitutes
                    const swappableIng = breakfast.ingredients.find((ing) => ing.substitutes.length > 0);
                    if (swappableIng) {
                      const info = getIngredientInfo(breakfast.id, swappableIng);
                      return (
                        <button
                          onClick={() => {
                            const nextIndex = (info.currentIndex + 2) % (swappableIng.substitutes.length + 1) - 1;
                            onSwapIngredient(breakfast.id, swappableIng.id, nextIndex);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 transition-all bg-transparent"
                        >
                          <RefreshCw className="h-3 w-3" />
                          {info.isSwapped ? "Revert Swap" : "Swap Ingredient"}
                        </button>
                      );
                    }
                    return <div />;
                  })()}
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 font-mono">
                    {breakfast.calories || 320} kcal
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Dinner Card */}
          {dinner && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[420px] transition-colors duration-300">
              <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src="/tofu_stir_fry.png"
                  alt="Dinner stir fry"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-900/95 px-3 py-1 rounded-full text-xs font-bold text-zinc-900 dark:text-white shadow-sm">
                  Dinner
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{dinner.prepTime}m Prep</span>
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {dinner.name}
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light line-clamp-3">
                    {dinner.instructions[0]} {dinner.instructions[1] || ""}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-6">
                  {(() => {
                    const swappableIng = dinner.ingredients.find((ing) => ing.substitutes.length > 0);
                    if (swappableIng) {
                      const info = getIngredientInfo(dinner.id, swappableIng);
                      return (
                        <button
                          onClick={() => {
                            const nextIndex = (info.currentIndex + 2) % (swappableIng.substitutes.length + 1) - 1;
                            onSwapIngredient(dinner.id, swappableIng.id, nextIndex);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 transition-all bg-transparent"
                        >
                          <RefreshCw className="h-3 w-3" />
                          {info.isSwapped ? "Revert Swap" : "Swap Ingredient"}
                        </button>
                      );
                    }
                    return <div />;
                  })()}
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 font-mono">
                    {dinner.calories || 410} kcal
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Lunch and Weekly Nutrition Snapshot */}
        <div className="space-y-6">
          {/* Lunch Card (Horizontal Split) */}
          {lunch && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[380px] md:min-h-[420px] transition-colors duration-300">
              <div className="md:col-span-5 relative bg-zinc-100 dark:bg-zinc-800">
                <img
                  src="/salmon_bowl.png"
                  alt="Lunch Salmon Power Bowl"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-900/95 px-3 py-1 rounded-full text-xs font-bold text-zinc-900 dark:text-white shadow-sm">
                  Lunch
                </span>
              </div>
              <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{lunch.prepTime}m Prep</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {lunch.name}
                  </h4>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-white dark:bg-white dark:text-zinc-900 text-3xs font-extrabold tracking-wider uppercase">
                      High Protein
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-3xs font-bold tracking-wider uppercase">
                      Quick Wash
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light line-clamp-3">
                    {lunch.instructions[0]} {lunch.instructions[1] || ""}
                  </p>
                </div>

                {/* Inline substitution box */}
                {(() => {
                  const swappableIng = lunch.ingredients.find((ing) => ing.substitutes.length > 0);
                  if (swappableIng) {
                    const info = getIngredientInfo(lunch.id, swappableIng);
                    return (
                      <div className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Protein Source</p>
                          <p className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[150px]">
                            {info.name}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const nextIndex = (info.currentIndex + 2) % (swappableIng.substitutes.length + 1) - 1;
                            onSwapIngredient(lunch.id, swappableIng.id, nextIndex);
                          }}
                          className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-medium transition-all"
                        >
                          {info.isSwapped ? "Revert" : "Swap"}
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                    Gluten-Free Available
                  </span>
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 font-mono">
                    {lunch.calories || 540} kcal
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Nutrition Snapshot Card */}
          <div className="bg-[#0b3c2a] text-white border border-emerald-950 rounded-3xl p-6 flex flex-col justify-between min-h-[200px] shadow-sm">
            <div className="space-y-4">
              <h4 className="text-lg font-bold tracking-tight">Weekly Nutrition Snapshot</h4>
              <div className="grid grid-cols-4 gap-4 divide-x divide-emerald-800/50">
                <div className="space-y-1">
                  <span className="block text-3xs uppercase tracking-wider text-emerald-400">Protein</span>
                  <span className="block text-lg font-extrabold font-mono">142g</span>
                </div>
                <div className="pl-3 space-y-1">
                  <span className="block text-3xs uppercase tracking-wider text-emerald-400">Carbs</span>
                  <span className="block text-lg font-extrabold font-mono">210g</span>
                </div>
                <div className="pl-3 space-y-1">
                  <span className="block text-3xs uppercase tracking-wider text-emerald-400">Fiber</span>
                  <span className="block text-lg font-extrabold font-mono">35g</span>
                </div>
                <div className="pl-3 space-y-1">
                  <span className="block text-3xs uppercase tracking-wider text-emerald-400">Water</span>
                  <span className="block text-lg font-extrabold font-mono">2.5L</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 mt-4 border-t border-emerald-800/40">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>All ingredients are in your pantry.</span>
              </div>
              <button className="px-4 py-2 bg-white hover:bg-zinc-100 text-[#0b3c2a] rounded-lg text-xs font-semibold transition-all">
                View Full Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
