import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;