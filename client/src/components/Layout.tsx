import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import FloatingCartButton from "./FloatingCartButton";

export default function Layout() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </>
  );
}
