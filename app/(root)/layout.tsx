import type { Metadata } from "next";

import { Header } from "@/components/shared";
import { ProductModalHost } from "@/components/shared/product-modal-host";
import { APP_NAME } from "@/lib/app-config";

export const metadata: Metadata = {
  title: APP_NAME,
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
