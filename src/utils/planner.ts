// Types and interfaces for PrepPal
export interface Substitute {
  name: string;
  estimatedCost: number; // in INR (₹)
  type: "cheaper" | "dietary" | "general";
  quantity: string;
  amount: number;
  unit: string;
}

export interface Ingredient {
  id: string;
  name: string;
  baseName: string;
  quantity: string;
  amount: number;
  unit: string;
  estimatedCost: number; // in INR (₹)
  substitutes: Substitute[];
}

export interface Recipe {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  difficulty: "easy" | "medium" | "hard";
  instructions: string[];
  dietaryPreferences: string[]; // e.g., ["vegan", "vegetarian", "gluten-free", "keto"]
  scheduleComplexity: "busy" | "standard" | "relaxed";
  cuisine: string;
  ingredients: Ingredient[];
}

export interface ActiveSubstitution {
  recipeId: string;
  ingredientId: string;
  substituteIndex: number; // -1 if base ingredient is selected, index of substitute otherwise
}

// Input Sanitization to protect against XSS
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizeNumberInput(input: string, defaultValue = 0): number {
  if (!input) return defaultValue;
  const parsed = parseFloat(input.replace(/[^\d.]/g, ""));
  return isNaN(parsed) ? defaultValue : parsed;
}

// List of all 20 cuisines
export const CUISINES_LIST = [
  { value: "north indian", label: "North Indian" },
  { value: "south indian", label: "South Indian" },
  { value: "gujarati", label: "Gujarati" },
  { value: "rajasthani", label: "Rajasthani" },
  { value: "maharashtrian", label: "Maharashtrian" },
  { value: "bengali", label: "Bengali" },
  { value: "punjabi", label: "Punjabi" },
  { value: "kashmiri", label: "Kashmiri" },
  { value: "goan", label: "Goan" },
  { value: "kerala", label: "Kerala" },
  { value: "andhra/telangana", label: "Andhra / Telangana" },
  { value: "karnataka", label: "Karnataka" },
  { value: "assamese", label: "Assamese" },
  { value: "north-eastern", label: "North-Eastern" },
  { value: "jain", label: "Jain Cuisine" },
  { value: "vegetarian", label: "General Indian Vegetarian" },
  { value: "vegan", label: "Indian Vegan" },
  { value: "high-protein indian", label: "High-Protein Indian" },
  { value: "millet-based indian", label: "Millet-Based Indian" },
  { value: "street food inspired", label: "Street Food Inspired" },
];

// Rich data dictionary mapping cuisines to authentic dishes
interface CuisineMeals {
  breakfast: { name: string; ingredients: Ingredient[]; instructions: string[] };
  lunch: { name: string; ingredients: Ingredient[]; instructions: string[] };
  dinner: { name: string; ingredients: Ingredient[]; instructions: string[] };
}

