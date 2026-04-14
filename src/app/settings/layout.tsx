import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Settings | GreenCard.ai",
  description: "Manage your GreenCard.ai account settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">{children}</main>
      <Footer />
    </>
  );
}
