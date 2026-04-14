import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Admin Dashboard | GreenCard.ai",
  description: "GreenCard.ai Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side role check. The middleware sets x-user-role from the JWT.
  // This prevents any non-admin from reaching the admin page, regardless
  // of what the client-side Zustand store says.
  const headersList = await headers();
  const userRole = headersList.get("x-user-role");

  if (userRole !== "admin") {
    redirect("/login?from=/admin");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">{children}</main>
      <Footer />
    </>
  );
}