const CUISINE_DATABASE: Record<string, CuisineMeals> = {
  "north indian": {
    breakfast: {
      name: "Spiced Aloo Paratha with White Butter & Dahi",
      ingredients: [
        { id: "ni-b-1", name: "Amul Fresh White Butter", baseName: "Butter", quantity: "50g", amount: 50, unit: "g", estimatedCost: 35, substitutes: [{ name: "Refined Mustard Oil", estimatedCost: 8, type: "cheaper", quantity: "50ml", amount: 50, unit: "ml" }] },
        { id: "ni-b-2", name: "Pahadi Aloo (Mountain Potatoes)", baseName: "Potatoes", quantity: "300g", amount: 300, unit: "g", estimatedCost: 20, substitutes: [{ name: "Local White Potatoes", estimatedCost: 10, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] }
      ],
      instructions: ["Knead wheat dough. Stuff with mashed boiled potatoes spiced with Garam Masala, dry mango (Amchur) powder, and green chillies.", "Cook on tawa with ghee.", "Serve hot with white butter and cold dahi."]
    },
    lunch: {
      name: "Shahi Paneer Butter Masala & Garlic Naan",
      ingredients: [
        { id: "ni-l-1", name: "Fresh Premium Dairy Paneer", baseName: "Paneer", quantity: "250g", amount: 250, unit: "g", estimatedCost: 110, substitutes: [{ name: "Fresh Organic Soy Tofu", estimatedCost: 45, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "ni-l-2", name: "Whole Cashew Nuts (Kaju)", baseName: "Cashews", quantity: "50g", amount: 50, unit: "g", estimatedCost: 60, substitutes: [{ name: "Peeled Melon Seeds (Magajtari)", estimatedCost: 15, type: "cheaper", quantity: "50g", amount: 50, unit: "g" }] }
      ],
      instructions: ["Sauté onions, ginger, garlic, tomatoes, cashew nuts, and Kashmiri red chilli. Blend into a silky smooth paste.", "Cook paneer cubes in this gravy with butter, Kasuri Methi, and fresh cream.", "Serve hot with garlic naan."]
    },
    dinner: {
      name: "Dhaba Style Kadhai Masala Chicken / Veg Paneer & Kesar Rice",
      ingredients: [
        { id: "ni-d-1", name: "Fresh Chicken Breast / Paneer", baseName: "Protein", quantity: "400g", amount: 400, unit: "g", estimatedCost: 180, substitutes: [{ name: "High-protein Soya Chunks", estimatedCost: 30, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "ni-d-2", name: "Pure Kashmiri Kesar (Saffron) strands", baseName: "Kesar", quantity: "0.5g", amount: 0.5, unit: "g", estimatedCost: 150, substitutes: [{ name: "Turmeric (Haldi) spice powder", estimatedCost: 5, type: "cheaper", quantity: "2g", amount: 2, unit: "g" }] }
      ],
      instructions: ["Marinate protein in curd, ginger-garlic, tandoori masala. Pan-sear.", "Simmer in a rich, velvety tomato butter gravy infused with cardamom and Kasuri Methi.", "Serve with Jeera Rice cooked with saffron strands."]
    }
  },
  "south indian": {
    breakfast: {
      name: "Rava Idli with Fresh Coconut Chutney & Filter Coffee",
      ingredients: [
        { id: "si-b-1", name: "Roasted Sooji (Rava) Pack", baseName: "Rava", quantity: "250g", amount: 250, unit: "g", estimatedCost: 35, substitutes: [{ name: "Loose Semolina", estimatedCost: 15, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "si-b-2", name: "Fresh Grated Coconut", baseName: "Coconut", quantity: "100g", amount: 100, unit: "g", estimatedCost: 40, substitutes: [{ name: "Dry Roasted Coconut Flakes", estimatedCost: 20, type: "cheaper", quantity: "100g", amount: 100, unit: "g" }] }
      ],
      instructions: ["Mix Rava with sour curd, soda, mustard tempering, curry leaves, and steam in idli plates.", "Grind coconut with green chillies, ginger, and roasted chana dal.", "Serve hot with southern filter coffee."]
    },
    lunch: {
      name: "Sambar Sadam, Beetroot Thoran & Appalam",
      ingredients: [
        { id: "si-l-1", name: "Surti Kolam Rice & Toor Dal Mix", baseName: "Rice & Dal", quantity: "250g", amount: 250, unit: "g", estimatedCost: 45, substitutes: [{ name: "Broken Rice & Yellow Moong", estimatedCost: 20, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "si-l-2", name: "Fresh Beetroot & Curry Leaves", baseName: "Veggies", quantity: "300g", amount: 300, unit: "g", estimatedCost: 30, substitutes: [{ name: "Cabbage Veggies", estimatedCost: 12, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] }
      ],
      instructions: ["Boil rice and toor dal together. Mash and add vegetables, tamarind pulp, and aromatic Sambar powder.", "Temper with mustard, red chillies, and curry leaves.", "Sauté chopped beetroot with grated coconut. Serve hot with fried Appalam."]
    },
    dinner: {
      name: "Ghee Roast Masala Dosa with Sambar & Tomato Chutney",
      ingredients: [
        { id: "si-d-1", name: "Fermented Urad Dal Rice Batter", baseName: "Dosa Batter", quantity: "500ml", amount: 500, unit: "ml", estimatedCost: 50, substitutes: [{ name: "Instant Rava Dosa Batter", estimatedCost: 30, type: "cheaper", quantity: "500ml", amount: 500, unit: "ml" }] },
        { id: "si-d-2", name: "Pure Cow Ghee for Crisping", baseName: "Ghee", quantity: "50g", amount: 50, unit: "g", estimatedCost: 65, substitutes: [{ name: "Refined Sunflower Oil", estimatedCost: 10, type: "cheaper", quantity: "50ml", amount: 50, unit: "ml" }] }
      ],
      instructions: ["Spread dosa batter thinly on a hot iron tawa. Drizzle ghee and cook till golden brown.", "Stuff with spiced mashed potatoes.", "Serve with fresh hot sambar and spicy onion-tomato chutney."]
    }
  },
  "gujarati": {
    breakfast: {
      name: "Adu-Aala Masala Chai & Spiced Methi Khakhra",
      ingredients: [
        { id: "gj-b-1", name: "Artisanal Methi Khakhra Packet", baseName: "Khakhra", quantity: "4 pcs", amount: 4, unit: "pcs", estimatedCost: 55, substitutes: [{ name: "Homemade Roti (Leftover) with ghee", estimatedCost: 10, type: "cheaper", quantity: "4 pcs", amount: 4, unit: "pcs" }] },
        { id: "gj-b-2", name: "Fresh Whole Buffalo Milk", baseName: "Milk", quantity: "250ml", amount: 250, unit: "ml", estimatedCost: 18, substitutes: [{ name: "Double Toned Dairy Milk", estimatedCost: 13, type: "cheaper", quantity: "250ml", amount: 250, unit: "ml" }] }
      ],
      instructions: ["Crush fresh ginger (Adu), lemongrass, and cardamom. Boil with tea dust.", "Add milk and sugar, boil 3 times, strain.", "Serve hot with crispy hand-pressed Methi Khakhra."]
    },
    lunch: {
      name: "Khati-Meethi Tuvar Dal, Bhat & Spiced Chhas",
      ingredients: [
        { id: "gj-l-1", name: "Premium Surti Kolam Rice", baseName: "Rice", quantity: "150g", amount: 150, unit: "g", estimatedCost: 30, substitutes: [{ name: "Standard Broken Rice (Kani)", estimatedCost: 12, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "gj-l-2", name: "Tuvar Dal, Kolhapur Jaggery & Kokum Kit", baseName: "Dal ingredients", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 45, substitutes: [{ name: "Loose Tuvar Dal (no Jaggery/Kokum)", estimatedCost: 22, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Boil Tuvar Dal. Blend with peanuts, turmeric, Jaggery (Gor), and Kokum.", "Temper with oil, mustard (Rai), cumin (Jeeru), cloves, and Hing.", "Serve with steamed rice and buttermilk with roasted cumin powder."]
    },
    dinner: {
      name: "Gujarati Kathiyawadi Thali (Rotli, Ringan Shaak, Kadhi, Khichdi)",
      ingredients: [
        { id: "gj-d-1", name: "Pure Desi Cow Ghee (A2 quality)", baseName: "Ghee", quantity: "50g", amount: 50, unit: "g", estimatedCost: 65, substitutes: [{ name: "Refined Groundnut Oil", estimatedCost: 12, type: "cheaper", quantity: "50ml", amount: 50, unit: "ml" }] },
        { id: "gj-d-2", name: "Fresh Ringan (Eggplant) & Bataka (Potato) Veggies", baseName: "Veggies", quantity: "500g", amount: 500, unit: "g", estimatedCost: 75, substitutes: [{ name: "Local Cabbage & Potato Mix", estimatedCost: 30, type: "cheaper", quantity: "500g", amount: 500, unit: "g" }] }
      ],
      instructions: ["Prepare soft wheat flour Rotlis.", "Sauté eggplant and potatoes in Dhana-Jeera powder, turmeric, and garlic chutney.", "Boil sour curd kadhi tempered with fenugreek (Methi) and red chillies. Serve with yellow Moong Dal Khichdi."]
    }
  },
  "rajasthani": {
    breakfast: {
      name: "Sajji Poha with Ratlami Laung Sev & Chai",
      ingredients: [
        { id: "rj-b-1", name: "Spiced Ratlami Laung Sev", baseName: "Sev Namkeen", quantity: "80g", amount: 80, unit: "g", estimatedCost: 45, substitutes: [{ name: "Plain Besan Sev/Farsan", estimatedCost: 15, type: "cheaper", quantity: "80g", amount: 80, unit: "g" }] },
        { id: "rj-b-2", name: "Organic Raw Groundnuts (Peanuts)", baseName: "Peanuts", quantity: "50g", amount: 50, unit: "g", estimatedCost: 20, substitutes: [{ name: "Omit Peanuts (Plain Poha)", estimatedCost: 0, type: "cheaper", quantity: "0g", amount: 0, unit: "g" }] }
      ],
      instructions: ["Steam washed Poha with turmeric and green chillies.", "Temper with mustard seeds, curry leaves, and fennel seeds (Saunf).", "Serve topped with Ratlami Sev, raw onions, and fresh lemon juice."]
    },
    lunch: {
      name: "Rajasthani Gatte ki Sabji & Tawa Roti",
      ingredients: [
        { id: "rj-l-1", name: "High-grade Chana Dal Besan", baseName: "Besan", quantity: "200g", amount: 200, unit: "g", estimatedCost: 35, substitutes: [{ name: "Loose Gram Flour", estimatedCost: 18, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "rj-l-2", name: "Organic Sour Curd (Dahi)", baseName: "Curd", quantity: "250g", amount: 250, unit: "g", estimatedCost: 35, substitutes: [{ name: "Homemade Buttermilk", estimatedCost: 10, type: "cheaper", quantity: "250ml", amount: 250, unit: "ml" }] }
      ],
      instructions: ["Knead Besan with carom seeds (Ajwain) and red chilli. Roll, boil, and slice into Gatte.", "Simmer Gatte in a spicy gravy of sour yogurt, Hing, and coriander powder.", "Serve with wheat rotis."]
    },
    dinner: {
      name: "Mewari Dal Baati & Cardamom Churma",
      ingredients: [
        { id: "rj-d-1", name: "Pure Desi Cow Ghee (Mewar Farm)", baseName: "Ghee", quantity: "150g", amount: 150, unit: "g", estimatedCost: 185, substitutes: [{ name: "Amul Premium Ghee", estimatedCost: 98, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "rj-d-2", name: "Authentic Mathania Red Chilli & Panch Dal Kit", baseName: "Spices & Lentils", quantity: "250g", amount: 250, unit: "g", estimatedCost: 70, substitutes: [{ name: "Regular Toor Dal & Guntur Red Chilli", estimatedCost: 35, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] }
      ],
      instructions: ["Bake wheat-semolina Baatis in a clay oven. Crack and dunk in pure ghee.", "Cook a slow-simmered Panchmel Dal spiced with dried Mathania red chillies.", "Prepare Churma by crushing baked baatis with ghee, organic jaggery, and cardamom."]
    }
  },
  "maharashtrian": {
    breakfast: {
      name: "Kanda Batata Poha & Hot Ginger Tea",
      ingredients: [
        { id: "mh-b-1", name: "Premium Thick Poha", baseName: "Poha", quantity: "200g", amount: 200, unit: "g", estimatedCost: 25, substitutes: [{ name: "Loose Flaked Rice", estimatedCost: 12, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "mh-b-2", name: "Fresh Onion (Kanda) & Potatoes", baseName: "Veggies", quantity: "200g", amount: 200, unit: "g", estimatedCost: 15, substitutes: [{ name: "Onion Only", estimatedCost: 8, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] }
      ],
      instructions: ["Wash and strain Poha. Toss with turmeric.", "Sauté onions, potatoes, green chillies, curry leaves, and mustard seeds.", "Mix in Poha, steam for 5 mins, serve with grated coconut and coriander."]
    },
    lunch: {
      name: "Kolhapuri Misal Pav & Butter Milk",
      ingredients: [
        { id: "mh-l-1", name: "Sprouted Matki (Moth Beans)", baseName: "Sprouts", quantity: "150g", amount: 150, unit: "g", estimatedCost: 30, substitutes: [{ name: "Sprouted Green Moong", estimatedCost: 20, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "mh-l-2", name: "Spicy Kolhapuri Farsan & Pav Pack", baseName: "Farsan & Bread", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 55, substitutes: [{ name: "Plain Sev & Local Bun Bread", estimatedCost: 25, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Cook sprouted Matki. Prepare a fiery red coconut-onion watery gravy (Katar/Tarri) spiced with Kolhapuri Masala.", "Top Matki with spicy farsan, raw onions, and coriander.", "Ladle hot Tarri over it and serve with buttery Pav."]
    },
    dinner: {
      name: "Zunka Bhakri, Lasun Chutney & Solkadhi",
      ingredients: [
        { id: "mh-d-1", name: "Organic Jowar Flour (for Bhakri)", baseName: "Jowar Flour", quantity: "250g", amount: 250, unit: "g", estimatedCost: 40, substitutes: [{ name: "Bajra Flour", estimatedCost: 25, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "mh-d-2", name: "Kokum & Fresh Coconut Milk (for Solkadhi)", baseName: "Solkadhi Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 60, substitutes: [{ name: "Kokum & Spiced Buttermilk", estimatedCost: 15, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Prepare dry chickpea flour paste (Zunka) sautéed with onions, green chillies, and garlic.", "Pat Jowar dough by hand and bake bhakri on clay tawa.", "Serve with spicy wet dry garlic-chilli chutney and solkadhi."]
    }
  },
  "bengali": {
    breakfast: {
      name: "Luchi & Narkel Diye Cholar Dal",
      ingredients: [
        { id: "be-b-1", name: "Fine Maida Flour (for Luchi)", baseName: "Maida", quantity: "250g", amount: 250, unit: "g", estimatedCost: 20, substitutes: [{ name: "Whole Wheat Atta", estimatedCost: 12, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "be-b-2", name: "Bengal Gram (Chana Dal) & Coconut slices", baseName: "Chana Dal Kit", quantity: "150g", amount: 150, unit: "g", estimatedCost: 35, substitutes: [{ name: "Plain Chana Dal", estimatedCost: 18, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] }
      ],
      instructions: ["Roll soft maida dough into thin circles and deep fry into puffed white Luchis.", "Boil Chana Dal. Sauté with bay leaves, cumin, ginger paste, and crispy fried coconut bits.", "Serve together hot."]
    },
    lunch: {
      name: "Sarse Maach / Alur Posto & Gobindobhog Bhaat",
      ingredients: [
        { id: "be-l-1", name: "Fresh Fish Cutlets / Paneer Blocks", baseName: "Protein", quantity: "300g", amount: 300, unit: "g", estimatedCost: 150, substitutes: [{ name: "Fresh Local Potatoes (for Alur Posto)", estimatedCost: 15, type: "cheaper", quantity: "500g", amount: 500, unit: "g" }] },
        { id: "be-l-2", name: "Aromatic Gobindobhog Rice", baseName: "Rice", quantity: "200g", amount: 200, unit: "g", estimatedCost: 55, substitutes: [{ name: "Sona Masoori Rice", estimatedCost: 20, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] }
      ],
      instructions: ["Coat protein with turmeric and salt, pan fry in mustard oil.", "Cook in a thick paste of ground black mustard seeds and green chillies.", "Serve over hot Gobindobhog rice."]
    },
    dinner: {
      name: "Begun Bhaja, Biulir Dal & Steamed Bhaat",
      ingredients: [
        { id: "be-d-1", name: "Large Purple Eggplant (Aubergine)", baseName: "Eggplant", quantity: "1 pc", amount: 1, unit: "pcs", estimatedCost: 35, substitutes: [{ name: "Sliced Potatoes", estimatedCost: 10, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] },
        { id: "be-d-2", name: "Biulir Dal (Split Urad Dal) & Mauri (Fennel)", baseName: "Dal Kit", quantity: "150g", amount: 150, unit: "g", estimatedCost: 40, substitutes: [{ name: "Yellow Moong Dal", estimatedCost: 20, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] }
      ],
      instructions: ["Slice eggplants into rounds, marinate in turmeric, sugar, and salt. Pan fry in mustard oil until caramelized.", "Cook Urad Dal flavored with ginger and fennel paste.", "Serve with steamed rice."]
    }
  },
  "punjabi": {
    breakfast: {
      name: "Amritsari Aloo Kulcha with Chole & Sweet Lassi",
      ingredients: [
        { id: "pb-b-1", name: "Kabuli Chana (Chickpeas) pack", baseName: "Chickpeas", quantity: "200g", amount: 200, unit: "g", estimatedCost: 40, substitutes: [{ name: "Dried White Peas (Vatana)", estimatedCost: 20, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "pb-b-2", name: "Amul Thick Curd (for Lassi)", baseName: "Curd", quantity: "200g", amount: 200, unit: "g", estimatedCost: 28, substitutes: [{ name: "Homemade Buttermilk", estimatedCost: 10, type: "cheaper", quantity: "200ml", amount: 200, unit: "ml" }] }
      ],
      instructions: ["Boil chickpeas with black cardamom and tea bag. Simmer in dry pomegranate-spiced tomato gravy.", "Bake stuffed potato kulchas on a tawa.", "Blend curd with sugar and cardamom for creamy lassi."]
    },
    lunch: {
      name: "Sarson ka Saag & Makki di Roti with Jaggery",
      ingredients: [
        { id: "pb-l-1", name: "Fresh Mustard Greens & Spinach leaves", baseName: "Greens", quantity: "500g", amount: 500, unit: "g", estimatedCost: 50, substitutes: [{ name: "Frozen Leafy Greens", estimatedCost: 30, type: "cheaper", quantity: "500g", amount: 500, unit: "g" }] },
        { id: "pb-l-2", name: "Makki Atta (Yellow Corn Flour)", baseName: "Corn Flour", quantity: "250g", amount: 250, unit: "g", estimatedCost: 35, substitutes: [{ name: "Whole Wheat Atta", estimatedCost: 12, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] }
      ],
      instructions: ["Boil mustard and spinach leaves. Mash with cornmeal, garlic, ginger, and green chillies. Slow-cook.", "Temper with onions and lots of white butter.", "Roll yellow corn rotis on a plastic sheet, cook on tawa, serve with jaggery."]
    },
    dinner: {
      name: "Dal Makhani, Butter Roti & Jeera Bhat",
      ingredients: [
        { id: "pb-d-1", name: "Black Urad Dal & Rajma mix", baseName: "Dal Mix", quantity: "200g", amount: 200, unit: "g", estimatedCost: 45, substitutes: [{ name: "Simple Split Urad Dal", estimatedCost: 20, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "pb-d-2", name: "Amul Fresh Cream & Table Butter", baseName: "Cream & Butter", quantity: "100g", amount: 100, unit: "g", estimatedCost: 55, substitutes: [{ name: "Full Fat Milk", estimatedCost: 15, type: "cheaper", quantity: "250ml", amount: 250, unit: "ml" }] }
      ],
      instructions: ["Boil whole black lentils and kidney beans. Slow simmer for 4 hours with tomato puree and ginger.", "Stir in generous amounts of butter and cream.", "Serve with Jeera Rice and soft rotis."]
    }
  },
  "kashmiri": {
    breakfast: {
      name: "Kashmiri Noon Chai & Sheermal",
      ingredients: [
        { id: "ks-b-1", name: "Special Kashmiri Green Tea leaves", baseName: "Tea Leaves", quantity: "20g", amount: 20, unit: "g", estimatedCost: 40, substitutes: [{ name: "Regular Tea Dust", estimatedCost: 8, type: "cheaper", quantity: "20g", amount: 20, unit: "g" }] },
        { id: "ks-b-2", name: "Traditional Kashmiri Sheermal / Bakery Bun", baseName: "Bread", quantity: "2 pcs", amount: 2, unit: "pcs", estimatedCost: 50, substitutes: [{ name: "Local Rusk/Toast", estimatedCost: 15, type: "cheaper", quantity: "4 pcs", amount: 4, unit: "pcs" }] }
      ],
      instructions: ["Boil tea leaves with baking soda until red. Add milk and salt (pink tea/Noon Chai).", "Stir and serve hot.", "Accompany with soft saffron-flavored Sheermal bread."]
    },
    lunch: {
      name: "Kashmiri Dum Aloo & Zafrani Pulao",
      ingredients: [
        { id: "ks-l-1", name: "Small Baby Potatoes", baseName: "Potatoes", quantity: "400g", amount: 400, unit: "g", estimatedCost: 30, substitutes: [{ name: "Regular Cut Potatoes", estimatedCost: 15, type: "cheaper", quantity: "400g", amount: 400, unit: "g" }] },
        { id: "ks-l-2", name: "Kashmiri Fennel & Dry Ginger Powder Pack", baseName: "Spices", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 45, substitutes: [{ name: "Regular Garam Masala", estimatedCost: 10, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Prick baby potatoes, deep fry until golden.", "Simmer in a thick red gravy made of curd, Kashmiri red chilli paste, fennel (Saunf) powder, and dry ginger (Sonth) powder.", "Serve with sweet cardamom rice."]
    },
    dinner: {
      name: "Kashmiri Rogan Josh (Soya Chunks / Meat) & Rice",
      ingredients: [
        { id: "ks-d-1", name: "High-protein Soya Chunks / Mutton", baseName: "Protein", quantity: "300g", amount: 300, unit: "g", estimatedCost: 140, substitutes: [{ name: "Nutrela Soya Chunks Pack", estimatedCost: 30, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "ks-d-2", name: "Kashmiri Red Chilli Paste (Rogan Color)", baseName: "Red Chilli", quantity: "50g", amount: 50, unit: "g", estimatedCost: 40, substitutes: [{ name: "Standard Chilli Powder", estimatedCost: 15, type: "cheaper", quantity: "50g", amount: 50, unit: "g" }] }
      ],
      instructions: ["Sauté protein in mustard oil with cloves, bay leaves, and asafoetida.", "Slow cook with a paste of red chillies and fennel. Finish with Kashmiri Garam Masala.", "Serve hot with steamed rice."]
    }
  },
  "goan": {
    breakfast: {
      name: "Goan Pav Bhaji (Tonak) & Fresh Pav",
      ingredients: [
        { id: "go-b-1", name: "Fresh Local Pav (Bun Bread)", baseName: "Pav", quantity: "4 pcs", amount: 4, unit: "pcs", estimatedCost: 20, substitutes: [{ name: "Local Roti", estimatedCost: 8, type: "cheaper", quantity: "4 pcs", amount: 4, unit: "pcs" }] },
        { id: "go-b-2", name: "Dry Yellow Peas (for Tonak gravy)", baseName: "Yellow Peas", quantity: "150g", amount: 150, unit: "g", estimatedCost: 25, substitutes: [{ name: "Split Bengal Gram", estimatedCost: 15, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] }
      ],
      instructions: ["Soak and boil dry peas.", "Grind roasted coconut, coriander, cinnamon, and pepper into a Goan spice paste (Tonak Masala). Simmer peas in it.", "Serve with fresh pav."]
    },
    lunch: {
      name: "Goan Fish Curry (Veg alternative: Mushroom Xacuti) & Rice",
      ingredients: [
        { id: "go-l-1", name: "Fresh Cod Fish / White Mushrooms", baseName: "Protein", quantity: "300g", amount: 300, unit: "g", estimatedCost: 130, substitutes: [{ name: "Sliced Potatoes & Eggplant", estimatedCost: 25, type: "cheaper", quantity: "500g", amount: 500, unit: "g" }] },
        { id: "go-l-2", name: "Goan Wet Coconut Tamarind Masala", baseName: "Curry Paste", quantity: "150g", amount: 150, unit: "g", estimatedCost: 50, substitutes: [{ name: "Dry Desiccated Coconut & Tamarind", estimatedCost: 20, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] }
      ],
      instructions: ["Grind fresh coconut with Kashmiri chillies, coriander seeds, cumin, garlic, turmeric, and tamarind.", "Simmer protein in this tangy coconut gravy with green chillies.", "Serve with boiled rice."]
    },
    dinner: {
      name: "Tangy Veg Vindaloo & Steamed Rice",
      ingredients: [
        { id: "go-d-1", name: "Fresh Mixed Veggies (Cauliflower, Carrots, Peas)", baseName: "Veggies", quantity: "400g", amount: 400, unit: "g", estimatedCost: 60, substitutes: [{ name: "Potato & Cabbage mix", estimatedCost: 25, type: "cheaper", quantity: "400g", amount: 400, unit: "g" }] },
        { id: "go-d-2", name: "Vindaloo Paste (Red Chilli, Garlic & Vinegar)", baseName: "Vindaloo Paste", quantity: "80g", amount: 80, unit: "g", estimatedCost: 40, substitutes: [{ name: "Vinegar & Chilli powder mix", estimatedCost: 15, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Sauté mixed veggies in oil.", "Stir in Vindaloo paste made of red chillies, vinegar, cinnamon, cloves, garlic. Simmer with a little water until thick.", "Serve hot with rice."]
    }
  },
  "kerala": {
    breakfast: {
      name: "Soft Appam with Vegetable Stew",
      ingredients: [
        { id: "kl-b-1", name: "Fermented Rice & Coconut Batter", baseName: "Appam Batter", quantity: "400ml", amount: 400, unit: "ml", estimatedCost: 45, substitutes: [{ name: "Instant Rava Idli Batter", estimatedCost: 25, type: "cheaper", quantity: "400ml", amount: 400, unit: "ml" }] },
        { id: "kl-b-2", name: "Organic Coconut Milk Packet", baseName: "Coconut Milk", quantity: "200ml", amount: 200, unit: "ml", estimatedCost: 35, substitutes: [{ name: "Toned Cow Milk diluted", estimatedCost: 10, type: "cheaper", quantity: "200ml", amount: 200, unit: "ml" }] }
      ],
      instructions: ["Pour batter in a curved Appam pan, swirl to coat edges. Steam.", "Sauté carrots, potatoes, beans in coconut oil. Add thin coconut milk, boil, finish with thick coconut milk.", "Serve hot."]
    },
    lunch: {
      name: "Traditional Kerala Sadya Avial & Matta Rice",
      ingredients: [
        { id: "kl-l-1", name: "Kerala Red Matta Rice", baseName: "Rice", quantity: "200g", amount: 200, unit: "g", estimatedCost: 45, substitutes: [{ name: "Broken Rice (Kani)", estimatedCost: 15, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "kl-l-2", name: "Avial Veggie Cut (Elephant Yam, Pumpkin, Drumstick)", baseName: "Veggies", quantity: "400g", amount: 400, unit: "g", estimatedCost: 80, substitutes: [{ name: "Cabbage & Potato mix", estimatedCost: 30, type: "cheaper", quantity: "400g", amount: 400, unit: "g" }] }
      ],
      instructions: ["Boil Matta rice.", "Steam vegetables with turmeric and curry leaves. Add a coarse paste of coconut, cumin, and green chillies.", "Drizzle raw coconut oil on top, serve together."]
    },
    dinner: {
      name: "Malabar Veg Kurma & Soft Layered Parotta",
      ingredients: [
        { id: "kl-d-1", name: "Readymade Frozen Malabar Parotta", baseName: "Parotta", quantity: "3 pcs", amount: 3, unit: "pcs", estimatedCost: 60, substitutes: [{ name: "Homemade Wheat Chapati", estimatedCost: 10, type: "cheaper", quantity: "3 pcs", amount: 3, unit: "pcs" }] },
        { id: "kl-d-2", name: "Cashews & Fennel Paste for Kurma", baseName: "Kurma paste", quantity: "50g", amount: 50, unit: "g", estimatedCost: 45, substitutes: [{ name: "Roasted Chana Dal paste", estimatedCost: 10, type: "cheaper", quantity: "50g", amount: 50, unit: "g" }] }
      ],
      instructions: ["Toast parottas on a hot tawa until flaky and brown.", "Simmer mixed veggies in a coconut-cashew gravy flavored with fennel, cinnamon, and cardamoms.", "Serve together hot."]
    }
  },
  "andhra/telangana": {
    breakfast: {
      name: "Pesarattu (Moong Dal Dosa) & Allam (Ginger) Chutney",
      ingredients: [
        { id: "ap-b-1", name: "Green Moong Dal (soaked)", baseName: "Moong Dal", quantity: "200g", amount: 200, unit: "g", estimatedCost: 35, substitutes: [{ name: "Split Yellow Moong", estimatedCost: 20, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "ap-b-2", name: "Fresh Ginger & Tamarind (for Chutney)", baseName: "Chutney Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 30, substitutes: [{ name: "Tomato Chutney ingredients", estimatedCost: 15, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Grind soaked moong dal with green chillies and ginger into batter. Spread on tawa.", "Garnish with chopped onions and cumin.", "Grind ginger with tamarind and jaggery into Allam Pachadi, serve hot."]
    },
    lunch: {
      name: "Spicy Gongura Pappu, Steamed Rice & Avakaya Pickle",
      ingredients: [
        { id: "ap-l-1", name: "Fresh Gongura (Sorrel Leaves)", baseName: "Gongura", quantity: "150g", amount: 150, unit: "g", estimatedCost: 35, substitutes: [{ name: "Fresh Spinach & Lemon juice", estimatedCost: 15, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "ap-l-2", name: "Traditional Andhra Avakaya Mango Pickle", baseName: "Pickle", quantity: "50g", amount: 50, unit: "g", estimatedCost: 25, substitutes: [{ name: "Loose Lemon Pickle", estimatedCost: 10, type: "cheaper", quantity: "50g", amount: 50, unit: "g" }] }
      ],
      instructions: ["Pressure cook Toor Dal with Gongura leaves and green chillies.", "Mash well, temper with red chillies, mustard, cumin, garlic, and ghee.", "Pour over hot rice, serve with spicy Avakaya mango pickle."]
    },
    dinner: {
      name: "Spicy Guntur Veg Biryani & Mirchi Ka Salan",
      ingredients: [
        { id: "ap-d-1", name: "Guntur Red Chilli & Biryani Masala", baseName: "Spices", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 50, substitutes: [{ name: "Standard Garam Masala", estimatedCost: 15, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] },
        { id: "ap-d-2", name: "Long-grain Biryani Basmati Rice", baseName: "Rice", quantity: "200g", amount: 200, unit: "g", estimatedCost: 60, substitutes: [{ name: "Sona Masoori Rice", estimatedCost: 20, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] }
      ],
      instructions: ["Parboil Basmati Rice.", "Sauté veggies in yogurt and fiery Guntur chilli spices. Layer rice over it, steam (Dum) for 20 mins.", "Serve with salan made of peanuts and sesame."]
    }
  },
  "karnataka": {
    breakfast: {
      name: "Chow Chow Bath (Kesari Bath & Khara Bath Combo)",
      ingredients: [
        { id: "ka-b-1", name: "Sooji Semolina & Sugar", baseName: "Rava", quantity: "200g", amount: 200, unit: "g", estimatedCost: 30, substitutes: [{ name: "Plain Wheat Flour", estimatedCost: 12, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "ka-b-2", name: "Fresh Pineapple slices (for Kesari)", baseName: "Pineapple", quantity: "100g", amount: 100, unit: "g", estimatedCost: 35, substitutes: [{ name: "Omit fruit (Plain Kesari)", estimatedCost: 0, type: "cheaper", quantity: "0g", amount: 0, unit: "g" }] }
      ],
      instructions: ["Make sweet saffron Rava Halwa (Kesari Bath) with pineapple and ghee.", "Make savory rava (Khara Bath) with mustard, green peas, carrots, and Vangi Bath powder.", "Serve side-by-side."]
    },
    lunch: {
      name: "Udupi Bisi Bele Bath with Ghee & Potato Wafers",
      ingredients: [
        { id: "ka-l-1", name: "Bisi Bele Bath Spice Powder Pack", baseName: "Spices", quantity: "50g", amount: 50, unit: "g", estimatedCost: 40, substitutes: [{ name: "Standard Sambar Powder", estimatedCost: 15, type: "cheaper", quantity: "50g", amount: 50, unit: "g" }] },
        { id: "ka-l-2", name: "Salted Potato Wafers/Chips", baseName: "Chips", quantity: "1 packet", amount: 1, unit: "pcs", estimatedCost: 20, substitutes: [{ name: "Homemade Sandige/Papad", estimatedCost: 8, type: "cheaper", quantity: "2 pcs", amount: 2, unit: "pcs" }] }
      ],
      instructions: ["Pressure cook Rice, Toor Dal, and veggies (carrots, beans, peas) together.", "Add Udupi style spice powder and tamarind pulp, boil until consistency is thick and mushy.", "Pour hot ghee on top, serve with crispy potato wafers."]
    },
    dinner: {
      name: "Ragi Mudde & Spiced Soppina Saaru (Greens Curry)",
      ingredients: [
        { id: "ka-d-1", name: "Organic Ragi (Finger Millet) Flour", baseName: "Ragi Flour", quantity: "250g", amount: 250, unit: "g", estimatedCost: 35, substitutes: [{ name: "Jowar Flour", estimatedCost: 25, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "ka-d-2", name: "Fresh Dill & Amaranth Leaves (Greens)", baseName: "Greens", quantity: "300g", amount: 300, unit: "g", estimatedCost: 40, substitutes: [{ name: "Spinach Greens", estimatedCost: 20, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] }
      ],
      instructions: ["Boil water, add ragi flour, stir constantly until thick, roll into hot balls (Mudde).", "Cook greens with garlic, chillies, and tamarind. Blend and boil with rasam powder.", "Serve mudde with hot saaru and ghee."]
    }
  },
  "assamese": {
    breakfast: {
      name: "Assamese Jolpan (Flattened Rice with Jaggery & Cream)",
      ingredients: [
        { id: "as-b-1", name: "Koni Joha (Aromatic Poha)", baseName: "Poha", quantity: "150g", amount: 150, unit: "g", estimatedCost: 35, substitutes: [{ name: "Standard Poha", estimatedCost: 12, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "as-b-2", name: "Fresh Thick Curd & Jaggery Syrup", baseName: "Curd & Sweetener", quantity: "200g", amount: 200, unit: "g", estimatedCost: 30, substitutes: [{ name: "Loose Milk & Sugar", estimatedCost: 15, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] }
      ],
      instructions: ["Wash and soak Joha Poha for 5 mins.", "Drain, mix with thick fresh curd (Dahi) or cream (Scream).", "Drizzle liquid palm jaggery (Gur) on top. Serve cold."]
    },
    lunch: {
      name: "Khar (Alkaline Green Papaya dish), Bhat & Pitika",
      ingredients: [
        { id: "as-l-1", name: "Raw Green Papaya & Kolakhar (Alkali)", baseName: "Khar Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 45, substitutes: [{ name: "Green Papaya & Baking Soda", estimatedCost: 15, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] },
        { id: "as-l-2", name: "Fresh Mustard Oil (for Pitika)", baseName: "Mustard Oil", quantity: "30ml", amount: 30, unit: "ml", estimatedCost: 25, substitutes: [{ name: "Refined Soyabean Oil", estimatedCost: 6, type: "cheaper", quantity: "30ml", amount: 30, unit: "ml" }] }
      ],
      instructions: ["Cook chopped raw papaya with Kolakhar (alkaline extract of banana plant skin) and spices.", "Boil potatoes, mash with raw onions, green chillies, coriander, and raw mustard oil (Alu Pitika).", "Serve with steamed rice."]
    },
    dinner: {
      name: "Masor Tenga (Assamese Sour Tomato Curry) & Rice",
      ingredients: [
        { id: "as-d-1", name: "Fresh Rohu Fish / Paneer Blocks", baseName: "Protein", quantity: "300g", amount: 300, unit: "g", estimatedCost: 140, substitutes: [{ name: "Fresh Yellow Potatoes", estimatedCost: 15, type: "cheaper", quantity: "400g", amount: 400, unit: "g" }] },
        { id: "as-d-2", name: "Sour Tomatoes & Elephant Apple (Ou Tenga)", baseName: "Souring Kit", quantity: "250g", amount: 250, unit: "g", estimatedCost: 45, substitutes: [{ name: "Local Tamarind & Lemon", estimatedCost: 10, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] }
      ],
      instructions: ["Fry protein in mustard oil.", "Boil tomatoes, ginger, and green chillies. Add souring agent (elephant apple or lemon juice) to make a light soupy gravy.", "Toss in fried protein and serve with rice."]
    }
  },
  "north-eastern": {
    breakfast: {
      name: "Veg Thukpa Noodles with Herbs",
      ingredients: [
        { id: "ne-b-1", name: "Flat Wheat Noodles", baseName: "Noodles", quantity: "150g", amount: 150, unit: "g", estimatedCost: 35, substitutes: [{ name: "Standard Maggi Noodles", estimatedCost: 14, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "ne-b-2", name: "Fresh Ginger, Garlic & Spring Onion", baseName: "Aromatics", quantity: "100g", amount: 100, unit: "g", estimatedCost: 25, substitutes: [{ name: "Regular Onions", estimatedCost: 10, type: "cheaper", quantity: "100g", amount: 100, unit: "g" }] }
      ],
      instructions: ["Boil noodles.", "Sauté chopped ginger, garlic, cabbage, carrots, onions. Add water or broth and let boil.", "Toss in noodles, season with black pepper and fresh green coriander."]
    },
    lunch: {
      name: "Eromba (Manipuri Veg mash) with Steamed Rice",
      ingredients: [
        { id: "ne-l-1", name: "Fresh Bamboo Shoots & King Chilli (Raja Mircha)", baseName: "Spices & Shoots", quantity: "100g", amount: 100, unit: "g", estimatedCost: 55, substitutes: [{ name: "Canned Bamboo & Green Chilli", estimatedCost: 25, type: "cheaper", quantity: "100g", amount: 100, unit: "g" }] },
        { id: "ne-l-2", name: "Broad Beans & Potatoes Mix", baseName: "Veggies", quantity: "300g", amount: 300, unit: "g", estimatedCost: 30, substitutes: [{ name: "Potato & Cabbage mix", estimatedCost: 15, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] }
      ],
      instructions: ["Boil potatoes, beans, and bamboo shoots together.", "Mash them along with roasted fiery King Chilli and salt (traditional Eromba is prepared without oil).", "Serve hot with steamed rice."]
    },
    dinner: {
      name: "Bamboo Shoot Veg Curry & Brown Rice",
      ingredients: [
        { id: "ne-d-1", name: "Local Unpolished Brown Rice", baseName: "Rice", quantity: "200g", amount: 200, unit: "g", estimatedCost: 50, substitutes: [{ name: "Standard White Rice", estimatedCost: 18, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "ne-d-2", name: "Fermented Bamboo Shoot Pack", baseName: "Bamboo Shoots", quantity: "150g", amount: 150, unit: "g", estimatedCost: 65, substitutes: [{ name: "Sliced Green Capsicum & Mushrooms", estimatedCost: 30, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] }
      ],
      instructions: ["Boil brown rice.", "Sauté ginger, garlic, onions, and fermented bamboo shoots. Add water, turmeric, and mixed green leafy vegetables, simmer.", "Serve hot."]
    }
  },
  "jain": {
    breakfast: {
      name: "Raw Banana Yellow Poha (Jain style)",
      ingredients: [
        { id: "jn-b-1", name: "Premium Flat Rice (Poha)", baseName: "Poha", quantity: "200g", amount: 200, unit: "g", estimatedCost: 25, substitutes: [{ name: "Loose Rice Flakes", estimatedCost: 12, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "jn-b-2", name: "Raw Bananas (Kachha Kela - for potato swap)", baseName: "Raw Bananas", quantity: "2 pcs", amount: 2, unit: "pcs", estimatedCost: 20, substitutes: [{ name: "Omit Banana (Plain Poha)", estimatedCost: 0, type: "cheaper", quantity: "0g", amount: 0, unit: "g" }] }
      ],
      instructions: ["Steam washed Poha with turmeric, sugar, and salt.", "Temper with mustard, cumin, green chillies, and boiled diced raw banana cubes.", "Serve hot garnished with coriander (no onions or garlic used)."]
    },
    lunch: {
      name: "Jain Gatte ki Sabji & Sada Phulka",
      ingredients: [
        { id: "jn-l-1", name: "Gram Flour (Besan) & Spices", baseName: "Besan", quantity: "200g", amount: 200, unit: "g", estimatedCost: 30, substitutes: [{ name: "Loose Besan", estimatedCost: 18, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "jn-l-2", name: "Fresh Thick Curd (Dahi - Jain style)", baseName: "Curd", quantity: "200g", amount: 200, unit: "g", estimatedCost: 28, substitutes: [{ name: "Homemade Whey water", estimatedCost: 8, type: "cheaper", quantity: "200ml", amount: 200, unit: "ml" }] }
      ],
      instructions: ["Roll Besan dough with ajwain and salt. Boil and slice into Gatte.", "Prepare gravy with fresh dahi, turmeric, coriander powder, Hing, and salt (no garlic/onion). Simmer Gatte.", "Serve with plain wheat phulkas."]
    },
    dinner: {
      name: "Jain Dal Khichdi & Guava Shaak (Peru nu Shaak)",
      ingredients: [
        { id: "jn-d-1", name: "Fresh Firm Guavas (Jamrud/Peru)", baseName: "Guava", quantity: "3 pcs", amount: 3, unit: "pcs", estimatedCost: 40, substitutes: [{ name: "Diced Tomatoes", estimatedCost: 15, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] },
        { id: "jn-d-2", name: "Yellow Moong Dal & Rice mix", baseName: "Dal-Rice", quantity: "200g", amount: 200, unit: "g", estimatedCost: 35, substitutes: [{ name: "Broken Rice only", estimatedCost: 15, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] }
      ],
      instructions: ["Pressure cook Moong Dal and Rice with salt and turmeric.", "Sauté diced guava in oil, mustard, cumin, red chilli, and coriander powder (Jain sweet-spicy Peru Shaak).", "Serve hot together."]
    }
  },
  "vegetarian": {
    breakfast: {
      name: "Spiced Moong Dal Chilla & Mint Chutney",
      ingredients: [
        { id: "vg-b-1", name: "Split Yellow Moong Dal (soaked)", baseName: "Moong Dal", quantity: "200g", amount: 200, unit: "g", estimatedCost: 35, substitutes: [{ name: "Instant Besan Flour", estimatedCost: 18, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "vg-b-2", name: "Fresh Mint & Coriander (for Chutney)", baseName: "Chutney Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 25, substitutes: [{ name: "Dried mint powder chutney", estimatedCost: 10, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Grind soaked Moong Dal with green chillies, ginger, and salt into batter.", "Pour on tawa, spread like a dosa, fry using oil/ghee until crisp.", "Serve with spiced mint-coriander chutney."]
    },
    lunch: {
      name: "Paneer Tikka Masala & Wheat Naan",
      ingredients: [
        { id: "vg-l-1", name: "Fresh Dairy Paneer Blocks", baseName: "Paneer", quantity: "250g", amount: 250, unit: "g", estimatedCost: 110, substitutes: [{ name: "Soya Tofu blocks", estimatedCost: 45, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "vg-l-2", name: "Fresh Cream & Butter", baseName: "Dairy Fat", quantity: "80g", amount: 80, unit: "g", estimatedCost: 45, substitutes: [{ name: "Full Fat Milk", estimatedCost: 12, type: "cheaper", quantity: "200ml", amount: 200, unit: "ml" }] }
      ],
      instructions: ["Marinate Paneer in curd and spices, pan fry.", "Simmer paneer in a rich onion-tomato paste cooked with butter and Garam Masala.", "Serve hot with Naan."]
    },
    dinner: {
      name: "Mix Vegetable Kadai Curry & Roti",
      ingredients: [
        { id: "vg-d-1", name: "Fresh Mixed Veggies (Cauliflower, Capsicum, Carrot)", baseName: "Veggies", quantity: "400g", amount: 400, unit: "g", estimatedCost: 65, substitutes: [{ name: "Potato & Cabbage mix", estimatedCost: 25, type: "cheaper", quantity: "400g", amount: 400, unit: "g" }] },
        { id: "vg-d-2", name: "Kadai Spice Masala (Coriander & dry red chillies)", baseName: "Spices", quantity: "50g", amount: 50, unit: "g", estimatedCost: 25, substitutes: [{ name: "Standard Curry powder", estimatedCost: 10, type: "cheaper", quantity: "50g", amount: 50, unit: "g" }] }
      ],
      instructions: ["Stir-fry mixed veggies in a wok on high heat.", "Toss in onion-tomato gravy along with freshly crushed coriander seeds and dried red chilli flakes.", "Serve hot with wheat rotis."]
    }
  },
  "vegan": {
    breakfast: {
      name: "Fiery Tofu Bhurji Toast & Black Tea",
      ingredients: [
        { id: "vn-b-1", name: "Organic Extra Firm Tofu", baseName: "Tofu", quantity: "250g", amount: 250, unit: "g", estimatedCost: 55, substitutes: [{ name: "Sprouted Moong Beans", estimatedCost: 20, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "vn-b-2", name: "Whole Wheat Sandwich Bread", baseName: "Bread", quantity: "4 slices", amount: 4, unit: "pcs", estimatedCost: 25, substitutes: [{ name: "Local Roti", estimatedCost: 8, type: "cheaper", quantity: "4 pcs", amount: 4, unit: "pcs" }] }
      ],
      instructions: ["Crumble tofu.", "Sauté onions, tomatoes, green chillies, curry leaves, and turmeric. Add scrambled tofu, stir-fry.", "Serve hot on toasted wheat bread with sugarless tea."]
    },
    lunch: {
      name: "Palak Corn Dal & Jeera Rice (Vegan style)",
      ingredients: [
        { id: "vn-l-1", name: "Fresh Baby Spinach (Palak) leaves", baseName: "Spinach", quantity: "250g", amount: 250, unit: "g", estimatedCost: 35, substitutes: [{ name: "Frozen Spinach", estimatedCost: 20, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "vn-l-2", name: "Split Yellow Moong Dal & Corn", baseName: "Dal & Corn", quantity: "200g", amount: 200, unit: "g", estimatedCost: 40, substitutes: [{ name: "Plain Moong Dal", estimatedCost: 22, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] }
      ],
      instructions: ["Boil Moong dal.", "Sauté garlic, ginger, green chillies, and spinach in oil. Add sweet corn and boiled dal.", "Temper with cumin, pour over hot rice."]
    },
    dinner: {
      name: "Coconut Veg Stew & Steamed Appam (Vegan style)",
      ingredients: [
        { id: "vn-d-1", name: "Full-fat Coconut Milk can", baseName: "Coconut Milk", quantity: "400ml", amount: 400, unit: "ml", estimatedCost: 75, substitutes: [{ name: "Soy/Almond Milk", estimatedCost: 50, type: "cheaper", quantity: "400ml", amount: 400, unit: "ml" }] },
        { id: "vn-d-2", name: "Fresh Veggie Stew cut (Carrot, Potato, Beans)", baseName: "Stew Veggies", quantity: "350g", amount: 350, unit: "g", estimatedCost: 55, substitutes: [{ name: "Potato & Peas only", estimatedCost: 20, type: "cheaper", quantity: "350g", amount: 350, unit: "g" }] }
      ],
      instructions: ["Sauté whole spices (cinnamon, cloves, cardamom) and ginger in coconut oil.", "Add veggies, salt, and thin coconut milk. Simmer until cooked.", "Add thick coconut milk and serve with warm appams."]
    }
  },
  "high-protein indian": {
    breakfast: {
      name: "High-Protein Paneer Bhurji & Moong Dal Chilla",
      ingredients: [
        { id: "hp-b-1", name: "High-protein Soy Tofu / Paneer", baseName: "Protein", quantity: "250g", amount: 250, unit: "g", estimatedCost: 110, substitutes: [{ name: "Boiled Eggs (if Non-Veg)", estimatedCost: 35, type: "general", quantity: "5 eggs", amount: 5, unit: "pcs" }] },
        { id: "hp-b-2", name: "Split Yellow Moong Batter", baseName: "Moong Batter", quantity: "200ml", amount: 200, unit: "ml", estimatedCost: 25, substitutes: [{ name: "Gram Flour (Besan) slurry", estimatedCost: 12, type: "cheaper", quantity: "200ml", amount: 200, unit: "ml" }] }
      ],
      instructions: ["Make crisp chillas from seasoned Moong Dal batter on a tawa.", "Prepare hot scrambled Paneer (Bhurji) with onions, tomatoes, and red chilli powder.", "Wrap the bhurji inside the chilla and eat."]
    },
    lunch: {
      name: "Soya Chunks Masala Curry & Brown Rice",
      ingredients: [
        { id: "hp-l-1", name: "Nutrela High-protein Soya Chunks", baseName: "Soya Chunks", quantity: "150g", amount: 150, unit: "g", estimatedCost: 35, substitutes: [{ name: "Fresh Dairy Paneer", estimatedCost: 110, type: "dietary", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "hp-l-2", name: "Unpolished Fiber-rich Brown Rice", baseName: "Brown Rice", quantity: "150g", amount: 150, unit: "g", estimatedCost: 40, substitutes: [{ name: "Broken White Rice", estimatedCost: 15, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] }
      ],
      instructions: ["Boil soya chunks, squeeze water. Sauté in oil with ginger-garlic paste and onions.", "Simmer chunks in a spicy Garam Masala tomato curry.", "Serve with hot brown rice."]
    },
    dinner: {
      name: "Tandoori Grilled Paneer/Chicken Tikka & High Protein Dal Soup",
      ingredients: [
        { id: "hp-d-1", name: "Boneless Chicken Breast / Paneer", baseName: "Protein", quantity: "400g", amount: 400, unit: "g", estimatedCost: 180, substitutes: [{ name: "High protein Soya Chunks", estimatedCost: 30, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
        { id: "hp-d-2", name: "Mixed Sprouted Dal & Tomato Soup", baseName: "Soup Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 45, substitutes: [{ name: "Standard Tomato Soup", estimatedCost: 15, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Marinate chicken or paneer in hung curd and red chilli tikka spices. Skewer and pan-grill.", "Boil sprouted dals with tomato and onion, blend, and strain to make a high protein soup.", "Serve hot."]
    }
  },
  "millet-based indian": {
    breakfast: {
      name: "Spiced Ragi (Finger Millet) Upma & Coconut Chutney",
      ingredients: [
        { id: "mb-b-1", name: "Organic Ragi (Finger Millet) Semolina", baseName: "Ragi Rava", quantity: "200g", amount: 200, unit: "g", estimatedCost: 40, substitutes: [{ name: "Standard Wheat Sooji", estimatedCost: 15, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "mb-b-2", name: "Fresh Coconut & Green Chilli", baseName: "Chutney Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 28, substitutes: [{ name: "Dry Spiced Onion chutney", estimatedCost: 10, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Sauté ragi rava in a pan.", "Temper oil with mustard, curry leaves, ginger, onions, peas. Add water, bring to boil, stir in ragi rava.", "Cook until fluffy, serve with coconut chutney."]
    },
    lunch: {
      name: "Jowar/Bajra Bhakri, Lasun Thecha & Moong Dal",
      ingredients: [
        { id: "mb-l-1", name: "Jowar (Sorghum) / Bajra Flour Pack", baseName: "Millet Flour", quantity: "300g", amount: 300, unit: "g", estimatedCost: 45, substitutes: [{ name: "Standard Wheat Atta", estimatedCost: 15, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] },
        { id: "mb-l-2", name: "Fresh Green Chillies & Garlic (for Thecha)", baseName: "Thecha Kit", quantity: "100g", amount: 100, unit: "g", estimatedCost: 20, substitutes: [{ name: "Dried Red Chilli seasoning", estimatedCost: 8, type: "cheaper", quantity: "20g", amount: 20, unit: "g" }] }
      ],
      instructions: ["Knead jowar or bajra flour with warm water. Pat flat by hand, bake on a hot iron tawa.", "Pound green chillies, garlic, peanuts, and salt in mortar (Lasun Thecha).", "Serve Bhakri with yellow Moong Dal and spicy Thecha."]
    },
    dinner: {
      name: "Aromatic Millet Khichdi & Spiced Tadka Curd",
      ingredients: [
        { id: "mb-d-1", name: "Barnyard/Foxtail Millet & Moong Dal Mix", baseName: "Millet & Dal", quantity: "250g", amount: 250, unit: "g", estimatedCost: 55, substitutes: [{ name: "Regular Rice & Dal Mix", estimatedCost: 22, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
        { id: "mb-d-2", name: "Fresh Yogurt & Cumin (Tadka)", baseName: "Curd Kit", quantity: "250g", amount: 250, unit: "g", estimatedCost: 35, substitutes: [{ name: "Homemade Whey Water", estimatedCost: 10, type: "cheaper", quantity: "250ml", amount: 250, unit: "ml" }] }
      ],
      instructions: ["Wash and soak millets and Moong dal.", "Pressure cook with carrots, beans, turmeric, and ginger.", "Temper curd with cumin seeds (Jeera) and mustard seeds in oil. Serve together hot."]
    }
  },
  "street food inspired": {
    breakfast: {
      name: "Mumbai Pav Bhaji with Butter Pav",
      ingredients: [
        { id: "sf-b-1", name: "Special Pav Bhaji Masala & Butter Pack", baseName: "Bhaji Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 45, substitutes: [{ name: "Refined Oil & Garam Masala", estimatedCost: 12, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] },
        { id: "sf-b-2", name: "Fresh Bakery Pav (Bun Bread)", baseName: "Pav", quantity: "6 pcs", amount: 6, unit: "pcs", estimatedCost: 30, substitutes: [{ name: "Local Roti", estimatedCost: 10, type: "cheaper", quantity: "4 pcs", amount: 4, unit: "pcs" }] }
      ],
      instructions: ["Boil and mash potatoes, cauliflower, peas, carrots.", "Sauté chopped onions and tomatoes with Pav Bhaji spice powder and butter. Mix in mashed veggies.", "Toast Pav on tawa with lots of butter, serve hot with lemon."]
    },
    lunch: {
      name: "Kolkata Double Paneer Kathi Roll / Samosa Chaat",
      ingredients: [
        { id: "sf-l-1", name: "Fresh Dairy Paneer Blocks / Samosa", baseName: "Protein", quantity: "200g", amount: 200, unit: "g", estimatedCost: 90, substitutes: [{ name: "Boiled Chickpeas (Chole)", estimatedCost: 25, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
        { id: "sf-l-2", name: "Fine Maida & Green Chutney Kit", baseName: "Wraps & Sauce", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 35, substitutes: [{ name: "Wheat Roti & Tomato Ketchup", estimatedCost: 12, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
      ],
      instructions: ["Sauté paneer cubes with capsicum, onions, and chat masala.", "Make flatbreads from Maida, cook on tawa, line with green mint chutney.", "Roll the paneer inside the flatbread, wrap in foil, and serve."]
    },
    dinner: {
      name: "Delhi Chole Bhature with Pickled Onions",
      ingredients: [
        { id: "sf-d-1", name: "Fine Maida Flour & Yogurt (for Bhature)", baseName: "Maida", quantity: "300g", amount: 300, unit: "g", estimatedCost: 25, substitutes: [{ name: "Whole Wheat Flour", estimatedCost: 15, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] },
        { id: "sf-d-2", name: "Kabuli Chana (Chickpeas) & Amchur Pack", baseName: "Chole Pack", quantity: "200g", amount: 200, unit: "g", estimatedCost: 45, substitutes: [{ name: "Standard Dried Vatana Peas", estimatedCost: 20, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] }
      ],
      instructions: ["Knead Maida with curd, let ferment for 2 hours. Roll and deep fry into puffed Bhatures.", "Boil chickpeas, cook in a dark spicy onion-tomato gravy infused with tea-water, cloves, and dry mango powder.", "Serve hot with green chillies."]
    }
  }
};

// Helper to filter recipes by dietary preference, cuisine and schedule
export function getMealPlan(
  diet: string,
  schedule: "busy" | "standard" | "relaxed",
  cuisine: string = "gujarati"
): Recipe[] {
  // Retrieve the mapping for the requested cuisine (fallback to gujarati if not found)
  const normalizedCuisine = cuisine.toLowerCase();
  const cuisineData = CUISINE_DATABASE[normalizedCuisine] || CUISINE_DATABASE["gujarati"];

  // Helper to adjust times and difficulties dynamically based on schedule selection
  const getComplexityAdjustments = (
    type: "breakfast" | "lunch" | "dinner",
    mealData: { name: string; ingredients: Ingredient[]; instructions: string[] }
  ): Recipe => {
    let prepTime = 10;
    let cookTime = 15;
    let difficulty: "easy" | "medium" | "hard" = "medium";

    if (schedule === "busy") {
      prepTime = Math.max(3, Math.floor(prepTime * 0.5));
      cookTime = Math.max(5, Math.floor(cookTime * 0.5));
      difficulty = "easy";
    } else if (schedule === "relaxed") {
      prepTime = Math.floor(prepTime * 1.5);
      cookTime = Math.floor(cookTime * 1.8);
      difficulty = "hard";
    }

    // Adapt instructions description if "busy" (e.g. quick microwave/tawa steps)
    const instructions = [...mealData.instructions];
    if (schedule === "busy") {
      instructions.unshift("QUICK ACTION: Speed up cooking by pre-heating the tawa or using pre-boiled ingredients.");
    }

    // Apply vegan/vegetarian ingredient filter simulation:
    // If diet is vegan and there is a dairy ingredient (contains milk/butter/ghee/paneer),
    // we automatically apply the cheaper/vegan/dietary substitutes if available in the model.
    let adjustedIngredients = mealData.ingredients.map((ing) => {
      let isSwapped = false;
      let name = ing.name;
      let estimatedCost = ing.estimatedCost;
      let quantity = ing.quantity;

      // If vegan and ingredient is dairy (contains Milk, Paneer, Butter, Ghee)
      const isDairy = /milk|paneer|butter|ghee/i.test(ing.name);
      if (diet.toLowerCase() === "vegan" && isDairy) {
        // Look for a vegan substitute (e.g. Soy Tofu, Refined Oil, Soy/Almond milk)
        const veganSub = ing.substitutes.find(
          (sub) => /tofu|oil|soy|almond/i.test(sub.name)
        );
        if (veganSub) {
          name = veganSub.name;
          estimatedCost = veganSub.estimatedCost;
          quantity = veganSub.quantity;
        }
      }

      return {
        ...ing,
        name,
        estimatedCost,
        quantity,
      };
    });

    return {
      id: `${normalizedCuisine}-${type}-${schedule}`,
      name: mealData.name,
      type,
      prepTime,
      cookTime,
      difficulty,
      instructions,
      dietaryPreferences: [diet.toLowerCase(), "vegetarian"],
      scheduleComplexity: schedule,
      cuisine: normalizedCuisine as any,
      ingredients: adjustedIngredients,
    };
  };

  return [
    getComplexityAdjustments("breakfast", cuisineData.breakfast),
    getComplexityAdjustments("lunch", cuisineData.lunch),
    getComplexityAdjustments("dinner", cuisineData.dinner)
  ];
}

// Consolidate grocery items and apply substitutions
export interface ConsolidatedItem {
  id: string;
  name: string;
  baseName: string;
  quantity: string;
  amount: number;
  unit: string;
  estimatedCost: number;
  recipeNames: string[];
  isSwapped: boolean;
  baseIngredientName: string;
  isChecked: boolean;
}

export function consolidateGroceryList(
  recipes: Recipe[],
  activeSubs: ActiveSubstitution[],
  checkedItems: string[]
): ConsolidatedItem[] {
  const consolidatedMap = new Map<string, ConsolidatedItem>();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      // Find if there is an active substitution for this ingredient
      const activeSub = activeSubs.find(
        (sub) => sub.recipeId === recipe.id && sub.ingredientId === ing.id
      );

      let itemName = ing.name;
      let itemCost = ing.estimatedCost;
      let itemQuantity = ing.quantity;
      let itemAmount = ing.amount;
      let itemUnit = ing.unit;
      const isSwapped = activeSub ? activeSub.substituteIndex !== -1 : false;

      if (isSwapped && activeSub && ing.substitutes[activeSub.substituteIndex]) {
        const sub = ing.substitutes[activeSub.substituteIndex];
        itemName = sub.name;
        itemCost = sub.estimatedCost;
        itemQuantity = sub.quantity;
        itemAmount = sub.amount;
        itemUnit = sub.unit;
      }

      const key = `${ing.baseName.toLowerCase()}_${isSwapped ? "swapped" : "base"}`;

      if (consolidatedMap.has(key)) {
        const existing = consolidatedMap.get(key)!;
        existing.amount += itemAmount;
        existing.estimatedCost += itemCost;
        if (!existing.recipeNames.includes(recipe.name)) {
          existing.recipeNames.push(recipe.name);
        }
        existing.quantity = `${existing.amount}${existing.unit}`;
      } else {
        consolidatedMap.set(key, {
          id: key,
          name: itemName,
          baseName: ing.baseName,
          quantity: itemQuantity,
          amount: itemAmount,
          unit: itemUnit,
          estimatedCost: itemCost,
          recipeNames: [recipe.name],
          isSwapped,
          baseIngredientName: ing.name,
          isChecked: checkedItems.includes(key),
        });
      }
    });
  });

  return Array.from(consolidatedMap.values());
}
