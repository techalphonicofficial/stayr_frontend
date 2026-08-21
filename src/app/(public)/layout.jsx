import Footer from "@/components/common/Footer";
import { WishlistProvider } from "@/context/WishlistContext";

export default function PublicLayout({ children }) {
  return (
    <WishlistProvider>
      <main className="flex-grow">{children}</main>
      <Footer />
    </WishlistProvider>
  );
}
