import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { ProductPageForm } from "@/components/shared/product-page-form";
import { getProductById } from "@/lib/get-product-by-id";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <Container className="py-10">
      <ProductPageForm product={product} />
    </Container>
  );
}
