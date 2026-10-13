import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    eyebrow: "THE FOUNDATION",
    title: "Built for power.",
    description:
      "Discover powerful processors and motherboards designed for your next build.",
    tag: "CORE COMPONENTS",
  },
  {
    number: "02",
    eyebrow: "GRAPHICS REDEFINED",
    title: "See every detail.",
    description:
      "Explore graphics cards made for immersive gaming and creative performance.",
    tag: "GRAPHICS & GPU",
  },
  {
    number: "03",
    eyebrow: "YOUR BUILD. YOUR RULES.",
    title: "Make it yours.",
    description:
      "Choose your components and create a custom setup that matches your ambition.",
    tag: "CUSTOM PC BUILDER",
  },
];

function PCVisual({ active }) {
  return (
    <div className={`vf-scroll-art vf-scroll-art-${active + 1}`}>
      <div className="vf-scroll-glow" />
      <div className="vf-scroll-ring vf-scroll-ring-one" />
      <div className="vf-scroll-ring vf-scroll-ring-two" />

      <div className="vf-scroll-visual-layout">
        <div
          className="vf-premium-setup"
          aria-label="VISIONFORGE premium gaming setup"
        >
          <div className="vf-setup-image-glow" />

          <img
  src="/Images/gaming-setup.png.png"
  alt="VISIONFORGE premium RGB gaming setup"
  className="vf-premium-setup-image"
  loading="eager"
/>

          <div className="vf-setup-overlay">
            <span className="vf-setup-brand">VISIONFORGE</span>
            <span className="vf-setup-tagline">
              BUILD. POWER. CREATE.
            </span>
          </div>
        </div>
      </div>

      <div className="vf-scroll-spec vf-scroll-spec-top">
        <span className="vf-scroll-spec-dot" />
      </div>

      <div className="vf-scroll-spec vf-scroll-spec-bottom" />
    </div>
  );
}

export default function PCScrollExperience() {
  const stepRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const steps = stepRefs.current.filter(Boolean);

    if (!steps.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSteps = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSteps.length > 0) {
          setActive(
            Number(visibleSteps[0].target.dataset.step)
          );
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    steps.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="vf-scroll-section">
      <div className="vf-scroll-intro">
        <span className="vf-scroll-kicker">
          THE VISIONFORGE EXPERIENCE
        </span>

        <h2>
          Power your <span>next move.</span>
        </h2>

        <p>
          Every component matters. Scroll to explore what goes
          into a build made for you.
        </p>
      </div>

      <div className="vf-scroll-layout">
        <div className="vf-scroll-steps">
          {features.map((feature, index) => (
            <article
              className={`vf-scroll-step ${
                active === index ? "is-active" : ""
              }`}
              data-step={index}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
              key={feature.number}
            >
              <span className="vf-scroll-number">
                {feature.number}
              </span>

              <span className="vf-scroll-eyebrow">
                {feature.eyebrow}
              </span>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <span className="vf-scroll-tag">
                {feature.tag}
              </span>

              {index === 2 && (
                <Link
                  to="/builder"
                  className="vf-scroll-builder-link"
                >
                  Build Your PC
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </article>
          ))}
        </div>

        <div className="vf-scroll-sticky">
          <PCVisual active={active} />
        </div>
      </div>
    </section>
  );
}
