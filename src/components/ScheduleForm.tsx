"use client";

import React, { useId, useCallback } from "react";
import { Clock, Utensils, Flame } from "lucide-react";
import { sanitizeNumberInput, CUISINES_LIST } from "@/utils/planner";

export type ScheduleType = "busy" | "standard" | "relaxed";

interface ScheduleFormProps {
  schedule: ScheduleType;
  setSchedule: (val: ScheduleType) => void;
  budgetLimit: number;
  setBudgetLimit: (val: number) => void;
  dietaryAlignments: string[];
  setDietaryAlignments: (val: string[]) => void;
  cuisine: string;
  setCuisine: (val: string) => void;
  initializePlan: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  setSchedule,
  budgetLimit,
  setBudgetLimit,
  dietaryAlignments,
  setDietaryAlignments,
  cuisine,
  setCuisine,
  initializePlan,
}) => {
  const budgetInputId = useId();
  const cuisineSelectId = useId();

  // Handle budget input changes with sanitization
  const handleBudgetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeNumberInput(e.target.value, 0);
      setBudgetLimit(sanitized);
    },
    [setBudgetLimit]
  );

  const toggleDietaryAlignment = (val: string) => {
    if (dietaryAlignments.includes(val)) {
      setDietaryAlignments(dietaryAlignments.filter((item) => item !== val));
    } else {
      setDietaryAlignments([...dietaryAlignments, val]);
    }
  };

  const scheduleOptions: { value: ScheduleType; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: "busy",
      label: "Busy",
      desc: "15-min meals only",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      value: "standard",
      label: "Standard",
      desc: "Balanced prep time",
      icon: <Utensils className="h-5 w-5" />,
    },
    {
      value: "relaxed",
      label: "Relaxed",
      desc: "Time for slow cooking",
      icon: <Flame className="h-5 w-5" />,
    },
  ];

  const dietOptions = ["Vegan", "Keto", "Gluten-Free", "Paleo", "Low Carb"];

  return (
    <div className="max-w-6xl w-full mx-auto bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[620px] transition-colors duration-300">
      {/* Left Pane - Hero Card */}
      <div className="md:col-span-5 relative bg-zinc-950 text-white p-8 flex flex-col justify-end min-h-[350px] md:min-h-full m-3 rounded-[24px] overflow-hidden">
        <img
          src="/prep_boxes_image.png"
          alt="Clean food prep boxes containing greens"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-955 via-zinc-900/35 to-transparent"></div>
        <div className="relative z-10 space-y-3">
          <h3 className="text-3xl font-bold tracking-tight font-sans">The Disciplined Sous-Chef</h3>
          <p className="text-sm text-zinc-300 leading-relaxed font-sans font-light">
            Let's blueprint your day. Your intensity and preferences guide our precision planning.
          </p>
        </div>
      </div>

      {/* Right Pane - Form Controls */}
      <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-8">
        <div className="space-y-6">
          {/* Day Intensity Section */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Day Intensity</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              How much time can we dedicate to the kitchen today?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scheduleOptions.map((opt) => {
                const isSelected = schedule === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSchedule(opt.value)}
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-emerald-700 bg-emerald-950/10 dark:bg-emerald-950/20 ring-1 ring-emerald-700"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`p-1.5 rounded-lg ${isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                        {opt.icon}
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-zinc-900 dark:text-white mb-0.5">
                      {opt.label}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary Alignment Section */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Dietary Alignment</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Select all that apply for your nutritional architecture.
            </p>
            <div className="flex flex-wrap gap-2">
              {dietOptions.map((opt) => {
                const isSelected = dietaryAlignments.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleDietaryAlignment(opt)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 bg-transparent"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cuisine Style Section */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Cuisine Style</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
              Select your preferred regional cooking style.
            </p>
            <div className="relative">
              <select
                id={cuisineSelectId}
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 px-4 text-zinc-900 dark:text-white focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 text-sm transition-all appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.25rem",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {CUISINES_LIST.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Daily Budget Limit Section */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Daily Budget Limit</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Efficiency includes the wallet. Set your maximum spend.
            </p>
            <div className="relative max-w-xs rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold">₹</span>
              </div>
              <input
                id={budgetInputId}
                type="text"
                value={budgetLimit || ""}
                onChange={handleBudgetChange}
                placeholder="0.00"
                className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 py-3 pl-8 pr-4 text-zinc-900 dark:text-white font-medium placeholder:text-zinc-400 focus:border-emerald-700 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-150 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
            Step 1 of 3: Environment Setup
          </span>
          <button
            onClick={initializePlan}
            className="px-6 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-sm transition-all shadow-md shadow-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            Initialize Plan
          </button>
        </div>
      </div>
    </div>
  );
};
