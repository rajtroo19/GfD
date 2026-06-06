"use client";

import React, { useId, useCallback } from "react";
import { Zap, Calendar, Smile, Leaf, Utensils } from "lucide-react";
import { sanitizeNumberInput, CUISINES_LIST } from "@/utils/planner";

export type ScheduleType = "busy" | "standard" | "relaxed";

interface ScheduleFormProps {
  schedule: ScheduleType;
  setSchedule: (val: ScheduleType) => void;
  budgetLimit: number;
  setBudgetLimit: (val: number) => void;
  dietPreference: string;
  setDietPreference: (val: string) => void;
  cuisine: string;
  setCuisine: (val: string) => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  setSchedule,
  budgetLimit,
  setBudgetLimit,
  dietPreference,
  setDietPreference,
  cuisine,
  setCuisine,
}) => {
  const budgetInputId = useId();
  const dietSelectId = useId();
  const cuisineSelectId = useId();

  // Handle budget input changes with sanitization
  const handleBudgetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeNumberInput(e.target.value, 0);
      setBudgetLimit(sanitized);
    },
    [setBudgetLimit]
  );

  const scheduleOptions: { value: ScheduleType; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: "busy",
      label: "Busy",
      desc: "Fast, 5-15 min recipes",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
    },
    {
      value: "standard",
      label: "Standard",
      desc: "Balanced, 15-30 min recipes",
      icon: <Calendar className="h-5 w-5 text-emerald-500" />,
    },
    {
      value: "relaxed",
      label: "Relaxed",
      desc: "Gourmet, 30+ min recipes",
      icon: <Smile className="h-5 w-5 text-indigo-500" />,
    },
  ];

  return (
    <section
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-300"
      aria-labelledby="form-heading"
    >
      <h2 id="form-heading" className="text-xl font-semibold text-zinc-950 dark:text-white mb-6">
        Step 1: Your Day's Context
      </h2>

      <div className="space-y-6">
        {/* Schedule Type Segmented Selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            What does your schedule look like today?
          </label>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
            role="radiogroup"
            aria-label="Schedule intensity selection"
          >
            {scheduleOptions.map((opt) => {
              const isSelected = schedule === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSchedule(opt.value)}
                  role="radio"
                  aria-checked={isSelected}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      {opt.icon}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Inputs: Budget, Diet Preference, Cuisine Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Budget Limit */}
          <div className="flex flex-col">
            <label
              htmlFor={budgetInputId}
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5"
            >
              <span className="font-bold text-emerald-600 dark:text-emerald-400">₹</span>
              Daily Budget Limit (₹)
            </label>
            <div className="relative rounded-2xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">₹</span>
              </div>
              <input
                id={budgetInputId}
                type="text"
                value={budgetLimit || ""}
                onChange={handleBudgetChange}
                placeholder="Limit in Rupees (e.g. 250)"
                className="block w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent py-3 pl-8 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all"
                aria-required="true"
                aria-describedby="budget-desc"
              />
            </div>
            <span id="budget-desc" className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
              Grocery costs are calculated in Indian Rupees (₹).
            </span>
          </div>

          {/* Cuisine Type */}
          <div className="flex flex-col">
            <label
              htmlFor={cuisineSelectId}
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5"
            >
              <Utensils className="h-4 w-4 text-emerald-500" />
              Cuisine Style
            </label>
            <select
              id={cuisineSelectId}
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="block w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 px-4 text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.25rem",
                backgroundRepeat: "no-repeat",
              }}
              aria-label="Cuisine type selection"
            >
              {CUISINES_LIST.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
              Select your preferred culinary style.
            </span>
          </div>

          {/* Dietary Preference */}
          <div className="flex flex-col">
            <label
              htmlFor={dietSelectId}
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5"
            >
              <Leaf className="h-4 w-4 text-emerald-500" />
              Dietary Preference
            </label>
            <select
              id={dietSelectId}
              value={dietPreference}
              onChange={(e) => setDietPreference(e.target.value)}
              className="block w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 px-4 text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm transition-all appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.25rem",
                backgroundRepeat: "no-repeat",
              }}
              aria-label="Dietary preference selection"
            >
              <option value="everything">Everything (Veg/Non-Veg)</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
              <option value="keto">Keto</option>
            </select>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
              Filters recipes by ingredients.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
