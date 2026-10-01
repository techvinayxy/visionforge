import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhyVisionForge from "../components/home/WhyVisionForge";
import HomeCTA from "../components/home/HomeCTA";

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyVisionForge />
      <HomeCTA />
    </>
  );
}

export default Home;