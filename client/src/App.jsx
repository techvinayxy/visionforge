
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import CloudinaryUpload from "./components/CloudinaryUpload";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />

        {/* Cloudinary Upload Test */}
        <Route
          path="/cloudinary-test"
          element={<CloudinaryUpload />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
