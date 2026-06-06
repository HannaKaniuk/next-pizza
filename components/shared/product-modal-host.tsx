"use client";

import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { ProductModalLoader } from "./modals/product-modal-loader";
import { useProductModalStore } from "@/store/product-modal";

export function ProductModalHost() {
  const pathname = usePathname();
  const modalSegment = useSelectedLayoutSegment("modal");
  const preview = useProductModalStore((s) => s.preview);

  const pathMatch = pathname.match(/^\/product\/(\d+)$/);
  const isInterceptedModal = modalSegment === "(.)product";

  const productId =
    preview?.id ??
    (isInterceptedModal && pathMatch ? Number(pathMatch[1]) : null);

  if (!productId) {
    return null;
  }

  return <ProductModalLoader key={productId} productId={productId} />;
}
