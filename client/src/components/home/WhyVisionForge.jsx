function WhyVisionForge() {
  const benefits = [
    {
      icon: "⚡",
      title: "Powerful Technology",
      description:
        "Discover performance-focused products built for gaming, work, and creativity.",
    },
    {
      icon: "🛡️",
      title: "Trusted Sellers",
      description:
        "Shop from verified sellers offering genuine technology products.",
    },
    {
      icon: "🔧",
      title: "Build Your PC",
      description:
        "Create your custom PC and check component compatibility before buying.",
    },
    {
      icon: "🤖",
      title: "AI Tech Assistant",
      description:
        "Get intelligent product recommendations based on your requirements and budget.",
    },
  ];

  return (
    <section className="why-section">
      <div className="section-container">

        <div className="section-heading">
          <p>WHY VISIONFORGE</p>
          <h2>Technology Built Around You</h2>
        </div>

        <div className="why-grid">
          {benefits.map((benefit) => (
            <div className="why-card" key={benefit.title}>

              <div className="why-icon">
                {benefit.icon}
              </div>

              <h3>{benefit.title}</h3>

              <p>{benefit.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyVisionForge;