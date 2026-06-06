import type { Prisma } from "@/lib/generated/prisma";

export const PRICE_FILTER_MAX = 1000;
const NEW_PRODUCTS_DAYS = 30;

export type ProductFilterParams = {
  pizzaTypes: number[];
  ingredientIds: number[];
  priceFrom: number;
  priceTo: number;
};

export const DEFAULT_PRODUCT_FILTERS: ProductFilterParams = {
  pizzaTypes: [],
  ingredientIds: [],
  priceFrom: 0,
  priceTo: PRICE_FILTER_MAX,
};

const parseNumberList = (value: string | null, allowed?: Set<number>) => {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter(
      (num) =>
        Number.isInteger(num) &&
        num > 0 &&
        (!allowed || allowed.has(num)),
    );
};

export const parseProductFilterSearchParams = (
  searchParams: URLSearchParams,
): ProductFilterParams => {
  const pizzaTypes = parseNumberList(
    searchParams.get("pizzaTypes"),
    new Set([1, 2]),
  );
  const ingredientIds = parseNumberList(searchParams.get("ingredients"));
  const priceFrom = Number(searchParams.get("priceFrom") ?? 0);
  const priceTo = Number(
    searchParams.get("priceTo") ?? PRICE_FILTER_MAX,
  );

  return {
    pizzaTypes,
    ingredientIds,
    priceFrom: Number.isFinite(priceFrom)
      ? Math.max(0, priceFrom)
      : 0,
    priceTo: Number.isFinite(priceTo)
      ? Math.max(0, priceTo)
      : PRICE_FILTER_MAX,
  };
};

export const hasActiveProductFilters = (filters: ProductFilterParams) => {
  const minPrice = Math.min(filters.priceFrom, filters.priceTo);
  const maxPrice = Math.max(filters.priceFrom, filters.priceTo);

  return (
    filters.pizzaTypes.length > 0 ||
    filters.ingredientIds.length > 0 ||
    minPrice > 0 ||
    maxPrice < PRICE_FILTER_MAX
  );
};

export const buildProductWhere = (
  filters: ProductFilterParams,
): Prisma.ProductWhereInput => {
  const conditions: Prisma.ProductWhereInput[] = [];

  if (filters.pizzaTypes.length > 0 && filters.pizzaTypes.length < 2) {
    const typeConditions: Prisma.ProductWhereInput[] = [];

    if (filters.pizzaTypes.includes(1)) {
      typeConditions.push({
        ingredients: { some: {} },
      });
    }

    if (filters.pizzaTypes.includes(2)) {
      const since = new Date();
      since.setDate(since.getDate() - NEW_PRODUCTS_DAYS);
      typeConditions.push({
        createdAt: { gte: since },
      });
    }

    if (typeConditions.length === 1) {
      conditions.push(typeConditions[0]);
    }
  } else if (filters.pizzaTypes.length === 2) {
    const since = new Date();
    since.setDate(since.getDate() - NEW_PRODUCTS_DAYS);

    conditions.push({
      OR: [
        { ingredients: { some: {} } },
        { createdAt: { gte: since } },
      ],
    });
  }

  if (filters.ingredientIds.length > 0) {
    conditions.push({
      AND: filters.ingredientIds.map((id) => ({
        ingredients: { some: { id } },
      })),
    });
  }

  const minPrice = Math.min(filters.priceFrom, filters.priceTo);
  const maxPrice = Math.max(filters.priceFrom, filters.priceTo);

  if (minPrice > 0 || maxPrice < PRICE_FILTER_MAX) {
    conditions.push({
      items: {
        some: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
};

export const productFiltersToSearchParams = (
  filters: ProductFilterParams,
) => {
  const params: Record<string, string | number> = {
    priceFrom: filters.priceFrom,
    priceTo: filters.priceTo,
  };

  if (filters.pizzaTypes.length > 0) {
    params.pizzaTypes = filters.pizzaTypes.join(",");
  }

  if (filters.ingredientIds.length > 0) {
    params.ingredients = filters.ingredientIds.join(",");
  }

  return params;
};
