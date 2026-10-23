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
  if (budget < 1000 && /lakh|lac|l\\b/.test(query)) budget *= 100000;
  else if (budget < 1000 && /k\\b/.test(query)) budget *= 1000;
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
    { role: "assistant", text: "Hey, I’m MJ — your VISIONFORGE tech companion. Tell me what you want to build, your budget, or the gear you’re looking for. I’ll help you explore matching products from our catalogue." },
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
    <main className="mj-page">
      <div className="mj-shell">
        <section className="mj-heading">
          <div>
            <div className="mj-eyebrow"><span className="mj-status-dot" /> VISIONFORGE INTELLIGENCE</div>
            <h1>Meet <span>MJ.</span></h1>
            <p>Your next build starts here. Smarter hardware picks, without the noise.</p>
          </div>
          <div className="mj-orb" aria-hidden="true"><span>✳</span><i /><b /></div>
        </section>

        <section className="mj-workspace" aria-label="MJ chat assistant">
          <aside className="mj-sidebar">
            <div className="mj-brand"><div className="mj-avatar">✳</div><div><strong>MJ</strong><span>VISIONFORGE assistant</span></div><span className="mj-live">LIVE</span></div>
            <div className="mj-side-label">YOUR TECH, REIMAGINED</div>
            <div className="mj-capability"><span>⌁</span><div><strong>Gaming setups</strong><small>PCs, parts & performance</small></div></div>
            <div className="mj-capability"><span>▱</span><div><strong>Creator gear</strong><small>Laptops for creative work</small></div></div>
            <div className="mj-capability"><span>◉</span><div><strong>Budget matching</strong><small>Find picks within your spend</small></div></div>
            <div className="mj-sidebar-note"><span>✦</span><p>Recommendations are matched from the VISIONFORGE product catalogue.</p></div>
            <Link className="mj-browse-link" to="/products">Browse all products <span>↗</span></Link>
          </aside>

          <div className="mj-chat">
            <div className="mj-chat-top"><div><strong>MJ · TECH INTELLIGENCE</strong><span>Ask about products, budgets, or your next setup</span></div><span className="mj-secure">⌁ Catalogue connected</span></div>
            <div className="mj-messages" aria-live="polite">
              {messages.map((message, index) => (
                <div className={`mj-message-row ${message.role === "user" ? "is-user" : ""}`} key={index}>
                  {message.role === "assistant" && <div className="mj-message-avatar">✳</div>}
                  <div className="mj-message-content">
                    <div className="mj-message-name">{message.role === "user" ? "You" : "MJ"}</div>
                    <div className="mj-bubble">{message.text}</div>
                    {message.products?.length > 0 && <div className="mj-recommendations">
                      {message.products.map((product) => <article className="mj-product" key={product.id}>
                        <div className="mj-product-image"><img src={product.image} alt="" loading="lazy" /></div>
                        <div className="mj-product-info"><span>{product.category}</span><strong>{product.name}</strong><b>{money(product.price)}</b><Link to={`/products?q=${encodeURIComponent(product.name)}`}>View product <span>↗</span></Link></div>
                      </article>)}
                    </div>}
                  </div>
                </div>
              ))}
              {thinking && <div className="mj-message-row"><div className="mj-message-avatar">✳</div><div className="mj-message-content"><div className="mj-message-name">MJ</div><div className="mj-bubble mj-thinking"><i /><i /><i /> Finding catalogue matches…</div></div></div>}
            </div>
            {messages.length === 1 && <div className="mj-prompts"><span>TRY ASKING</span><div>{quickPrompts.map((item) => <button key={item.title} type="button" onClick={() => sendMessage(item.prompt)}><span>{item.icon}</span><b>{item.title}</b><i>↗</i></button>)}</div></div>}
            <form className="mj-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask MJ anything about your next build…" aria-label="Message MJ" />
              <button type="submit" disabled={!input.trim() || thinking} aria-label="Send message">↑</button>
            </form>
            <p className="mj-disclaimer">MJ matches products from the current catalogue. Verify specifications, stock and compatibility before purchase.</p>
          </div>
          <aside className="mj-insights" aria-label="MJ tech insights">
            <div className="mj-insights-title"><span>⌁</span> MJ INTELLIGENCE</div>
            <div className="mj-insight-card">
              <div className="mj-insight-kicker">01 / DISCOVER</div>
              <strong>Find your next upgrade</strong>
              <p>Tell MJ your favourite games, creative apps, or everyday needs.</p>
              <div className="mj-insight-line"><span /></div>
            </div>
            <div className="mj-insight-card">
              <div className="mj-insight-kicker">02 / OPTIMISE</div>
              <strong>Make the budget count</strong>
              <p>Explore catalogue options that fit your spending range.</p>
            </div>
            <div className="mj-insight-card">
              <div className="mj-insight-kicker">03 / BUILD</div>
              <strong>Think compatibility first</strong>
              <p>Before buying, verify socket, power, size, and other requirements.</p>
            </div>
            <p className="mj-insight-foot">Designed for curious minds and serious builds.<br />BUILD. POWER. CREATE.</p>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default Assistant;
