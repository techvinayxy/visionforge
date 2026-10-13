
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
        {/* Gaming PC image: enlarged by 20% */}
        <div className="vf-pc-image-area">
          <img
            src="/gaming-pc.png"
            alt="VISIONFORGE RGB gaming PC"
            className="vf-gaming-pc-model"
          />
        </div>

        {/* Animated CPU on the right */}
        <div className="vf-cpu-animation" aria-label="Animated RGB processor">
          <div className="vf-cpu-orbit vf-cpu-orbit-one" />
          <div className="vf-cpu-orbit vf-cpu-orbit-two" />

          <div className="vf-cpu-chip">
            <div className="vf-cpu-pins vf-cpu-pins-top" />
            <div className="vf-cpu-pins vf-cpu-pins-bottom" />
            <div className="vf-cpu-pins vf-cpu-pins-left" />
            <div className="vf-cpu-pins vf-cpu-pins-right" />

            <div className="vf-cpu-chip-inner">
              <span className="vf-cpu-brand">VF</span>
              <strong>CPU</strong>
              {/* <span className="vf-cpu-chip-caption">
                HIGH PERFORMANCE
              </span> */}
            </div>
          </div>

          {/* <span className="vf-cpu-label">PROCESSING POWER</span> */}
          {/* <span className="vf-cpu-status">
            <i />
            SYSTEM ACTIVE
          </span> */}
        </div>
      </div>

      <div className="vf-scroll-spec vf-scroll-spec-top">
        {/* <span className="vf-scroll-spec-dot" /> */}
        {/* PERFORMANCE / {String(active + 1).padStart(2, "0")} */}
      </div>

      <div className="vf-scroll-spec vf-scroll-spec-bottom">
        {/* <span>BUILD. POWER. CREATE.</span> */}
        {/* <strong>VF.</strong> */}
      </div>
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
