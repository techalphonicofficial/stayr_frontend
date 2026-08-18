import Footer from "@/components/common/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
