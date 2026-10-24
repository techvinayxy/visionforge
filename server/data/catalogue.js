// Server-side reference catalogue for MJ. Keep aligned with client/src/data/products.js.
// These are seeded website catalogue entries, not live inventory from MongoDB.
module.exports = [
  { id: 1, name: "VISIONFORGE Titan Gaming PC", category: "Gaming PCs", price: 89999, specs: { processor: "AMD Ryzen 7", graphics: "NVIDIA GeForce RTX", ram: "16GB DDR5", storage: "1TB NVMe SSD", motherboard: "B650 Gaming Motherboard", powerSupply: "650W 80+ Bronze" } },
  { id: 2, name: "VISIONFORGE Phantom Gaming PC", category: "Gaming PCs", price: 74999, specs: { processor: "AMD Ryzen 5", graphics: "NVIDIA GeForce RTX", ram: "16GB DDR5", storage: "1TB NVMe SSD" } },
  { id: 3, name: "VISIONFORGE Pro Gaming PC", category: "Gaming PCs", price: 109999, specs: { processor: "AMD Ryzen 7", graphics: "NVIDIA GeForce RTX", ram: "32GB DDR5", storage: "1TB NVMe SSD", motherboard: "B650 Gaming Motherboard" } },
  { id: 4, name: "VISIONFORGE Entry Gaming PC", category: "Gaming PCs", price: 54999, specs: { processor: "AMD Ryzen 5", graphics: "Dedicated or Integrated Graphics", ram: "16GB DDR4", storage: "512GB SSD" } },
  { id: 5, name: "RTX Gaming Graphics Card", category: "Graphics Cards", price: 54999, specs: { graphicsArchitecture: "NVIDIA GeForce RTX", memory: "8GB GDDR6", interface: "PCI Express", cooling: "Dual-Fan Cooling" } },
  { id: 6, name: "RTX Performance Graphics Card", category: "Graphics Cards", price: 69999, specs: { graphicsArchitecture: "NVIDIA GeForce RTX", memory: "12GB GDDR6", interface: "PCI Express", cooling: "Triple-Fan Cooling" } },
  { id: 7, name: "RTX High Performance GPU", category: "Graphics Cards", price: 84999, specs: { graphicsArchitecture: "NVIDIA GeForce RTX", memory: "16GB GDDR6", interface: "PCI Express", cooling: "Triple-Fan Cooling" } },
  { id: 8, name: "Gaming Graphics Card 8GB", category: "Graphics Cards", price: 32999, specs: { graphicsMemory: "8GB", memoryType: "GDDR6", interface: "PCI Express", cooling: "Dual-Fan Cooling" } },
  { id: 9, name: "Performance Gaming Processor", category: "Processors", price: 32999, specs: { processorFamily: "AMD Ryzen", cores: "6 Cores", threads: "12 Threads", socket: "AM5" } },
  { id: 10, name: "VISIONFORGE Power Processor", category: "Processors", price: 42999, specs: { processorFamily: "AMD Ryzen", cores: "8 Cores", threads: "16 Threads", socket: "AM5" } },
  { id: 11, name: "High Performance CPU", category: "Processors", price: 51999, specs: { processorFamily: "AMD Ryzen", cores: "8 Cores", threads: "16 Threads", socket: "AM5" } },
  { id: 12, name: "Gaming Performance Motherboard", category: "Motherboards", price: 18999, specs: { platform: "AMD Compatible", memorySupport: "DDR5", storage: "M.2 NVMe and SATA", expansion: "PCI Express" } },
  { id: 13, name: "VISIONFORGE Pro Motherboard", category: "Motherboards", price: 24999, specs: { platform: "AMD Compatible", memorySupport: "DDR5", storage: "M.2 NVMe and SATA", expansion: "PCI Express" } },
  { id: 14, name: "16GB DDR5 Gaming RAM", category: "RAM", price: 5999, specs: { capacity: "16GB", memoryType: "DDR5", compatibility: "DDR5-Compatible Motherboard" } },
  { id: 15, name: "32GB DDR5 Performance RAM", category: "RAM", price: 10999, specs: { capacity: "32GB", memoryType: "DDR5", compatibility: "DDR5-Compatible Motherboard" } },
  { id: 16, name: "1TB NVMe SSD", category: "Storage", price: 7999, specs: { capacity: "1TB", type: "NVMe SSD" } },
  { id: 17, name: "2TB NVMe Performance SSD", category: "Storage", price: 13999, specs: { capacity: "2TB", type: "NVMe SSD" } },
  { id: 18, name: "VISIONFORGE Gaming Laptop", category: "Laptops", price: 74999 },
  { id: 19, name: "VISIONFORGE Pro Gaming Laptop", category: "Laptops", price: 99999 },
  { id: 20, name: "VISIONFORGE Performance Smartphone", category: "Mobiles", price: 39999 }
];
