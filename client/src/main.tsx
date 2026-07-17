import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./lib/trpc";
import { CartProvider } from "./contexts/CartContext";
import "./styles/tokens.css";
import "./styles/site.css";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import LabTests from "./pages/LabTests";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Shipping from "./pages/policies/Shipping";
import Privacy from "./pages/policies/Privacy";
import Terms from "./pages/policies/Terms";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminLabReports from "./pages/admin/AdminLabReports";
import AdminImages from "./pages/admin/AdminImages";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc" })],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products/:handle" element={<ProductDetail />} />
                <Route path="/lab-tests" element={<LabTests />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
              </Route>
              {/* Admin has its own minimal shell — no storefront nav/footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminProducts />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="lab-reports" element={<AdminLabReports />} />
                <Route path="images" element={<AdminImages />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);
