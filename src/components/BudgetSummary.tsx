"use client";

import React, { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

interface BudgetSummaryProps {
  totalCost: number;
  budgetLimit: number;
  onOptimizeClick?: () => void;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  totalCost,
  budgetLimit,
  onOptimizeClick,
}) => {
  const isExceeded = totalCost > budgetLimit;
  const percentUsed = budgetLimit > 0 ? Math.min((totalCost / budgetLimit) * 100, 100) : 100;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-sm transition-colors duration-300 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-3xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold font-mono">
            Weekly Budget Status
          </span>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
            Budget Feasibility
          </h3>
        </div>
        <div className="text-right">
          <span className={`text-xl font-black font-mono block ${isExceeded ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            ₹{totalCost.toFixed(2)} / ₹{budgetLimit.toFixed(2)}
          </span>
          <span className="text-3xs text-zinc-400 dark:text-zinc-500 font-medium font-mono block">
            Estimated Total Cost
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            isExceeded ? "bg-red-600" : "bg-emerald-800"
          }`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      {/* Exceeded Banner */}
      {isExceeded && (
        <div className="bg-[#fff4f2] dark:bg-red-950/15 border border-[#ffe4e0] dark:border-red-950/40 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-red-800 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span className="text-xs font-semibold">
              Budget Exceeded: Try swapping ingredients for cost-effective alternatives.
            </span>
          </div>
          <button
            onClick={onOptimizeClick}
            className="text-xs font-extrabold text-red-700 dark:text-red-400 hover:text-red-800 underline flex-shrink-0 cursor-pointer"
          >
            Optimize Now
          </button>
        </div>
      )}
    </div>
  );
};
