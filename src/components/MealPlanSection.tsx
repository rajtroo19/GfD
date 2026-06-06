"use client";

import React, { useState } from "react";
import { Clock, ShieldAlert, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  const mealTypeLabels: Record<"breakfast" | "lunch" | "dinner", { label: string; bg: string; text: string }> = {
    breakfast: { label: "Breakfast", bg: "bg-amber-50 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-400" },
    lunch: { label: "Lunch", bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-700 dark:text-emerald-400" },
    dinner: { label: "Dinner", bg: "bg-indigo-50 dark:bg-indigo-950/20", text: "text-indigo-700 dark:text-indigo-400" },
  };

  return (
    <section className="space-y-6" aria-labelledby="meal-plan-heading">
      <div className="flex items-center justify-between">
        <h2 id="meal-plan-heading" className="text-xl font-semibold text-zinc-950 dark:text-white">
          Step 2: Your Custom Meal Plan
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          Recipes dynamically adapted to your day
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {meals.map((meal) => {
          const typeStyle = mealTypeLabels[meal.type];
          const isExpanded = expandedRecipeId === meal.id;

          return (
            <article
              key={meal.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
              aria-labelledby={`meal-name-${meal.id}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeStyle.bg} ${typeStyle.text}`}>
                      {typeStyle.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      {meal.prepTime + meal.cookTime} mins
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 capitalize">
                      • {meal.difficulty} prep
                    </span>
                  </div>
                  <h3 id={`meal-name-${meal.id}`} className="text-lg font-bold text-zinc-900 dark:text-white">
                    {meal.name}
                  </h3>
                </div>

                <button
                  onClick={() => toggleExpand(meal.id)}
                  className="flex items-center gap-1.5 self-start text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                  aria-expanded={isExpanded}
                  aria-controls={`instructions-${meal.id}`}
                  aria-label={isExpanded ? `Hide instructions for ${meal.name}` : `Show instructions for ${meal.name}`}
                >
                  {isExpanded ? (
                    <>
                      Hide Details <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show Details <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Ingredients and Swap Section */}
              <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Ingredients & Substitutions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meal.ingredients.map((ing) => {
                    const activeSub = activeSubs.find(
                      (sub) => sub.recipeId === meal.id && sub.ingredientId === ing.id
                    );
                    const currentSubIndex = activeSub ? activeSub.substituteIndex : -1;
                    const isSwapped = currentSubIndex !== -1;

                    // Compute display name and price
                    const displayName = isSwapped ? ing.substitutes[currentSubIndex].name : ing.name;
                    const displayCost = isSwapped ? ing.substitutes[currentSubIndex].estimatedCost : ing.estimatedCost;
                    const displayQty = isSwapped ? ing.substitutes[currentSubIndex].quantity : ing.quantity;

                    return (
                      <div
                        key={ing.id}
                        className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all ${
                          isSwapped
                            ? "bg-emerald-50/20 border-emerald-500/20 dark:bg-emerald-950/5 dark:border-emerald-500/10"
                            : "bg-zinc-50/50 border-zinc-100 dark:bg-zinc-800/20 dark:border-zinc-800/55"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                              {displayName}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                              <span>Qty: {displayQty}</span>
                              <span>•</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                Est. ₹{displayCost.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Substitution Toggle Button */}
                        {ing.substitutes.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
                            <span className="text-2xs text-zinc-400 dark:text-zinc-500 italic">
                              {isSwapped ? "Alternative swap active" : "Standard ingredient"}
                            </span>
                            <button
                              onClick={() => {
                                // Cycle to next substitute, or wrap around back to -1 (base ingredient)
                                const nextIndex = (currentSubIndex + 2) % (ing.substitutes.length + 1) - 1;
                                onSwapIngredient(meal.id, ing.id, nextIndex);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              aria-label={`Swap ${ing.name} with an alternative`}
                            >
                              <RefreshCw className="h-3 w-3" />
                              Swap
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions Panel */}
              {isExpanded && (
                <div
                  id={`instructions-${meal.id}`}
                  className="mt-6 border-t border-zinc-100 dark:border-zinc-800/80 pt-5 space-y-4 animate-fade-in"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Preparation Instructions
                  </h4>
                  <ol className="space-y-3">
                    {meal.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                        <span className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
