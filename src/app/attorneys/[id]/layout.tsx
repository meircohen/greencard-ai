import { Navbar } from "@/components/Navbar";

export default function AttorneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
