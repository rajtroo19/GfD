"use client";

import React, { useMemo } from "react";
import { AlertCircle, CheckCircle2, TrendingDown } from "lucide-react";
import { ConsolidatedItem } from "@/utils/planner";

interface BudgetSummaryProps {
  totalCost: number;
  budgetLimit: number;
  groceryItems: ConsolidatedItem[];
  onTriggerSwapSuggestions: (recipeId: string, ingredientId: string, subIndex: number) => void;
  recipesRaw: any[]; // Pass raw recipes to query possible cheaper swaps
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  totalCost,
  budgetLimit,
  groceryItems,
  onTriggerSwapSuggestions,
  recipesRaw,
}) => {
  const isExceeded = totalCost > budgetLimit;
  const percentUsed = budgetLimit > 0 ? Math.min((totalCost / budgetLimit) * 100, 100) : 100;

  // Compute remaining budget or deficit
  const difference = useMemo(() => {
    return Math.abs(budgetLimit - totalCost);
  }, [totalCost, budgetLimit]);

  // Determine progress bar color
  const progressColorClass = useMemo(() => {
    if (totalCost > budgetLimit) return "bg-red-500 shadow-md shadow-red-500/20";
    if (totalCost > budgetLimit * 0.85) return "bg-amber-500 shadow-md shadow-amber-500/20";
    return "bg-emerald-500 shadow-md shadow-emerald-500/20";
  }, [totalCost, budgetLimit]);

  // Find all available cheaper swaps that have NOT been applied yet
  const availableCheaperSwaps = useMemo(() => {
    const suggestions: { recipeId: string; recipeName: string; ingredientId: string; ingredientName: string; subName: string; subCost: number; savings: number; subIndex: number }[] = [];

    recipesRaw.forEach((recipe) => {
      recipe.ingredients.forEach((ing: any) => {
        // Find if this ingredient is currently swapped
        const isSwapped = groceryItems.find(
          (item) => item.baseName === ing.baseName && item.isSwapped
        );

        if (!isSwapped) {
          // Look for any cheaper substitutes
          ing.substitutes.forEach((sub: any, idx: number) => {
            if (sub.type === "cheaper" && sub.estimatedCost < ing.estimatedCost) {
              suggestions.push({
                recipeId: recipe.id,
                recipeName: recipe.name,
                ingredientId: ing.id,
                ingredientName: ing.name,
                subName: sub.name,
                subCost: sub.estimatedCost,
                savings: ing.estimatedCost - sub.estimatedCost,
                subIndex: idx,
              });
            }
          });
        }
      });
    });

    // Sort by maximum savings
    return suggestions.sort((a, b) => b.savings - a.savings);
  }, [recipesRaw, groceryItems]);

  return (
    <section
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-300 space-y-6"
      aria-labelledby="budget-summary-heading"
    >
      <h2 id="budget-summary-heading" className="text-xl font-semibold text-zinc-950 dark:text-white">
        Step 4: Budget Feasibility Logic
      </h2>

      {/* Progress Bar & Indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-zinc-500 dark:text-zinc-400">Budget Progress</span>
          <span className={isExceeded ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>
            ₹{totalCost.toFixed(2)} / ₹{budgetLimit.toFixed(2)} ({percentUsed.toFixed(0)}%)
          </span>
        </div>

        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3.5 overflow-hidden relative" role="progressbar" aria-valuenow={totalCost} aria-valuemin={0} aria-valuemax={budgetLimit}>
          <div
            className={`h-full transition-all duration-500 ease-out ${progressColorClass}`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">
            Total Ingredient Cost
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            ₹{totalCost.toFixed(2)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-1">
            Your Daily Limit
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            ₹{budgetLimit.toFixed(2)}
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isExceeded
            ? "bg-red-50/50 border-red-100 dark:bg-red-950/10 dark:border-red-950/40"
            : "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-950/40"
        }`}>
          <span className={`text-xs font-semibold block mb-1 ${
            isExceeded ? "text-red-500 dark:text-red-400" : "text-emerald-500 dark:text-emerald-400"
          }`}>
            {isExceeded ? "Over Budget Deficit" : "Remaining Savings"}
          </span>
          <span className={`text-xl font-bold ${
            isExceeded ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
          }`}>
            ₹{difference.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Warning/Success Banner */}
      {isExceeded ? (
        <div
          className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/15 border border-red-200 dark:border-red-950/60 text-red-800 dark:text-red-300"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="h-5 w-5 mt-0.5 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Budget Exceeded!</h3>
            <p className="text-xs text-red-700 dark:text-red-400/95 mt-1 leading-relaxed">
              Your consolidated grocery list exceeds the ₹{budgetLimit.toFixed(2)} daily limit by ₹{difference.toFixed(2)}.
              We recommend using the substitution tool below to swap expensive ingredients with cheaper options.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-200 dark:border-emerald-950/60 text-emerald-800 dark:text-emerald-300"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Under Budget!</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400/95 mt-1 leading-relaxed">
              Your meal plan fits within your set limit. You have saved ₹{difference.toFixed(2)} today. Good job!
            </p>
          </div>
        </div>
      )}

      {/* Cheaper Swaps Suggestions List */}
      {isExceeded && availableCheaperSwaps.length > 0 && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
            <TrendingDown className="h-4 w-4 text-emerald-500" />
            Recommended Budget Swaps
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {availableCheaperSwaps.map((suggestion, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs"
              >
                <div>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    Swap {suggestion.ingredientName}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 block mt-0.5">
                    For {suggestion.subName} in <span className="italic">{suggestion.recipeName}</span>
                  </span>
                </div>
                <button
                  onClick={() =>
                    onTriggerSwapSuggestions(
                      suggestion.recipeId,
                      suggestion.ingredientId,
                      suggestion.subIndex
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label={`Apply cheaper swap for ${suggestion.ingredientName}`}
                >
                  Save ₹{suggestion.savings.toFixed(2)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
