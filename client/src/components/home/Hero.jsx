import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero hero-with-visual">
      <div className="hero-content">
        <p className="hero-label">NEXT-GEN TECHNOLOGY MARKETPLACE</p>

        <h1>
          Build.
          <span> Power.</span>
          <br />
          Create.
        </h1>

        <p className="hero-description">
          Discover gaming PCs, powerful components, laptops, mobiles,
          and accessories built for your technology needs.
        </p>

        <div className="hero-buttons">
          <Link to="/products" className="hero-primary-btn">
            Explore Products
          </Link>

          <Link to="/builder" className="hero-secondary-btn">
            Build Your PC
          </Link>
        </div>

        <div className="vf-hero-proof">
          <span className="vf-proof-dot" />
          PERFORMANCE MEETS DESIGN
        </div>
      </div>

      <div className="vf-hero-art" aria-label="Purple RGB gaming PC illustration">
        <div className="vf-art-orb vf-art-orb-one" />
        <div className="vf-art-orb vf-art-orb-two" />
        <div className="vf-art-grid" />

        <div className="vf-art-heading">
          <span>ENGINEERED FOR MORE</span>
          <span className="vf-art-line" />
        </div>

        <div className="vf-pc-stage">
          <div className="vf-pc-shadow" />

          <div className="vf-pc-tower">
            <div className="vf-pc-top" />

            <div className="vf-pc-glass">
              <div className="vf-pc-motherboard">
                <span className="vf-pc-board-line" />
                <span className="vf-pc-board-chip" />
                <span className="vf-pc-board-detail" />
              </div>

              <div className="vf-pc-ram vf-pc-ram-one" />
              <div className="vf-pc-ram vf-pc-ram-two" />

              <div className="vf-pc-gpu">
                <span>VF</span>
                <i />
              </div>

              <div className="vf-pc-cable vf-pc-cable-one" />
              <div className="vf-pc-cable vf-pc-cable-two" />

              <div className="vf-pc-fan vf-pc-fan-one">
                <span />
              </div>
              <div className="vf-pc-fan vf-pc-fan-two">
                <span />
              </div>
              <div className="vf-pc-fan vf-pc-fan-three">
                <span />
              </div>
            </div>

            <div className="vf-pc-front">
              <span className="vf-front-port" />
              <div className="vf-front-fan vf-front-fan-one"><span /></div>
              <div className="vf-front-fan vf-front-fan-two"><span /></div>
              <div className="vf-front-fan vf-front-fan-three"><span /></div>
              <span className="vf-front-brand">VISIONFORGE</span>
            </div>

            <div className="vf-pc-foot vf-pc-foot-one" />
            <div className="vf-pc-foot vf-pc-foot-two" />
          </div>

          <div className="vf-art-floating-tag vf-tag-top">
            <span className="vf-tag-light" />
            RGB / 01
          </div>

          <div className="vf-art-floating-tag vf-tag-bottom">
            <span>BUILT TO PERFORM</span>
            <strong>∞</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;