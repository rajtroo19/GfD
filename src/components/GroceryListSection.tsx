"use client";

import React, { useMemo, useState } from "react";
import { CheckSquare, Square, Filter, Download, Sparkles, MapPin } from "lucide-react";
import { ConsolidatedItem } from "@/utils/planner";

interface GroceryListSectionProps {
  items: ConsolidatedItem[];
  onToggleItem: (itemId: string) => void;
  onClearChecked: () => void;
  recipesRaw: any[];
  activeSubs: any[];
  onSwapIngredient: (recipeId: string, ingredientId: string, substituteIndex: number) => void;
}

export const GroceryListSection: React.FC<GroceryListSectionProps> = ({
  items,
  onToggleItem,
  onClearChecked,
  recipesRaw,
  activeSubs,
  onSwapIngredient,
}) => {
  const [autoOptimize, setAutoOptimize] = useState(false);

  // Group items by category helper
  const getCategory = (itemName: string, baseName: string): string => {
    const lower = (itemName + " " + baseName).toLowerCase();
    if (
      lower.includes("paneer") ||
      lower.includes("egg") ||
      lower.includes("tofu") ||
      lower.includes("soy") ||
      lower.includes("chicken") ||
      lower.includes("chana") ||
      lower.includes("lentil") ||
      lower.includes("protein") ||
      lower.includes("meat") ||
      lower.includes("fish") ||
      lower.includes("salmon")
    ) {
      return "Proteins";
    }
    if (
      lower.includes("potato") ||
      lower.includes("onion") ||
      lower.includes("tomato") ||
      lower.includes("coriander") ||
      lower.includes("spinach") ||
      lower.includes("apple") ||
      lower.includes("avocado") ||
      lower.includes("veggie") ||
      lower.includes("papaya") ||
      lower.includes("methi") ||
      lower.includes("fenugreek") ||
      lower.includes("lemon") ||
      lower.includes("garlic") ||
      lower.includes("chilli")
    ) {
      return "Fresh Produce";
    }
    if (
      lower.includes("rice") ||
      lower.includes("flour") ||
      lower.includes("sooji") ||
      lower.includes("rava") ||
      lower.includes("bread") ||
      lower.includes("grain") ||
      lower.includes("atta") ||
      lower.includes("poha") ||
      lower.includes("dhokla") ||
      lower.includes("thepla")
    ) {
      return "Grains & Bakery";
    }
    return "Pantry & Dairy";
  };

  // Group items
  const groupedItems = useMemo(() => {
    const groups: Record<string, ConsolidatedItem[]> = {
      "Fresh Produce": [],
      "Proteins": [],
      "Grains & Bakery": [],
      "Pantry & Dairy": [],
    };

    items.forEach((item) => {
      const cat = getCategory(item.name, item.baseName);
      if (groups[cat]) {
        groups[cat].push(item);
      } else {
        groups[cat] = [item];
      }
    });

    return groups;
  }, [items]);

  // Find all available cheaper swaps
  const availableCheaperSwaps = useMemo(() => {
    const swaps: { recipeId: string; ingredientId: string; subIndex: number; savings: number }[] = [];

    recipesRaw.forEach((recipe) => {
      recipe.ingredients.forEach((ing: any) => {
        // Check if not already swapped
        const isSwapped = activeSubs.some(
          (sub) => sub.recipeId === recipe.id && sub.ingredientId === ing.id && sub.substituteIndex !== -1
        );

        if (!isSwapped) {
          ing.substitutes.forEach((sub: any, idx: number) => {
            if (sub.type === "cheaper" && sub.estimatedCost < ing.estimatedCost) {
              swaps.push({
                recipeId: recipe.id,
                ingredientId: ing.id,
                subIndex: idx,
                savings: ing.estimatedCost - sub.estimatedCost,
              });
            }
          });
        }
      });
    });

    return swaps;
  }, [recipesRaw, activeSubs]);

  const totalSavings = useMemo(() => {
    return availableCheaperSwaps.reduce((acc, s) => acc + s.savings, 0);
  }, [availableCheaperSwaps]);

  const handleApplyAllSavings = () => {
    availableCheaperSwaps.forEach((swap) => {
      onSwapIngredient(swap.recipeId, swap.ingredientId, swap.subIndex);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column - Checklist */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-[32px] p-6 md:p-8 shadow-sm transition-colors duration-300 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Shopping List</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-transparent text-zinc-700 dark:text-zinc-300">
              <Filter className="h-3.5 w-3.5" />
              Categories
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-transparent text-zinc-700 dark:text-zinc-300">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedItems).map(([categoryName, categoryItems]) => {
            if (categoryItems.length === 0) return null;
            return (
              <div key={categoryName} className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    {categoryName}
                  </span>
                  <span className="text-3xs text-zinc-400 dark:text-zinc-500 font-medium font-mono">
                    {categoryItems.length} items
                  </span>
                </div>
                <div className="divide-y divide-zinc-50 dark:divide-zinc-855/30">
                  {categoryItems.map((item) => {
                    return (
                      <div
                        key={item.id}
                        onClick={() => onToggleItem(item.id)}
                        className={`flex items-center justify-between py-3 cursor-pointer select-none transition-all ${
                          item.isChecked ? "opacity-45" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                          <span
                            className={`mt-0.5 transition-colors ${
                              item.isChecked
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-zinc-400 dark:text-zinc-600"
                            }`}
                          >
                            {item.isChecked ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </span>
                          <div className="space-y-0.5 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                item.isChecked
                                  ? "line-through text-zinc-400 dark:text-zinc-500"
                                  : "text-zinc-900 dark:text-white"
                              }`}
                            >
                              {item.name}
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-light truncate">
                              {item.quantity} • Needed for: {item.recipeNames.join(", ")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {item.isSwapped && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-3xs font-extrabold tracking-wider uppercase border border-emerald-100 dark:border-emerald-900/30">
                              Swapped
                            </span>
                          )}
                          <span className="text-sm font-bold font-mono text-zinc-900 dark:text-white">
                            ₹{item.estimatedCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column - Sidecards */}
      <div className="lg:col-span-4 space-y-6">
        {/* Smart Substitutions Panel */}
        <div className="bg-[#0b3c2a] text-white border border-emerald-950 rounded-[32px] p-6 space-y-6 shadow-sm">
          <div className="space-y-3">
            <h4 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Smart Substitutions
            </h4>
            <p className="text-xs text-emerald-350 leading-relaxed font-light">
              Our engine found {availableCheaperSwaps.length} cost-saving alternatives that fit your dietary profile.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between border-t border-emerald-800/40 pt-4">
            <span className="text-xs font-semibold text-emerald-250">Enable Auto-Optimize</span>
            <button
              onClick={() => setAutoOptimize(!autoOptimize)}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
                autoOptimize ? "bg-emerald-500" : "bg-emerald-850"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                  autoOptimize ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleApplyAllSavings}
            disabled={totalSavings <= 0}
            className="w-full py-3 bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:hover:bg-white text-[#0b3c2a] rounded-xl text-sm font-bold transition-all shadow-md"
          >
            Apply All Savings (-₹{totalSavings.toFixed(2)})
          </button>
        </div>

        {/* Nearest Marketplace Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-sm transition-colors duration-300 flex flex-col min-h-[260px]">
          <div className="h-32 bg-zinc-100 dark:bg-zinc-800 relative">
            <img
              src="/map_mockup.png"
              alt="Nearest marketplace map mockup"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 dark:from-zinc-900/95 via-transparent to-transparent"></div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Nearest Marketplace
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">
                Reliance Fresh / Local Mandi - 0.4 km away
              </p>
            </div>
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-850 dark:text-emerald-300 text-3xs font-extrabold tracking-wider uppercase border border-emerald-150 dark:border-emerald-900/30">
              In Stock (92%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
