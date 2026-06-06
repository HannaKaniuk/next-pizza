export type ProductSort = "popular" | "price-asc" | "price-desc" | "name";

export const PRODUCT_SORT_OPTIONS: {
  value: ProductSort;
  label: string;
}[] = [
  { value: "popular", label: "популярне" },
  { value: "price-asc", label: "дешевше" },
  { value: "price-desc", label: "дорожче" },
  { value: "name", label: "за назвою" },
];

export function sortProducts<T extends { id: number; name: string; price: number }>(
  products: T[],
  sort: ProductSort,
): T[] {
  const items = [...products];

  switch (sort) {
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    case "name":
      return items.sort((a, b) => a.name.localeCompare(b.name, "uk"));
    default:
      return items;
  }
}
