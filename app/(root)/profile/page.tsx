import { redirect } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { getUserFromCookies } from "@/lib/server-auth";

export default async function ProfilePage() {
  const user = await getUserFromCookies();

  if (!user) {
    redirect("/");
  }

  return (
    <Container className="py-10">
      <Title text="Профіль" size="lg" className="mb-6 font-extrabold" />
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Імʼя</p>
        <p className="mb-4 text-lg font-bold">{user.fullName}</p>
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="text-lg font-bold">{user.email}</p>
      </div>
    </Container>
  );
}
