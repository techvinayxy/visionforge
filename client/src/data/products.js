const products = [
  {
    id: 1,
    name: "VISIONFORGE Titan Gaming PC",
    category: "Gaming PCs",

    price: 89999,
    originalPrice: 104999,
    discount: 14,

    images: [
      "https://res.cloudinary.com/cm0zg2bc/image/upload/v1790958993/Titan_Gaming_PC.png",
    ],

    description:
      "The VISIONFORGE Titan Gaming PC is built for high-performance gaming, streaming, content creation and demanding applications.",

    specifications: {
      processor: "AMD Ryzen 7",
      graphics: "NVIDIA GeForce RTX",
      ram: "16GB DDR5",
      storage: "1TB NVMe SSD",
      motherboard: "B650 Gaming Motherboard",
      powerSupply: "650W 80+ Bronze",
      cooling: "Air Cooling",
      operatingSystem: "Windows 11",
    },

    features: [
      "High-performance gaming",
      "Fast NVMe storage",
      "16GB DDR5 memory",
      "Upgradeable components",
      "Gaming-focused design",
    ],

    whatsInTheBox: [
      "VISIONFORGE Titan Gaming PC",
      "Power Cable",
      "User Manual",
      "Warranty Card",
    ],

    rating: 4.5,
    reviews: 24,
    stock: 12,

    sku: "VF-TITAN-001",

    warranty: "1 Year",

    returnPolicy: "7 Days Replacement",

    delivery: {
      freeDelivery: true,
      codAvailable: true,
      estimatedDays: "3-5 Business Days",
    },

    seller: {
      name: "VISIONFORGE Official",
      verified: true,
      rating: 4.8,
      location: "Mumbai, Maharashtra",
    },
  },

  {
    id: 2,
    name: "VISIONFORGE Phantom Gaming PC",
    category: "Gaming PCs",
    price: 74999,
    image: "/products/gaming-pc-2.jpg",
  },

  {
    id: 3,
    name: "VISIONFORGE Pro Gaming PC",
    category: "Gaming PCs",
    price: 109999,
    image: "/products/gaming-pc-3.jpg",
  },

  {
    id: 4,
    name: "VISIONFORGE Entry Gaming PC",
    category: "Gaming PCs",
    price: 54999,
    image: "/products/gaming-pc-4.jpg",
  },

  {
    id: 5,
    name: "RTX Gaming Graphics Card",
    category: "Graphics Cards",
    price: 54999,
    image: "/products/gpu-1.jpg",
  },

  {
    id: 6,
    name: "RTX Performance Graphics Card",
    category: "Graphics Cards",
    price: 69999,
    image: "/products/gpu-2.jpg",
  },

  {
    id: 7,
    name: "RTX High Performance GPU",
    category: "Graphics Cards",
    price: 84999,
    image: "/products/gpu-3.jpg",
  },

  {
    id: 8,
    name: "Gaming Graphics Card 8GB",
    category: "Graphics Cards",
    price: 32999,
    image: "/products/gpu-4.jpg",
  },

  {
    id: 9,
    name: "Performance Gaming Processor",
    category: "Processors",
    price: 32999,
    image: "/products/cpu-1.jpg",
  },

  {
    id: 10,
    name: "VISIONFORGE Power Processor",
    category: "Processors",
    price: 42999,
    image: "/products/cpu-2.jpg",
  },

  {
    id: 11,
    name: "High Performance CPU",
    category: "Processors",
    price: 51999,
    image: "/products/cpu-3.jpg",
  },

  {
    id: 12,
    name: "Gaming Performance Motherboard",
    category: "Motherboards",
    price: 18999,
    image: "/products/motherboard-1.jpg",
  },

  {
    id: 13,
    name: "VISIONFORGE Pro Motherboard",
    category: "Motherboards",
    price: 24999,
    image: "/products/motherboard-2.jpg",
  },

  {
    id: 14,
    name: "16GB DDR5 Gaming RAM",
    category: "RAM",
    price: 5999,
    image: "/products/ram-1.jpg",
  },

  {
    id: 15,
    name: "32GB DDR5 Performance RAM",
    category: "RAM",
    price: 10999,
    image: "/products/ram-2.jpg",
  },

  {
    id: 16,
    name: "1TB NVMe SSD",
    category: "Storage",
    price: 7999,
    image: "/products/ssd-1.jpg",
  },

  {
    id: 17,
    name: "2TB NVMe Performance SSD",
    category: "Storage",
    price: 13999,
    image: "/products/ssd-2.jpg",
  },

  {
    id: 18,
    name: "VISIONFORGE Gaming Laptop",
    category: "Laptops",
    price: 74999,
    image: "/products/laptop-1.jpg",
  },

  {
    id: 19,
    name: "VISIONFORGE Pro Gaming Laptop",
    category: "Laptops",
    price: 99999,
    image: "/products/laptop-2.jpg",
  },

  {
    id: 20,
    name: "VISIONFORGE Performance Smartphone",
    category: "Mobiles",
    price: 39999,
    image: "/products/mobile-1.jpg",
  },
];

export default products;

