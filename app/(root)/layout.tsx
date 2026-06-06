import type { Metadata } from "next";

import { Header } from "@/components/shared";
import { ProductModalHost } from "@/components/shared/product-modal-host";

export const metadata: Metadata = {
  title: "Croissants",
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      {modal}
      <ProductModalHost />
    </>
  );
}
