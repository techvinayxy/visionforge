
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const components = {
  CPU: [
    { id: "cpu-7600", name: "AMD Ryzen 5 7600", price: 18999, socket: "AM5", description: "6 cores · 12 threads", badge: "GREAT VALUE" },
    { id: "cpu-7800x3d", name: "AMD Ryzen 7 7800X3D", price: 36999, socket: "AM5", description: "8 cores · 16 threads", badge: "GAMING PICK" },
    { id: "cpu-14400f", name: "Intel Core i5-14400F", price: 17999, socket: "LGA1700", description: "10 cores · 16 threads", badge: "INTEL BUILD" },
  ],
  GPU: [
    { id: "gpu-4060", name: "NVIDIA RTX 4060 8GB", price: 29999, minPsu: 550, description: "1080p gaming", badge: "POPULAR" },
    { id: "gpu-4070s", name: "NVIDIA RTX 4070 SUPER 12GB", price: 59999, minPsu: 650, description: "1440p high-performance gaming", badge: "HIGH PERFORMANCE" },
    { id: "gpu-rx7600", name: "AMD Radeon RX 7600 8GB", price: 26999, minPsu: 550, description: "1080p gaming", badge: "AMD BUILD" },
  ],
  Motherboard: [
    { id: "mb-b650m", name: "MSI B650M Gaming WiFi", price: 13999, socket: "AM5", ramType: "DDR5", description: "AM5 · DDR5 · Wi-Fi" },
    { id: "mb-tuf-b650", name: "ASUS TUF B650-PLUS", price: 19999, socket: "AM5", ramType: "DDR5", description: "AM5 · DDR5 · TUF series" },
    { id: "mb-b760m", name: "MSI B760M DDR5", price: 12999, socket: "LGA1700", ramType: "DDR5", description: "LGA1700 · DDR5" },
  ],
  RAM: [
    { id: "ram-16", name: "16GB DDR5 RAM", price: 3999, ramType: "DDR5", description: "16GB memory capacity" },
    { id: "ram-32", name: "32GB DDR5 RAM", price: 7499, ramType: "DDR5", description: "32GB memory capacity", badge: "RECOMMENDED" },
    { id: "ram-64", name: "64GB DDR5 RAM", price: 13999, ramType: "DDR5", description: "64GB memory capacity" },
  ],
  Storage: [
    { id: "ssd-500", name: "500GB NVMe SSD", price: 2999, description: "Fast NVMe storage" },
    { id: "ssd-1tb", name: "1TB NVMe SSD", price: 4999, description: "Everyday gaming storage", badge: "RECOMMENDED" },
    { id: "ssd-2tb", name: "2TB NVMe SSD", price: 9999, description: "More space for games" },
  ],
  PSU: [
    { id: "psu-650", name: "650W 80+ Bronze PSU", price: 4999, wattage: 650, description: "650W · Bronze efficiency" },
    { id: "psu-750", name: "750W 80+ Gold PSU", price: 7999, wattage: 750, description: "750W · Gold efficiency", badge: "RECOMMENDED" },
    { id: "psu-850", name: "850W 80+ Gold PSU", price: 10999, wattage: 850, description: "850W · Gold efficiency" },
  ],
  Cabinet: [
    { id: "case-airflow", name: "Mid Tower Airflow Case", price: 3999, description: "Airflow-focused design" },
    { id: "case-argb", name: "ARGB Gaming Cabinet", price: 5999, description: "RGB lighting · Gaming style", badge: "GAMING PICK" },
    { id: "case-panoramic", name: "Premium Panoramic Case", price: 8999, description: "Panoramic glass design" },
  ],
};

