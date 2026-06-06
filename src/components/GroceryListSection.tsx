"use client";

import React, { useMemo } from "react";
import { CheckSquare, Square, ShoppingBag, Trash2 } from "lucide-react";
import { ConsolidatedItem } from "@/utils/planner";

interface GroceryListSectionProps {
  items: ConsolidatedItem[];
  onToggleItem: (itemId: string) => void;
  onClearChecked: () => void;
}

export const GroceryListSection: React.FC<GroceryListSectionProps> = ({
  items,
  onToggleItem,
  onClearChecked,
}) => {
  const checkedCount = useMemo(() => {
    return items.filter((item) => item.isChecked).length;
  }, [items]);

  return (
    <section
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-300"
      aria-labelledby="grocery-list-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="grocery-list-heading" className="text-xl font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            Step 3: Smart Grocery Checklist
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Consolidated ingredients with real-time costs
          </p>
        </div>

        {checkedCount > 0 && (
          <button
            onClick={onClearChecked}
            className="flex items-center gap-1.5 self-start text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-950 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Clear checked items from list"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Checked ({checkedCount})
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-zinc-400 dark:text-zinc-500 text-sm">
          No ingredients available. Select a schedule to generate a meal plan.
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {items.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`group flex items-center justify-between py-4 cursor-pointer select-none transition-all ${
                  item.isChecked ? "opacity-55" : ""
                }`}
                role="checkbox"
                aria-checked={item.isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    onToggleItem(item.id);
                  }
                }}
              >
                <div className="flex items-start gap-3.5 flex-1 pr-4">
                  <span
                    className={`mt-0.5 rounded-lg p-0.5 transition-colors ${
                      item.isChecked
                        ? "text-emerald-500 dark:text-emerald-400"
                        : "text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500"
                    }`}
                  >
                    {item.isChecked ? (
                      <CheckSquare className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Square className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <div className="space-y-1">
                    <span
                      className={`text-sm font-semibold transition-all ${
                        item.isChecked
                          ? "line-through text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-white"
                      }`}
                    >
                      {item.name}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                      <span>{item.quantity}</span>
                      <span>•</span>
                      <span>Needed for: {item.recipeNames.join(", ")}</span>
                      {item.isSwapped && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 text-2xs font-semibold uppercase bg-emerald-100/40 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                            Swapped
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold ${
                      item.isChecked
                        ? "text-zinc-400 dark:text-zinc-500"
                        : "text-zinc-900 dark:text-white"
                    }`}
                  >
                    ₹{item.estimatedCost.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
