import {
    Award,
    Beef,
    ChefHat,
    CookingPot,
    Drumstick,
    Egg,
    Fish,
    Ham,
    HeartPulse,
    Leaf,
    Soup,
    UtensilsCrossed,
    Wheat,
    Croissant,
    type LucideIcon,
} from 'lucide-react';

export const DEFAULT_CATEGORY_ICON: LucideIcon = UtensilsCrossed;

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
    'American & Chinese Special': ChefHat,
    Appetizer: Croissant,
    Soup: Soup,
    Pork: Ham,
    Beef: Beef,
    Seafood: Fish,
    'Side Order': UtensilsCrossed,
    'Chicken/Poultry': Drumstick,
    Vegetable: Leaf,
    'Diet Menu': HeartPulse,
    "Chef's Specialities": Award,
    'Fried Rice': Wheat,
    'Egg Foo Young': Egg,
    'Chow Mein or Chop Suey': CookingPot,
    'Pad Thai': CookingPot,
    'Lo Mein': CookingPot,
    'Chow Mai Fun or Ho Fun': CookingPot,
};
