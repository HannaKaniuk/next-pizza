import { Home } from "@/components/shared/home";
import { getCategoriesWithProducts } from "@/lib/get-categories-with-products";
import { getIngredients } from "@/lib/get-ingredients";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, ingredients] = await Promise.all([
    getCategoriesWithProducts(),
    getIngredients(),
  ]);

  const ingredientItems = ingredients.map((ingredient) => ({
    text: ingredient.name,
    value: String(ingredient.id),
  }));

  return <Home categories={categories} ingredients={ingredientItems} />;
}
