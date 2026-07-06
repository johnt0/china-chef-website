export interface Dish {
    code?: string;
    name: string;
    priceSm?: string;
    priceLg?: string;
    price?: string;
    pricePlain?: string;
    priceFriedRice?: string;
    pricePorkFriedRice?: string;
    priceBeefOrShrimpFriedRice?: string;
    detail?: string;
    spicy?: boolean;
}

export interface Category {
    name: string;
    note?: string;
    items: Dish[];
}

export interface MenuData {
    categories: Category[];
}

export function priceOf(item: Dish) {
    if (item.priceSm && item.priceLg) {
        return `${item.priceSm} / ${item.priceLg}`;
    }
    if (item.pricePlain) {
        return [
            item.pricePlain,
            item.priceFriedRice,
            item.pricePorkFriedRice,
            item.priceBeefOrShrimpFriedRice,
        ]
            .filter(Boolean)
            .join(' / ');
    }
    return item.price || '';
}
