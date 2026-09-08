import {
  ChefHat,
  Compass,
  ClipboardList,
  Cpu,
  Sprout,
  Lightbulb,
  House,
} from "lucide-react";

export const CATEGORIES = [
  {
    id: "recipes",
    name: "Recipes",
    icon: ChefHat,
    color: "#0F766E",
  },
  {
    id: "guides",
    name: "Guides",
    icon: Compass,
    color: "#1D4ED8",
  },
  {
    id: "instructions",
    name: "Instructions",
    icon: ClipboardList,
    color: "#7C3AED",
  },
  {
    id: "tech",
    name: "Tech",
    icon: Cpu,
    color: "#2563EB",
  },
  {
    id: "garden",
    name: "Garden",
    icon: Sprout,
    color: "#16A34A",
  },
  {
    id: "tips",
    name: "Tipps",
    icon: Lightbulb,
    color: "#F59E0B",
  },
  {
    id: "home",
    name: "Home",
    icon: House,
    color: "#EC4899",
  },
];