const categories = [
  { key: "CPU", icon: "⚙️", subtitle: "Processing power" },
  { key: "GPU", icon: "🎮", subtitle: "Graphics & gaming" },
  { key: "Motherboard", icon: "▦", subtitle: "System foundation" },
  { key: "RAM", icon: "▤", subtitle: "Memory capacity" },
  { key: "Storage", icon: "▰", subtitle: "Games & files" },
  { key: "PSU", icon: "ϟ", subtitle: "Power delivery" },
  { key: "Cabinet", icon: "▥", subtitle: "Case & airflow" },
];

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function getCompatibilityWarnings(build) {
  const warnings = [];

  if (
    build.CPU &&
    build.Motherboard &&
    build.CPU.socket !== build.Motherboard.socket
  ) {
    warnings.push(
      `CPU socket mismatch: ${build.CPU.name} uses ${build.CPU.socket}, but ${build.Motherboard.name} uses ${build.Motherboard.socket}.`
    );
  }

  if (
    build.Motherboard &&
    build.RAM &&
    build.Motherboard.ramType !== build.RAM.ramType
  ) {
    warnings.push(
      `Memory mismatch: the motherboard requires ${build.Motherboard.ramType}, but the selected RAM is ${build.RAM.ramType}.`
    );
  }

  if (
    build.GPU &&
    build.PSU &&
    build.PSU.wattage < build.GPU.minPsu
  ) {
    warnings.push(
      `Power supply may be insufficient: the selected GPU recommends at least ${build.GPU.minPsu}W, but your PSU is ${build.PSU.wattage}W.`
    );
  }

  return warnings;
}

