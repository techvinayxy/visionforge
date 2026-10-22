import { useState } from "react";
import { Link } from "react-router-dom";
import "./Assistant.css";

const catalog = [
  { id: 1, name: "VISIONFORGE Titan Gaming PC", category: "Gaming PCs", price: 89999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1790958993/Titan_Gaming_PC.png", tags: ["gaming", "1440p", "pc", "build"] },
  { id: 2, name: "VISIONFORGE Phantom Gaming PC", category: "Gaming PCs", price: 74999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791010393/Phantom_Gaming_PC.jpg", tags: ["gaming", "budget", "1080p", "pc"] },
  { id: 3, name: "VISIONFORGE Pro Gaming PC", category: "Gaming PCs", price: 109999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791010644/Pro_Gaming_PC.jpg", tags: ["gaming", "1440p", "high performance", "pc"] },
  { id: 5, name: "RTX Gaming Graphics Card", category: "Graphics Cards", price: 54999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791011087/RTX_Gaming_Graphics_Card.jpg", tags: ["gpu", "graphics", "gaming"] },
  { id: 9, name: "Performance Gaming Processor", category: "Processors", price: 32999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791011857/Performance_Gaming_Processor.jpg", tags: ["cpu", "processor", "gaming"] },
  { id: 18, name: "VISIONFORGE Gaming Laptop", category: "Laptops", price: 74999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791527535/Gaming_Laptop.jpg", tags: ["laptop", "gaming", "creative", "blender", "unreal"] },
  { id: 19, name: "VISIONFORGE Pro Gaming Laptop", category: "Laptops", price: 99999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791527640/Pro_Gaming_Laptop.jpg", tags: ["laptop", "gaming", "creative", "blender", "unreal", "performance"] },
  { id: 20, name: "VISIONFORGE Performance Smartphone", category: "Mobiles", price: 39999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791528474/Performance_Smartphone.png", tags: ["phone", "mobile", "gaming", "smartphone"] },
];

const quickPrompts = [
  { icon: "◈", title: "1440p gaming build", prompt: "Recommend a 1440p gaming build under ₹1,20,000" },
  { icon: "▱", title: "Laptop for creators", prompt: "Best laptop for Unreal Engine & Blender under ₹1,80,000" },
  { icon: "▣", title: "Gaming phone", prompt: "Best phone under ₹40,000 for gaming" },
];

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

function getRecommendations(message) {
  const query = message.toLowerCase();
  const budgetMatch = query.match(/(?:under|below|within|budget(?: of)?|₹|rs\.?\s*)(?:₹\s*)?([\d,]+)/i);
  let budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, "")) : Infinity;
  if (budget < 1000 && /lakh|lac|l/.test(query)) budget *= 100000;
  else if (budget < 1000 && /k/.test(query)) budget *= 1000;
  if (/1,?20,?000|1\.2\s*lakh/.test(query)) budget = 120000;
  if (/1,?80,?000|1\.8\s*lakh/.test(query)) budget = 180000;
  if (/40,?000|40k/.test(query)) budget = 40000;

  let matches = catalog.filter((item) => item.price <= budget);
  if (/laptop|unreal|blender|creative|creator/.test(query)) matches = matches.filter((item) => item.category === "Laptops");
  else if (/phone|mobile|smartphone/.test(query)) matches = matches.filter((item) => item.category === "Mobiles");
  else if (/component|gpu|graphics card|processor|cpu/.test(query)) matches = matches.filter((item) => ["Graphics Cards", "Processors"].includes(item.category));
  else if (/gaming|1440p|1080p|build|pc/.test(query)) matches = matches.filter((item) => item.category === "Gaming PCs");

  if (!matches.length) {
    matches = catalog.filter((item) => item.price <= budget);
  }
  return matches.slice(0, 3);
}

function Assistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey! I’m Nexus, your VISIONFORGE tech shopping assistant. Tell me what you’re shopping for, your budget, and how you’ll use it. I’ll match you with products from our current catalogue." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  function sendMessage(value = input) {
    const text = value.trim();
    if (!text || thinking) return;
    setMessages((current) => [...current, { role: "user", text }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      const recommendations = getRecommendations(text);
      const response = recommendations.length
        ? ( /laptop|unreal|blender|creative|creator/i.test(text)
            ? "For creative workloads, start with these catalogue laptops. Check the full specifications and software requirements before buying."
            : /phone|mobile|smartphone/i.test(text)
              ? "Here’s the phone currently listed in our catalogue that fits your budget."
              : /component|gpu|graphics card|processor|cpu/i.test(text)
                ? "These catalogue components are a useful starting point. Check compatibility with your existing build."
                : "Here are catalogue matches for your request. These are product listings, not a live benchmark or compatibility guarantee.")
        : "I couldn’t find a catalogue item matching that budget and use case yet. Try a higher budget or browse all products.";
      setMessages((current) => [...current, { role: "assistant", text: response, products: recommendations }]);
      setThinking(false);
    }, 450);
  }

  return (
    <main className="nexus-page">
      <div className="nexus-shell">
        <section className="nexus-heading">
          <div>
            <div className="nexus-eyebrow"><span className="nexus-status-dot" /> YOUR PERSONAL TECH SHOPPER</div>
            <h1>Meet <span>Nexus AI.</span></h1>
            <p>Less scrolling. Smarter picks. Find the right tech for your budget.</p>
          </div>
          <div className="nexus-orb" aria-hidden="true"><span>✳</span><i /><b /></div>
        </section>

        <section className="nexus-workspace" aria-label="Nexus AI chat assistant">
          <aside className="nexus-sidebar">
            <div className="nexus-brand"><div className="nexus-avatar">✳</div><div><strong>Nexus AI</strong><span>VISIONFORGE assistant</span></div><span className="nexus-live">LIVE</span></div>
            <div className="nexus-side-label">WHAT I CAN HELP WITH</div>
            <div className="nexus-capability"><span>⌁</span><div><strong>Gaming setups</strong><small>PCs, parts & performance</small></div></div>
            <div className="nexus-capability"><span>▱</span><div><strong>Creator gear</strong><small>Laptops for creative work</small></div></div>
            <div className="nexus-capability"><span>◉</span><div><strong>Budget matching</strong><small>Find picks within your spend</small></div></div>
            <div className="nexus-sidebar-note"><span>✦</span><p>Recommendations are matched from the VISIONFORGE product catalogue.</p></div>
            <Link className="nexus-browse-link" to="/products">Browse all products <span>↗</span></Link>
          </aside>

          <div className="nexus-chat">
            <div className="nexus-chat-top"><div><strong>Shopping assistant</strong><span>Ask about products, budgets, or your next setup</span></div><span className="nexus-secure">⌁ Catalogue connected</span></div>
            <div className="nexus-messages" aria-live="polite">
              {messages.map((message, index) => (
                <div className={`nexus-message-row ${message.role === "user" ? "is-user" : ""}`} key={index}>
                  {message.role === "assistant" && <div className="nexus-message-avatar">✳</div>}
                  <div className="nexus-message-content">
                    <div className="nexus-message-name">{message.role === "user" ? "You" : "Nexus AI"}</div>
                    <div className="nexus-bubble">{message.text}</div>
                    {message.products?.length > 0 && <div className="nexus-recommendations">
                      {message.products.map((product) => <article className="nexus-product" key={product.id}>
                        <div className="nexus-product-image"><img src={product.image} alt="" loading="lazy" /></div>
                        <div className="nexus-product-info"><span>{product.category}</span><strong>{product.name}</strong><b>{money(product.price)}</b><Link to={`/products?q=${encodeURIComponent(product.name)}`}>View product <span>↗</span></Link></div>
                      </article>)}
                    </div>}
                  </div>
                </div>
              ))}
              {thinking && <div className="nexus-message-row"><div className="nexus-message-avatar">✳</div><div className="nexus-message-content"><div className="nexus-message-name">Nexus AI</div><div className="nexus-bubble nexus-thinking"><i /><i /><i /> Finding catalogue matches…</div></div></div>}
            </div>
            {messages.length === 1 && <div className="nexus-prompts"><span>TRY ASKING</span><div>{quickPrompts.map((item) => <button key={item.title} type="button" onClick={() => sendMessage(item.prompt)}><span>{item.icon}</span><b>{item.title}</b><i>↗</i></button>)}</div></div>}
            <form className="nexus-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell Nexus what you need… (e.g. gaming PC under ₹90,000)" aria-label="Message Nexus AI" />
              <button type="submit" disabled={!input.trim() || thinking} aria-label="Send message">↑</button>
            </form>
            <p className="nexus-disclaimer">Nexus uses catalogue matching in this demo. Verify specifications, stock and compatibility before purchase.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Assistant;
