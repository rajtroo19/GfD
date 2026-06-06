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
  calories?: number;
  imageUrl?: string;
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

// Helper to get current day of the week
export function getDayOfWeek(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
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

interface MealDetails {
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  calories: number;
  imageUrl?: string;
}

interface ScheduleMeals {
  breakfast: MealDetails;
  lunch: MealDetails;
  dinner: MealDetails;
}

const CUISINE_DATABASE: Record<string, Record<"busy" | "standard" | "relaxed", ScheduleMeals>> = {
  "north indian": {
    busy: {
      breakfast: {
        name: "Quick Sooji Chilla & Mint Chutney",
        calories: 280,
        imageUrl: "/berry_oats.png",
        ingredients: [
          { id: "ni-b-b1", name: "Roasted Sooji (Rava)", baseName: "Rava", quantity: "150g", amount: 150, unit: "g", estimatedCost: 15, substitutes: [] },
          { id: "ni-b-b2", name: "Spiced Buttermilk", baseName: "Curd", quantity: "150ml", amount: 150, unit: "ml", estimatedCost: 10, substitutes: [] }
        ],
        instructions: ["Whisk sooji and spiced buttermilk into a smooth batter.", "Pour onto a hot tawa and cook until golden brown.", "Serve with green mint chutney."]
      },
      lunch: {
        name: "Jeera Aloo & Tawa Paratha",
        calories: 420,
        imageUrl: "/salmon_bowl.png",
        ingredients: [
          { id: "ni-b-l1", name: "Boiled Cut Potatoes", baseName: "Potatoes", quantity: "300g", amount: 300, unit: "g", estimatedCost: 15, substitutes: [] },
          { id: "ni-b-l2", name: "Fresh Coriander & Cumin seeds", baseName: "Spices", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 10, substitutes: [] }
        ],
        instructions: ["Toss boiled potatoes in oil, cumin seeds, and turmeric.", "Serve hot with quick pan-fried whole wheat parathas."]
      },
      dinner: {
        name: "Egg Bhurji / Paneer Bhurji & Soft Roti",
        calories: 390,
        imageUrl: "/tofu_stir_fry.png",
        ingredients: [
          { id: "ni-b-d1", name: "Fresh Paneer / 3 Eggs", baseName: "Protein", quantity: "200g", amount: 200, unit: "g", estimatedCost: 80, substitutes: [{ name: "Organic Soy Tofu", estimatedCost: 35, type: "cheaper", quantity: "200g", amount: 200, unit: "g" }] },
          { id: "ni-b-d2", name: "Chopped Onions & Green Chillies", baseName: "Veggies", quantity: "100g", amount: 100, unit: "g", estimatedCost: 10, substitutes: [] }
        ],
        instructions: ["Sauté onions and chillies in oil.", "Add crumbled paneer/scrambled eggs and toss with basic masalas.", "Serve hot with rotis."]
      }
    },
    standard: {
      breakfast: {
        name: "Spiced Aloo Paratha with White Butter & Dahi",
        calories: 380,
        imageUrl: "/berry_oats.png",
        ingredients: [
          { id: "ni-s-b1", name: "Amul Fresh White Butter", baseName: "Butter", quantity: "50g", amount: 50, unit: "g", estimatedCost: 35, substitutes: [{ name: "Refined Mustard Oil", estimatedCost: 8, type: "cheaper", quantity: "50ml", amount: 50, unit: "ml" }] },
          { id: "ni-s-b2", name: "Pahadi Aloo (Mountain Potatoes)", baseName: "Potatoes", quantity: "300g", amount: 300, unit: "g", estimatedCost: 20, substitutes: [{ name: "Local White Potatoes", estimatedCost: 10, type: "cheaper", quantity: "300g", amount: 300, unit: "g" }] }
        ],
        instructions: ["Stuff wheat dough with spiced mashed boiled potatoes.", "Cook on tawa with ghee.", "Serve hot with white butter and dahi."]
      },
      lunch: {
        name: "Shahi Paneer Butter Masala & Garlic Naan",
        calories: 540,
        imageUrl: "/salmon_bowl.png",
        ingredients: [
          { id: "ni-s-l1", name: "Fresh Premium Dairy Paneer", baseName: "Paneer", quantity: "250g", amount: 250, unit: "g", estimatedCost: 110, substitutes: [{ name: "Fresh Organic Soy Tofu", estimatedCost: 45, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] },
          { id: "ni-s-l2", name: "Whole Cashew Nuts (Kaju)", baseName: "Cashews", quantity: "50g", amount: 50, unit: "g", estimatedCost: 60, substitutes: [{ name: "Peeled Melon Seeds (Magajtari)", estimatedCost: 15, type: "cheaper", quantity: "50g", amount: 50, unit: "g" }] }
        ],
        instructions: ["Sauté onions, tomatoes, and cashews into a gravy.", "Simmer paneer cubes in this velvety gravy with butter.", "Serve hot with fresh garlic naan."]
      },
      dinner: {
        name: "Dhaba Style Kadhai Masala Paneer & Kesar Rice",
        calories: 490,
        imageUrl: "/tofu_stir_fry.png",
        ingredients: [
          { id: "ni-s-d1", name: "Fresh Paneer Blocks", baseName: "Protein", quantity: "300g", amount: 300, unit: "g", estimatedCost: 120, substitutes: [{ name: "Soya Chunks", estimatedCost: 25, type: "cheaper", quantity: "150g", amount: 150, unit: "g" }] },
          { id: "ni-s-d2", name: "Kashmiri Kesar (Saffron) strands", baseName: "Kesar", quantity: "0.5g", amount: 0.5, unit: "g", estimatedCost: 150, substitutes: [{ name: "Turmeric (Haldi) powder", estimatedCost: 5, type: "cheaper", quantity: "2g", amount: 2, unit: "g" }] }
        ],
        instructions: ["Sauté capsicum, onions, paneer in kadhai spices.", "Cook rice with saffron strands for fragrance.", "Serve together hot."]
      }
    },
    relaxed: {
      breakfast: {
        name: "Amritsari Chole Bhature with Pickled Onions",
        calories: 620,
        imageUrl: "/berry_oats.png",
        ingredients: [
          { id: "ni-r-b1", name: "Kabuli Chana (Chickpeas)", baseName: "Chickpeas", quantity: "250g", amount: 250, unit: "g", estimatedCost: 45, substitutes: [] },
          { id: "ni-r-b2", name: "Maida Flour & Curd for Bhatura", baseName: "Flour Kit", quantity: "300g", amount: 300, unit: "g", estimatedCost: 30, substitutes: [] }
        ],
        instructions: ["Slow-cook chickpeas in a spiced tea-infused gravy.", "Ferment maida dough and deep-fry into puffed bhaturas.", "Serve hot with pickled onions."]
      },
      lunch: {
        name: "Paneer Lababdar, Dal Makhani & Laccha Paratha",
        calories: 780,
        imageUrl: "/salmon_bowl.png",
        ingredients: [
          { id: "ni-r-l1", name: "Black Urad Dal & Butter", baseName: "Lentils & Butter", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 90, substitutes: [] },
          { id: "ni-r-l2", name: "Premium Dairy Paneer Block", baseName: "Paneer", quantity: "250g", amount: 250, unit: "g", estimatedCost: 110, substitutes: [{ name: "Organic Soy Tofu", estimatedCost: 45, type: "cheaper", quantity: "250g", amount: 250, unit: "g" }] }
        ],
        instructions: ["Slow-simmer Urad Dal for 6 hours with butter and cream.", "Cook Paneer in creamy tomato-onion gravy.", "Serve with folded flaky Laccha Parathas."]
      },
      dinner: {
        name: "Awadhi Dum Biryani & Creamy Raita",
        calories: 680,
        imageUrl: "/tofu_stir_fry.png",
        ingredients: [
          { id: "ni-r-d1", name: "Long-grain Basmati Rice & Veggies", baseName: "Biryani Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 130, substitutes: [] },
          { id: "ni-r-d2", name: "Pure Saffron & Ghee", baseName: "Aromatics", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 110, substitutes: [{ name: "Turmeric & Sunflower Oil", estimatedCost: 15, type: "cheaper", quantity: "1 unit", amount: 1, unit: "unit" }] }
        ],
        instructions: ["Parboil Basmati rice with whole spices.", "Layer with spiced marinated paneer/veggies and saffron milk.", "Seal the pot and cook on slow heat (Dum) for 30 minutes."]
      }
    }
  },
  "gujarati": {
    busy: {
      breakfast: {
        name: "Kanda Poha & Adu-Wala Chai",
        calories: 250,
        imageUrl: "/berry_oats.png",
        ingredients: [
          { id: "gj-b-b1", name: "Thick Poha (Flattened Rice)", baseName: "Poha", quantity: "200g", amount: 200, unit: "g", estimatedCost: 20, substitutes: [] },
          { id: "gj-b-b2", name: "Raw Peanuts & Mustard Seeds", baseName: "Peanuts & Seeds", quantity: "50g", amount: 50, unit: "g", estimatedCost: 15, substitutes: [] }
        ],
        instructions: ["Steam washed poha with turmeric.", "Sauté onions, peanuts, curry leaves, and mix in poha.", "Serve with hot ginger tea."]
      },
      lunch: {
        name: "Sev Tameta Nu Shaak & Tawa Rotli",
        calories: 390,
        imageUrl: "/salmon_bowl.png",
        ingredients: [
          { id: "gj-b-l1", name: "Spicy Besan Gathiya / Sev", baseName: "Sev", quantity: "100g", amount: 100, unit: "g", estimatedCost: 25, substitutes: [] },
          { id: "gj-b-l2", name: "Fresh Red Tomatoes", baseName: "Tomatoes", quantity: "300g", amount: 300, unit: "g", estimatedCost: 15, substitutes: [] }
        ],
        instructions: ["Sauté tomatoes with mustard seeds, turmeric, and jaggery.", "Add sev right before serving.", "Serve with fresh wheat rotlis."]
      },
      dinner: {
        name: "Vaghareli Khichdi & Spiced Chhas",
        calories: 340,
        imageUrl: "/tofu_stir_fry.png",
        ingredients: [
          { id: "gj-b-d1", name: "Rice & Moong Dal mix", baseName: "Khichdi Mix", quantity: "200g", amount: 200, unit: "g", estimatedCost: 25, substitutes: [] },
          { id: "gj-b-d2", name: "Fresh Curd for buttermilk", baseName: "Curd", quantity: "200g", amount: 200, unit: "g", estimatedCost: 28, substitutes: [] }
        ],
        instructions: ["Cook Rice and Dal in a pressure cooker with turmeric.", "Temper with cumin and ghee.", "Serve with cold spiced buttermilk."]
      }
    },
    standard: {
      breakfast: {
        name: "Methi Thepla with Chhundo & Adu Chai",
        calories: 310,
        imageUrl: "/berry_oats.png",
        ingredients: [
          { id: "gj-s-b1", name: "Fresh Fenugreek (Methi) leaves", baseName: "Methi", quantity: "100g", amount: 100, unit: "g", estimatedCost: 20, substitutes: [] },
          { id: "gj-s-b2", name: "Whole Wheat Atta & Spices", baseName: "Atta", quantity: "250g", amount: 250, unit: "g", estimatedCost: 15, substitutes: [] }
        ],
        instructions: ["Knead wheat flour with yogurt, spices, and chopped fenugreek.", "Roll thin and cook on tawa with a drop of oil.", "Serve with sweet-spicy mango chutney (Chhundo)."]
      },
      lunch: {
        name: "Khati-Meethi Tuvar Dal, Bhat & Ringan Shaak",
        calories: 460,
        imageUrl: "/salmon_bowl.png",
        ingredients: [
          { id: "gj-s-l1", name: "Tuvar Dal & Kokum Pack", baseName: "Lentils", quantity: "150g", amount: 150, unit: "g", estimatedCost: 35, substitutes: [] },
          { id: "gj-s-l2", name: "Fresh Eggplant (Ringan) & Potato", baseName: "Veggies", quantity: "400g", amount: 400, unit: "g", estimatedCost: 35, substitutes: [] }
        ],
        instructions: ["Boil Tuvar Dal, add jaggery and kokum for sweet-sour kick.", "Sauté eggplant and potato in spices.", "Serve with steamed rice."]
      },
      dinner: {
        name: "Kathiyawadi Thali (Rotli, Ringan Shaak, Kadhi, Khichdi)",
        calories: 510,
        imageUrl: "/tofu_stir_fry.png",
        ingredients: [
          { id: "gj-s-d1", name: "Sour Curd & Besan for Kadhi", baseName: "Kadhi Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 40, substitutes: [] },
          { id: "gj-s-d2", name: "Desi Ghee (A2 quality)", baseName: "Ghee", quantity: "50g", amount: 50, unit: "g", estimatedCost: 65, substitutes: [{ name: "Refined Oil", estimatedCost: 12, type: "cheaper", quantity: "50ml", amount: 50, unit: "ml" }] }
        ],
        instructions: ["Boil sour curd kadhi tempered with fenugreek seeds.", "Prepare yellow Khichdi.", "Top with ghee and serve with hot rotlis and ringna no olo."]
      }
    },
    relaxed: {
      breakfast: {
        name: "Fafda-Jalebi with Papaya Sambharo & Kadhi",
        calories: 590,
        imageUrl: "/berry_oats.png",
        ingredients: [
          { id: "gj-r-b1", name: "Gram Flour (Besan) & Jalebi Batter", baseName: "Besan & Sugar", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 85, substitutes: [] },
          { id: "gj-r-b2", name: "Raw Papaya & Green Chilli", baseName: "Sambharo Veg", quantity: "200g", amount: 200, unit: "g", estimatedCost: 25, substitutes: [] }
        ],
        instructions: ["Knead besan into long strips and deep fry to make crispy Fafda.", "Fry and dip Jalebis in hot sugar syrup.", "Sauté grated raw papaya with mustard seeds. Serve together."]
      },
      lunch: {
        name: "Festive Undhiyu, Puri & Kesar Shrikhand",
        calories: 720,
        imageUrl: "/salmon_bowl.png",
        ingredients: [
          { id: "gj-r-l1", name: "Undhiyu Veggie Mix (Surti Papdi, Kand, Raw Banana)", baseName: "Undhiyu Veg", quantity: "500g", amount: 500, unit: "g", estimatedCost: 110, substitutes: [] },
          { id: "gj-r-l2", name: "Hung Curd & Kesar (for Shrikhand)", baseName: "Shrikhand Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 95, substitutes: [] }
        ],
        instructions: ["Slow cook the seasonal root veggies and green papdi with spices and muthia.", "Deep fry wheat flour puris.", "Whip hung curd with sugar, cardamom, and saffron. Serve chilled."]
      },
      dinner: {
        name: "Dal Dhokli & Basundi",
        calories: 640,
        imageUrl: "/tofu_stir_fry.png",
        ingredients: [
          { id: "gj-r-d1", name: "Tuvar Dal & Spiced Wheat Ribbon Pack", baseName: "Dal Dhokli Kit", quantity: "1 unit", amount: 1, unit: "unit", estimatedCost: 65, substitutes: [] },
          { id: "gj-r-d2", name: "Full Fat Milk & Dry Fruits", baseName: "Basundi Milk", quantity: "500ml", amount: 500, unit: "ml", estimatedCost: 60, substitutes: [] }
        ],
        instructions: ["Simmer wheat flour ribbons (Dhokli) in boiling sweet-sour lentil soup.", "Reduce milk with sugar and nuts to make thick Basundi.", "Serve hot dal dhokli with sweet basundi."]
      }
    }
  }
};

// Fallback logic for all other 18 cuisines to keep code dry yet distinct
// Generates custom dish names and ingredients on the fly using regional profiles
const REGIONAL_PROFILES: Record<string, {
  spices: string[];
  stapleProtein: string;
  cheaperProtein: string;
  dishes: Record<"busy" | "standard" | "relaxed", Record<"breakfast" | "lunch" | "dinner", string>>;
}> = {
  "south indian": {
    spices: ["Mustard seeds", "Curry leaves", "Tamarind"],
    stapleProtein: "Urad Dal Batter",
    cheaperProtein: "Rava Batter",
    dishes: {
      busy: {
        breakfast: "Instant Rava Dosa with Podi Chutney",
        lunch: "Sambar Rice with Pickle",
        dinner: "Tangy Lemon Rice & Roasted Papad"
      },
      standard: {
        breakfast: "Rava Idli with Coconut Chutney & Filter Coffee",
        lunch: "Sambar Sadam, Beetroot Thoran & Appalam",
        dinner: "Ghee Roast Masala Dosa with Sambar & Tomato Chutney"
      },
      relaxed: {
        breakfast: "Medhu Vada & Onion Uttapam Combo",
        lunch: "Udupi Special Full Meals on Banana Leaf",
        dinner: "Chettinad Spicy Veg Curry & Malabar Parotta"
      }
    }
  },
  "rajasthani": {
    spices: ["Mathania Chilli", "Hing", "Amchur"],
    stapleProtein: "Gatte Besan",
    cheaperProtein: "Gram Flour",
    dishes: {
      busy: {
        breakfast: "Sajji Poha & Hot Chai",
        lunch: "Papad ki Sabji & Tawa Roti",
        dinner: "Gatte ki Khichdi & Curd"
      },
      standard: {
        breakfast: "Kalmi Vada & Masala Chai",
        lunch: "Rajasthani Gatte ki Sabji & Tawa Roti",
        dinner: "Mewari Dal Baati & Cardamom Churma"
      },
      relaxed: {
        breakfast: "Pyaz Kachori & Mirchi Vada with Chutney",
        lunch: "Ker Sangri, Bajre ki Roti & Lahsun Thecha",
        dinner: "Veg/Soya Lal Maas & Missi Roti"
      }
    }
  },
  "maharashtrian": {
    spices: ["Goda Masala", "Mustard seeds", "Kashmiri Mirch"],
    stapleProtein: "Matki Sprouts",
    cheaperProtein: "Green Sprouts",
    dishes: {
      busy: {
        breakfast: "Kanda Batata Poha & Hot Ginger Tea",
        lunch: "Pithla Bhakri with Lasun Chutney",
        dinner: "Tawa Pulao & Raita"
      },
      standard: {
        breakfast: "Kanda Poha & Tea",
        lunch: "Kolhapuri Misal Pav & Buttermilk",
        dinner: "Zunka Bhakri, Lasun Thecha & Solkadhi"
      },
      relaxed: {
        breakfast: "Sabudana Khichdi with Sweet Yogurt",
        lunch: "Katachi Amti, Puran Poli & Ghee",
        dinner: "Bharli Vangi (Stuffed Eggplant) & Jowar Bhakri"
      }
    }
  },
  "bengali": {
    spices: ["Panch Phoron", "Mustard Oil", "Ginger"],
    stapleProtein: "Paneer Blocks / Chana Dal",
    cheaperProtein: "Potatoes / Peas",
    dishes: {
      busy: {
        breakfast: "Sujir Halwa & Roti",
        lunch: "Alur Posto & Gobindobhog Rice",
        dinner: "Cholar Dal & Sada Roti"
      },
      standard: {
        breakfast: "Luchi & Narkel Diye Cholar Dal",
        lunch: "Sarse Paneer & Gobindobhog Bhaat",
        dinner: "Begun Bhaja, Biulir Dal & Steamed Bhaat"
      },
      relaxed: {
        breakfast: "Radhaballabhi (Stuffed Puri) & Alur Dum",
        lunch: "Dhokar Dalna & Gobindobhog Rice",
        dinner: "Chanar Kofta Curry & Basanti Pulao"
      }
    }
  },
  "punjabi": {
    spices: ["Garam Masala", "Kasuri Methi", "Ginger-Garlic"],
    stapleProtein: "Paneer Blocks",
    cheaperProtein: "Soya Chunks",
    dishes: {
      busy: {
        breakfast: "Bread Butter & Spiced Tea",
        lunch: "Rajma Chawal & Pickled Onions",
        dinner: "Egg/Paneer Bhurji & Tawa Paratha"
      },
      standard: {
        breakfast: "Aloo Paratha with Butter & Sweet Lassi",
        lunch: "Sarson ka Saag & Makki di Roti with Gur",
        dinner: "Dal Makhani & Garlic Butter Roti"
      },
      relaxed: {
        breakfast: "Amritsari Kulcha with Chole & Lassi",
        lunch: "Shahi Paneer Tikka Masala & Naan",
        dinner: "Pind Style Veg Biryani & Mint Raita"
      }
    }
  },
  "kashmiri": {
    spices: ["Fennel powder", "Dry Ginger powder", "Kashmiri Mirch"],
    stapleProtein: "Soya Chunks / Paneer",
    cheaperProtein: "Kidney Beans (Rajma)",
    dishes: {
      busy: {
        breakfast: "Bakery Kahwa Tea & Toast",
        lunch: "Kashmiri Rajma & Steamed Rice",
        dinner: "Kashmiri Dum Aloo & Roti"
      },
      standard: {
        breakfast: "Kashmiri Noon Chai & Sheermal",
        lunch: "Kashmiri Dum Aloo & Zafrani Pulao",
        dinner: "Kashmiri Rogan Josh (Soya Chunks) & Rice"
      },
      relaxed: {
        breakfast: "Kashmiri Noon Chai & Roth Bread",
        lunch: "Nadru Yakhni (Lotus Stem in Yogurt) & Pulao",
        dinner: "Paneer Rogan Josh & Saffron Pulao"
      }
    }
  },
  "goan": {
    spices: ["Xacuti Masala", "Coconut", "Tamarind"],
    stapleProtein: "Mushroom / Tofu",
    cheaperProtein: "Yellow Peas",
    dishes: {
      busy: {
        breakfast: "Goan Pav Bhaji (Tonak) & Pav",
        lunch: "Goan Curry (Coconut base) & Steamed Rice",
        dinner: "Veg Vindaloo & Rice"
      },
      standard: {
        breakfast: "Goan Pav Bhaji & Local Pav",
        lunch: "Mushroom Xacuti & Brown Rice",
        dinner: "Tangy Veg Vindaloo & Rice"
      },
      relaxed: {
        breakfast: "Goan Pav Bhaji & Fresh Poee Bread",
        lunch: "Mushroom Xacuti, Solkadhi & Steamed Rice",
        dinner: "Tangy Paneer Vindaloo & Veg Pulao"
      }
    }
  },
  "kerala": {
    spices: ["Coconut oil", "Curry leaves", "Black pepper"],
    stapleProtein: "Kadala Chickpeas",
    cheaperProtein: "Green Peas",
    dishes: {
      busy: {
        breakfast: "Puttu with Kadala Curry",
        lunch: "Kerala Rice & Vegetable Thoran",
        dinner: "Malabar Veg Kurma & Chapati"
      },
      standard: {
        breakfast: "Soft Appam with Vegetable Stew",
        lunch: "Traditional Kerala Sadya Avial & Matta Rice",
        dinner: "Malabar Veg Kurma & Soft Layered Parotta"
      },
      relaxed: {
        breakfast: "Soft Appam, Vegetable Stew & Filter Coffee",
        lunch: "Kerala Sadya (Avial, Thoran, Sambharam, Matta Rice)",
        dinner: "Paneer Kurma & Flaky Malabar Parotta"
      }
    }
  },
  "andhra/telangana": {
    spices: ["Guntur red chilli", "Mustard seeds", "Tamarind"],
    stapleProtein: "Toor Dal",
    cheaperProtein: "Yellow Moong",
    dishes: {
      busy: {
        breakfast: "Instant Upma & Ginger pickle",
        lunch: "Tomato Pappu & Rice",
        dinner: "Curd Rice & Avakaya Pickle"
      },
      standard: {
        breakfast: "Pesarattu (Moong Dal Dosa) & Allam Chutney",
        lunch: "Spicy Gongura Pappu, Steamed Rice & Avakaya",
        dinner: "Spicy Guntur Veg Biryani & Mirchi Ka Salan"
      },
      relaxed: {
        breakfast: "Pesarattu Upma & Ginger pachadi",
        lunch: "Gongura Pappu, Steamed Rice, Sandige & ghee",
        dinner: "Spicy Paneer Biryani & Mirchi Ka Salan"
      }
    }
  },
  "karnataka": {
    spices: ["Vangi Bath powder", "Mustard", "Curry leaves"],
    stapleProtein: "Toor Dal",
    cheaperProtein: "Yellow Moong",
    dishes: {
      busy: {
        breakfast: "Chow Chow Bath (Rava Halwa & Upma)",
        lunch: "Vangi Bath (Brinjal Rice) & Curd",
        dinner: "Lemon Rice & Roasted Sandige"
      },
      standard: {
        breakfast: "Chow Chow Bath Combo & Filter Coffee",
        lunch: "Udupi Bisi Bele Bath with Ghee & Wafers",
        dinner: "Ragi Mudde & Spiced Soppina Saaru"
      },
      relaxed: {
        breakfast: "Idli, Vada, Chow Chow Bath & Filter Coffee",
        lunch: "Udupi Special Thali (Bisi Bele Bath, Kosambari, Obbattu)",
        dinner: "Ragi Mudde, Soppina Saaru & Basundi"
      }
    }
  },
  "assamese": {
    spices: ["Mustard Oil", "Ginger", "Khar alkali"],
    stapleProtein: "Paneer Blocks",
    cheaperProtein: "Local Potatoes",
    dishes: {
      busy: {
        breakfast: "Jolpan (Poha, Curd & Gur)",
        lunch: "Alu Pitika & Steamed Rice",
        dinner: "Tomato Soupy Curry & Rice"
      },
      standard: {
        breakfast: "Assamese Jolpan (Cream & Gur)",
        lunch: "Khar (Green Papaya), Bhat & Pitika",
        dinner: "Masor Tenga (Sour Tomato Curry) & Rice"
      },
      relaxed: {
        breakfast: "Aromatic Joha Poha with local tea",
        lunch: "Khar, Bhat, Alu Pitika & Bilahi Tenga (Sour Curry)",
        dinner: "Sour Paneer Curry & Joha Rice"
      }
    }
  },
  "north-eastern": {
    spices: ["Bamboo shoot", "Raja Mircha", "Ginger-Garlic"],
    stapleProtein: "Tofu Blocks",
    cheaperProtein: "Broad Beans",
    dishes: {
      busy: {
        breakfast: "Veg Thukpa Noodles",
        lunch: "Eromba & Steamed Rice",
        dinner: "Bamboo Shoot Veg Curry & Rice"
      },
      standard: {
        breakfast: "Veg Thukpa Noodles with Herbs",
        lunch: "Eromba (Manipuri Veg Mash) & Rice",
        dinner: "Bamboo Shoot Veg Curry & Brown Rice"
      },
      relaxed: {
        breakfast: "Spicy Momos & Thukpa Soup",
        lunch: "Eromba, Steamed Rice, Smoked Salad",
        dinner: "Paneer Bamboo Shoot Stew & Brown Rice"
      }
    }
  },
  "jain": {
    spices: ["Hing", "Turmeric", "Coriander powder"],
    stapleProtein: "Chana Dal",
    cheaperProtein: "Yellow Moong",
    dishes: {
      busy: {
        breakfast: "Raw Banana Yellow Poha (Jain style)",
        lunch: "Jain Dal Khichdi (no Onion/Garlic)",
        dinner: "Moong Dal & Sada Phulka"
      },
      standard: {
        breakfast: "Raw Banana Yellow Poha & Jain Chai",
        lunch: "Jain Gatte ki Sabji & Sada Phulka",
        dinner: "Jain Dal Khichdi & Guava Shaak"
      },
      relaxed: {
        breakfast: "Jain Besan Chilla & Mint Chutney",
        lunch: "Jain Gujarati Thali (no root veggies)",
        dinner: "Jain Dal Dhokli & Basundi"
      }
    }
  },
  "vegetarian": {
    spices: ["Garam Masala", "Cumin", "Coriander"],
    stapleProtein: "Paneer",
    cheaperProtein: "Soya Chunks",
    dishes: {
      busy: {
        breakfast: "Spiced Moong Dal Chilla",
        lunch: "Yellow Dal Tadka & Jeera Rice",
        dinner: "Aloo Gobbi & Tawa Roti"
      },
      standard: {
        breakfast: "Spiced Moong Dal Chilla & Mint Sauce",
        lunch: "Paneer Tikka Masala & Wheat Naan",
        dinner: "Mix Vegetable Kadai Curry & Roti"
      },
      relaxed: {
        breakfast: "Stuffed Paneer Paratha & Sweet Curd",
        lunch: "Malai Kofta, Dal Makhani & Garlic Naan",
        dinner: "Veg Dum Biryani & Mirchi Ka Salan"
      }
    }
  },
  "vegan": {
    spices: ["Mustard seeds", "Turmeric", "Black Pepper"],
    stapleProtein: "Organic Tofu",
    cheaperProtein: "Sprouted Moong",
    dishes: {
      busy: {
        breakfast: "Tofu Bhurji Toast & Black Tea",
        lunch: "Palak Dal & Rice (Vegan)",
        dinner: "Alu Pea Sabji & Roti"
      },
      standard: {
        breakfast: "Fiery Tofu Bhurji Toast & Black Tea",
        lunch: "Palak Corn Dal & Jeera Rice (Vegan)",
        dinner: "Coconut Veg Stew & Steamed Appam"
      },
      relaxed: {
        breakfast: "Spiced Soy Chilla & Black Coffee",
        lunch: "Tofu Kadai Masala, Roti & Jeera Rice",
        dinner: "Coconut Milk Veg Stew & Appam"
      }
    }
  },
  "high-protein indian": {
    spices: ["Garam Masala", "Ginger-Garlic", "Kasuri Methi"],
    stapleProtein: "Tofu / Paneer Blocks",
    cheaperProtein: "Soya Chunks",
    dishes: {
      busy: {
        breakfast: "Moong Dal Chilla & Tofu Bhurji",
        lunch: "Soya Chunks Masala & Brown Rice",
        dinner: "High Protein Dal Soup & Roasted Paneer"
      },
      standard: {
        breakfast: "High-Protein Paneer Bhurji & Moong Chilla",
        lunch: "Soya Chunks Masala Curry & Brown Rice",
        dinner: "Tandoori Paneer Tikka & High Protein Dal Soup"
      },
      relaxed: {
        breakfast: "Protein Shakes, Oats & Grilled Tofu",
        lunch: "High-Protein Paneer Tikka Masala & Brown Rice",
        dinner: "Grilled Tandoori Paneer Tikka & Sprouted Dal Soup"
      }
    }
  },
  "millet-based indian": {
    spices: ["Cumin", "Mustard seeds", "Hing"],
    stapleProtein: "Ragi Flour",
    cheaperProtein: "Bajra Flour",
    dishes: {
      busy: {
        breakfast: "Spiced Ragi Upma",
        lunch: "Jowar Bhakri & Moong Dal",
        dinner: "Millet Khichdi & Curd"
      },
      standard: {
        breakfast: "Spiced Ragi Upma & Coconut Chutney",
        lunch: "Jowar/Bajra Bhakri, Lasun Thecha & Moong Dal",
        dinner: "Aromatic Millet Khichdi & Spiced Tadka Curd"
      },
      relaxed: {
        breakfast: "Ragi Porridge / Millet Idli Combo",
        lunch: "Jowar Bhakri, Lasun Thecha, Moong Dal & Ghee",
        dinner: "Barnyard Millet Biryani & Tadka Curd"
      }
    }
  },
  "street food inspired": {
    spices: ["Chaat Masala", "Amchur", "Black Salt"],
    stapleProtein: "Paneer Blocks",
    cheaperProtein: "Kabuli Chana",
    dishes: {
      busy: {
        breakfast: "Mumbai Pav Bhaji & Pav",
        lunch: "Kolkata Paneer Kathi Roll",
        dinner: "Delhi Chole Bhature"
      },
      standard: {
        breakfast: "Mumbai Pav Bhaji with Butter Pav",
        lunch: "Kolkata Double Paneer Kathi Roll",
        dinner: "Delhi Chole Bhature with Pickled Onions"
      },
      relaxed: {
        breakfast: "Mumbai Pav Bhaji & Vada Pav combo",
        lunch: "Samosa Chaat, Kolkata Paneer Roll & Mint Chutney",
        dinner: "Delhi Chole Bhature & Sweet Lassi"
      }
    }
  }
};

// Main Planner filter function
export function getMealPlan(
  dietPreference: string | string[], // can be array or string
  schedule: "busy" | "standard" | "relaxed",
  cuisine: string = "gujarati"
): Recipe[] {
  const normalizedCuisine = cuisine.toLowerCase();
  
  // Try to query directly from structured CUISINE_DATABASE
  if (CUISINE_DATABASE[normalizedCuisine] && CUISINE_DATABASE[normalizedCuisine][schedule]) {
    const meals = CUISINE_DATABASE[normalizedCuisine][schedule];
    return [
      {
        id: `${normalizedCuisine}-breakfast-${schedule}`,
        name: meals.breakfast.name,
        type: "breakfast",
        prepTime: schedule === "busy" ? 5 : schedule === "standard" ? 10 : 20,
        cookTime: schedule === "busy" ? 10 : schedule === "standard" ? 15 : 30,
        difficulty: schedule === "busy" ? "easy" : schedule === "standard" ? "medium" : "hard",
        instructions: meals.breakfast.instructions,
        dietaryPreferences: Array.isArray(dietPreference) ? dietPreference : [dietPreference],
        scheduleComplexity: schedule,
        cuisine: normalizedCuisine,
        ingredients: meals.breakfast.ingredients,
        calories: meals.breakfast.calories,
        imageUrl: "/berry_oats.png"
      },
      {
        id: `${normalizedCuisine}-lunch-${schedule}`,
        name: meals.lunch.name,
        type: "lunch",
        prepTime: schedule === "busy" ? 7 : schedule === "standard" ? 12 : 25,
        cookTime: schedule === "busy" ? 12 : schedule === "standard" ? 20 : 35,
        difficulty: schedule === "busy" ? "easy" : schedule === "standard" ? "medium" : "hard",
        instructions: meals.lunch.instructions,
        dietaryPreferences: Array.isArray(dietPreference) ? dietPreference : [dietPreference],
        scheduleComplexity: schedule,
        cuisine: normalizedCuisine,
        ingredients: meals.lunch.ingredients,
        calories: meals.lunch.calories,
        imageUrl: "/salmon_bowl.png"
      },
      {
        id: `${normalizedCuisine}-dinner-${schedule}`,
        name: meals.dinner.name,
        type: "dinner",
        prepTime: schedule === "busy" ? 5 : schedule === "standard" ? 15 : 30,
        cookTime: schedule === "busy" ? 10 : schedule === "standard" ? 25 : 45,
        difficulty: schedule === "busy" ? "easy" : schedule === "standard" ? "medium" : "hard",
        instructions: meals.dinner.instructions,
        dietaryPreferences: Array.isArray(dietPreference) ? dietPreference : [dietPreference],
        scheduleComplexity: schedule,
        cuisine: normalizedCuisine,
        ingredients: meals.dinner.ingredients,
        calories: meals.dinner.calories,
        imageUrl: "/tofu_stir_fry.png"
      }
    ];
  }

  // Fallback dynamic generation based on REGIONAL_PROFILES
  const profile = REGIONAL_PROFILES[normalizedCuisine] || REGIONAL_PROFILES["gujarati"];
  const dishes = profile.dishes[schedule];
  const proteinName = profile.stapleProtein;
  const cheapProteinName = profile.cheaperProtein;

  const getIngredientsForMeal = (mealType: "breakfast" | "lunch" | "dinner") => {
    let costMult = schedule === "busy" ? 0.7 : schedule === "standard" ? 1.0 : 1.5;
    
    // Customize base ingredients based on meal type
    if (mealType === "breakfast") {
      return [
        {
          id: `${normalizedCuisine}-${schedule}-b1`,
          name: `Fresh Premium ${proteinName}`,
          baseName: proteinName,
          quantity: "200g",
          amount: 200,
          unit: "g",
          estimatedCost: Math.round(50 * costMult),
          substitutes: [
            { name: `Standard ${cheapProteinName}`, estimatedCost: Math.round(20 * costMult), type: "cheaper", quantity: "200g", amount: 200, unit: "g" }
          ]
        },
        {
          id: `${normalizedCuisine}-${schedule}-b2`,
          name: `Authentic spices (${profile.spices.join(", ")})`,
          baseName: "Spices",
          quantity: "1 unit",
          amount: 1,
          unit: "unit",
          estimatedCost: Math.round(15 * costMult),
          substitutes: []
        }
      ];
    } else if (mealType === "lunch") {
      return [
        {
          id: `${normalizedCuisine}-${schedule}-l1`,
          name: `Premium Basmati / Surti Rice cooked with ${profile.spices[0]}`,
          baseName: "Rice",
          quantity: "250g",
          amount: 250,
          unit: "g",
          estimatedCost: Math.round(35 * costMult),
          substitutes: [
            { name: "Broken Rice (Kani)", estimatedCost: Math.round(15 * costMult), type: "cheaper", quantity: "250g", amount: 250, unit: "g" }
          ]
        },
        {
          id: `${normalizedCuisine}-${schedule}-l2`,
          name: `Organic Fresh Vegetables & Oil`,
          baseName: "Vegetables",
          quantity: "300g",
          amount: 300,
          unit: "g",
          estimatedCost: Math.round(45 * costMult),
          substitutes: []
        }
      ];
    } else {
      return [
        {
          id: `${normalizedCuisine}-${schedule}-d1`,
          name: `High-quality ${proteinName} cubes`,
          baseName: proteinName,
          quantity: "250g",
          amount: 250,
          unit: "g",
          estimatedCost: Math.round(75 * costMult),
          substitutes: [
            { name: `Local ${cheapProteinName}`, estimatedCost: Math.round(30 * costMult), type: "cheaper", quantity: "200g", amount: 200, unit: "g" }
          ]
        },
        {
          id: `${normalizedCuisine}-${schedule}-d2`,
          name: `Special Masala Gravy tempered in mustard`,
          baseName: "Gravy Base",
          quantity: "1 unit",
          amount: 1,
          unit: "unit",
          estimatedCost: Math.round(35 * costMult),
          substitutes: []
        }
      ];
    }
  };

  return [
    {
      id: `${normalizedCuisine}-breakfast-${schedule}`,
      name: dishes.breakfast,
      type: "breakfast",
      prepTime: schedule === "busy" ? 5 : schedule === "standard" ? 10 : 20,
      cookTime: schedule === "busy" ? 10 : schedule === "standard" ? 15 : 30,
      difficulty: schedule === "busy" ? "easy" : schedule === "standard" ? "medium" : "hard",
      instructions: [
        `Whisk and assemble components flavored with ${profile.spices[0]}.`,
        `Slow-cook on iron tawa until crisp and brown.`,
        `Serve hot with fresh local chutney.`
      ],
      dietaryPreferences: Array.isArray(dietPreference) ? dietPreference : [dietPreference],
      scheduleComplexity: schedule,
      cuisine: normalizedCuisine,
      ingredients: getIngredientsForMeal("breakfast"),
      calories: schedule === "busy" ? 280 : schedule === "standard" ? 360 : 480,
      imageUrl: "/berry_oats.png"
    },
    {
      id: `${normalizedCuisine}-lunch-${schedule}`,
      name: dishes.lunch,
      type: "lunch",
      prepTime: schedule === "busy" ? 7 : schedule === "standard" ? 12 : 25,
      cookTime: schedule === "busy" ? 12 : schedule === "standard" ? 20 : 35,
      difficulty: schedule === "busy" ? "easy" : schedule === "standard" ? "medium" : "hard",
      instructions: [
        `Boil grains and spices (${profile.spices.join(", ")}).`,
        `Sauté vegetables in mustard oil and add to base.`,
        `Serve hot with pickle.`
      ],
      dietaryPreferences: Array.isArray(dietPreference) ? dietPreference : [dietPreference],
      scheduleComplexity: schedule,
      cuisine: normalizedCuisine,
      ingredients: getIngredientsForMeal("lunch"),
      calories: schedule === "busy" ? 420 : schedule === "standard" ? 520 : 680,
      imageUrl: "/salmon_bowl.png"
    },
    {
      id: `${normalizedCuisine}-dinner-${schedule}`,
      name: dishes.dinner,
      type: "dinner",
      prepTime: schedule === "busy" ? 5 : schedule === "standard" ? 15 : 30,
      cookTime: schedule === "busy" ? 10 : schedule === "standard" ? 25 : 45,
      difficulty: schedule === "busy" ? "easy" : schedule === "standard" ? "medium" : "hard",
      instructions: [
        `Sauté protein cubes in spices.`,
        `Simmer in coconut/tomato base with curry leaves until thick.`,
        `Serve with hot rotis.`
      ],
      dietaryPreferences: Array.isArray(dietPreference) ? dietPreference : [dietPreference],
      scheduleComplexity: schedule,
      cuisine: normalizedCuisine,
      ingredients: getIngredientsForMeal("dinner"),
      calories: schedule === "busy" ? 390 : schedule === "standard" ? 470 : 610,
      imageUrl: "/tofu_stir_fry.png"
    }
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