function PCBuilder() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [build, setBuild] = useState({});
  const [budget, setBudget] = useState("100000");

  const selectedCount = Object.keys(build).length;
  const total = Object.values(build).reduce(
    (sum, part) => sum + part.price,
    0
  );

  const budgetAmount = Math.max(0, Number(budget) || 0);
  const budgetRemaining = budgetAmount - total;
  const budgetUsed =
    budgetAmount > 0 ? Math.min((total / budgetAmount) * 100, 100) : 0;

  const compatibilityWarnings = getCompatibilityWarnings(build);
  const complete = selectedCount === categories.length;

  function selectComponent(category, partId) {
    const selectedPart = components[category].find(
      (part) => part.id === partId
    );

    setBuild((previous) => {
      if (!selectedPart) {
        const updated = { ...previous };
        delete updated[category];
        return updated;
      }

      return { ...previous, [category]: selectedPart };
    });
  }

  function resetBuild() {
    setBuild({});
    setBudget("100000");
  }

  function handleAddBuildToCart() {
    if (!complete) {
      alert("Please select all 7 components before adding your build to the cart.");
      return;
    }

    if (compatibilityWarnings.length > 0) {
      alert(
        "Please resolve the compatibility warnings before adding your build to the cart."
      );
      return;
    }

    // Add each selected component as a separate cart item.
    categories.forEach(({ key }) => {
      const part = build[key];

      addToCart({
        id: `vf-build-${part.id}`,
        name: part.name,
        price: part.price,
        category: "PC Builder Component",
        description: part.description,
        isCustomBuildPart: true,
        buildCategory: key,
      });
    });

    navigate("/cart");
  }

  return (
    <main className="pc-builder-page">
      <div className="pc-builder-container">
        <section className="builder-hero">
          <div className="builder-hero-copy">
            <span className="builder-eyebrow">VISIONFORGE / CONFIGURATOR</span>
            <h1>Build your <span>dream PC.</span></h1>
            <p>
              Your performance. Your components. Your build.
              Configure your gaming rig and track its estimated cost in real time.
            </p>

            <div className="builder-hero-stats">
              <div><strong>07</strong><span>Components</span></div>
              <div><strong>LIVE</strong><span>Price tracking</span></div>
              <div><strong>PC</strong><span>Compatibility checks</span></div>
            </div>
          </div>

          <div className="builder-hero-art" aria-hidden="true">
            <div className="builder-orbit builder-orbit-one" />
            <div className="builder-orbit builder-orbit-two" />
            <div className="builder-hero-chip">
              <span>VF</span>
              <small>BUILD SERIES</small>
            </div>
            <div className="builder-hero-glow" />
          </div>
        </section>

        <section className="builder-toolbar">
          <div>
            <span className="builder-section-kicker">CONFIGURE YOUR RIG</span>
            <h2>Choose your components</h2>
            <p>Select a part from each category to build your setup.</p>
          </div>

          <button type="button" className="builder-reset-button" onClick={resetBuild}>
            <span aria-hidden="true">↺</span> Reset build
          </button>
        </section>

        <section className="builder-component-grid">
          {categories.map((category, index) => {
            const selected = build[category.key];

            return (
              <article
                className={`builder-component-card ${selected ? "is-selected" : ""}`}
                key={category.key}
              >
                <div className="builder-card-topline">
                  <span className="builder-card-icon" aria-hidden="true">{category.icon}</span>
                  <span className="builder-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="builder-card-heading">
                  <div>
                    <h3>{category.key}</h3>
                    <p>{category.subtitle}</p>
                  </div>
                  <span className={`builder-selection-indicator ${selected ? "active" : ""}`}>
                    {selected ? "✓" : "+"}
                  </span>
                </div>

                <label className="builder-select-label" htmlFor={`builder-${category.key}`}>
                  SELECT {category.key.toUpperCase()}
                </label>

                <select
                  id={`builder-${category.key}`}
                  value={selected?.id || ""}
                  onChange={(event) => selectComponent(category.key, event.target.value)}
                >
                  <option value="">Choose a component</option>
                  {components[category.key].map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.name} — {formatPrice(part.price)}
                    </option>
                  ))}
                </select>

                {selected ? (
                  <div className="builder-selected-part">
                    <div>
                      <span className="builder-selected-caption">SELECTED COMPONENT</span>
                      <strong>{selected.name}</strong>
                      <p>{selected.description}</p>
                    </div>
                    <strong className="builder-selected-price">
                      {formatPrice(selected.price)}
                    </strong>
                  </div>
                ) : (
                  <div className="builder-card-placeholder">
                    <span>—</span>
                    <p>Your selected part will appear here</p>
                  </div>
                )}

                {selected?.badge && (
                  <span className="builder-part-badge">{selected.badge}</span>
                )}
              </article>
            );
          })}
        </section>

        <section className="builder-summary-panel">
          <div className="builder-summary-heading">
            <div>
              <span className="builder-section-kicker">YOUR CONFIGURATION</span>
              <h2>Build summary</h2>
              <p>Review your selected hardware and estimated total.</p>
            </div>

            <div className="builder-completion-count">
              <strong>{selectedCount}</strong>
              <span>/ {categories.length} PARTS</span>
            </div>
          </div>

          <div className="builder-summary-layout">
            <div className="builder-summary-parts">
              <div className="builder-summary-parts-heading">
                <span>COMPONENT</span>
                <span>PRICE</span>
              </div>

              {categories.map((category) => {
                const selected = build[category.key];

                return (
                  <div
                    className={`builder-summary-row ${selected ? "has-part" : ""}`}
                    key={category.key}
                  >
                    <div className="builder-summary-part-name">
                      <span className="builder-summary-part-icon">{category.icon}</span>
                      <div>
                        <strong>{category.key}</strong>
                        <p>{selected ? selected.name : "Not selected yet"}</p>
                      </div>
                    </div>
                    <strong className="builder-summary-part-price">
                      {selected ? formatPrice(selected.price) : "—"}
                    </strong>
                  </div>
                );
              })}
            </div>

            <aside className="builder-total-card">
              <span className="builder-section-kicker">ESTIMATED TOTAL</span>
              <div className="builder-total-price">{formatPrice(total)}</div>
              <p className="builder-total-caption">
                {selectedCount} of {categories.length} components selected
              </p>

              <div className="builder-budget-heading">
                <label htmlFor="builder-budget">Your budget (₹)</label>
                <strong>{formatPrice(budgetAmount)}</strong>
              </div>

              <input
                id="builder-budget"
                type="number"
                min="0"
                step="1000"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                placeholder="Enter your budget"
              />

              <div className="builder-budget-track" role="progressbar" aria-label="Budget used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(budgetUsed)}>
                <span style={{ width: `${budgetUsed}%` }} />
              </div>

              <div className="builder-budget-remaining">
                <span>{budgetRemaining >= 0 ? "Budget remaining" : "Over budget"}</span>
                <strong className={budgetRemaining < 0 ? "over-budget" : ""}>
                  {formatPrice(Math.abs(budgetRemaining))}
                </strong>
              </div>

              {compatibilityWarnings.length > 0 ? (
                <div className="builder-compatibility-warning" role="alert">
                  <h3>⚠ Compatibility warnings</h3>
                  <ul>
                    {compatibilityWarnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : selectedCount === 0 ? (
                <p className="builder-compatibility-pending">
                  Select components to check compatibility.
                </p>
              ) : (
                <p className="builder-compatibility-ok">
                  ✓ No known compatibility issues detected in the selected parts.
                </p>
              )}

              <button
                type="button"
                className="builder-complete-button"
                onClick={handleAddBuildToCart}
              >
                Add build to cart <span aria-hidden="true">→</span>
              </button>

              <p className="builder-disclaimer">
                Prices are demonstration estimates and may not reflect current
                market prices. Compatibility checks are basic and do not
                guarantee complete hardware compatibility.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PCBuilder;
