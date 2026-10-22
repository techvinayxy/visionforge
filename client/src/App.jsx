import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import CloudinaryUpload from "./components/CloudinaryUpload";
import Cart from "./pages/Cart.jsx";
import PCBuilder from "./pages/PCBuilder";
import Compare from "./pages/Compare";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route
          path="/cloudinary-test"
          element={<CloudinaryUpload />}
        />
        <Route path="/builder" element={<PCBuilder />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;