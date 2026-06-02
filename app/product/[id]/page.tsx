import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { prisma } from "@/prisma/prisma-client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      items: {
        orderBy: { price: "asc" },
      },
      ingredients: {
        orderBy: { id: "asc" },
      },
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <Container className="py-10">
      <div className="grid grid-cols-2 gap-10">
        <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-gray-50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-8"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-gray-500">{product.category.name}</p>
          <Title text={product.name} size="lg" className="mb-6 font-extrabold" />

          <p className="mb-3 text-sm text-gray-500">Ціна від</p>
          <p className="mb-8 text-3xl font-black">
            {product.items[0]?.price ?? 0} грн
          </p>

          {product.ingredients.length > 0 && (
            <>
              <p className="mb-3 text-sm text-gray-500">Інгредієнти</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => (
                  <span
                    key={ingredient.id}
                    className="rounded-xl bg-gray-100 px-3 py-2 text-sm"
                  >
                    {ingredient.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
