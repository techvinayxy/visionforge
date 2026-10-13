
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PURPLE = "#8f82ff";
const DARK = "#171522";

function AnimatedPart({
  children,
  assembled,
  exploded,
  delay = 0,
  duration = 1.1,
}) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const elapsed = clock.elapsedTime - delay;
    const progress = THREE.MathUtils.clamp(elapsed / duration, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);

    ref.current.position.set(
      THREE.MathUtils.lerp(exploded[0], assembled[0], eased),
      THREE.MathUtils.lerp(exploded[1], assembled[1], eased),
      THREE.MathUtils.lerp(exploded[2], assembled[2], eased)
    );

    ref.current.rotation.y = THREE.MathUtils.lerp(-0.12, 0, eased);
  });

  return <group ref={ref}>{children}</group>;
}

function Fan({ position, radius = 0.3, spin = true }) {
  const fanRef = useRef();

  useFrame(({ clock }) => {
    if (fanRef.current && spin) {
      fanRef.current.rotation.z = clock.elapsedTime * 0.8;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[radius, radius, 0.08, 24]} />
        <meshStandardMaterial
          color="#25222f"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.88, 0.025, 6, 24]} />
        <meshBasicMaterial color={PURPLE} />
      </mesh>

      <group ref={fanRef}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i * Math.PI * 2) / 5]}
            position={[0, 0, 0.045]}
          >
            <boxGeometry args={[radius * 0.18, radius * 0.68, 0.025]} />
            <meshStandardMaterial color="#7568d7" roughness={0.4} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0, 0.07]}>
        <cylinderGeometry args={[radius * 0.15, radius * 0.15, 0.04, 12]} />
        <meshStandardMaterial
          color="#c5baff"
          emissive={PURPLE}
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

function Motherboard() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.65, 2.25, 0.1]} />
        <meshStandardMaterial
          color="#17352f"
          metalness={0.55}
          roughness={0.48}
        />
      </mesh>

      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            -0.55 + (i % 4) * 0.36,
            -0.68 + Math.floor(i / 4) * 0.45,
            0.075,
          ]}
        >
          <boxGeometry args={[0.2, 0.17, 0.035]} />
          <meshStandardMaterial
            color={i % 2 ? "#39334e" : "#42514b"}
            metalness={0.55}
          />
        </mesh>
      ))}

      <mesh position={[0, 0.4, 0.1]}>
        <boxGeometry args={[0.62, 0.62, 0.12]} />
        <meshStandardMaterial
          color="#262332"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 0.4, 0.17]}>
        <boxGeometry args={[0.43, 0.43, 0.025]} />
        <meshStandardMaterial
          color="#15121f"
          emissive={PURPLE}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function GraphicsCard() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.95, 0.48, 0.4]} />
        <meshStandardMaterial
          color="#282532"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0, 0.21]}>
        <boxGeometry args={[1.72, 0.3, 0.025]} />
        <meshStandardMaterial
          color="#100e18"
          emissive={PURPLE}
          emissiveIntensity={0.35}
        />
      </mesh>

      <Fan position={[-0.48, 0, 0.23]} radius={0.14} />
      <Fan position={[0.48, 0, 0.23]} radius={0.14} />
    </group>
  );
}

function PCScene() {
  const towerRef = useRef();

  useFrame(({ clock }) => {
    if (!towerRef.current) return;

    const elapsed = clock.elapsedTime;
    const assemblyComplete = THREE.MathUtils.clamp((elapsed - 5.5) / 1.5, 0, 1);

    // A restrained product-style turn after assembly.
    towerRef.current.rotation.y =
      THREE.MathUtils.lerp(-0.08, 0.12, assemblyComplete) +
      Math.sin(elapsed * 0.22) * 0.035 * assemblyComplete;
  });

  return (
    <>
      <color attach="background" args={["#0d0b14"]} />

      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 6]} intensity={2} />
      <pointLight position={[-3, 1, 3]} color={PURPLE} intensity={18} />
      <pointLight position={[3, -1, -2]} color="#4d42ff" intensity={8} />

      <group ref={towerRef} position={[0, 0, 0]}>
        {/* Minimal case frame */}
        <mesh position={[0, 0, -0.35]}>
          <boxGeometry args={[2.65, 3.65, 0.12]} />
          <meshStandardMaterial
            color="#393344"
            metalness={0.85}
            roughness={0.28}
            wireframe
          />
        </mesh>

        {/* Motherboard: assembles first */}
        <AnimatedPart
          assembled={[0, 0, 0]}
          exploded={[-1.4, 0.35, 0.7]}
          delay={0.3}
          duration={1.1}
        >
          <Motherboard />
        </AnimatedPart>

        {/* RAM follows the motherboard */}
        {[0, 1].map((i) => (
          <AnimatedPart
            key={`ram-${i}`}
            assembled={[-0.48 + i * 0.3, 0.68, 0.2]}
            exploded={[-1.6 + i * 0.3, 1.6, 0.9]}
            delay={1.15 + i * 0.2}
            duration={0.85}
          >
            <mesh>
              <boxGeometry args={[0.12, 0.82, 0.1]} />
              <meshStandardMaterial
                color="#282536"
                emissive={PURPLE}
                emissiveIntensity={0.8}
                metalness={0.65}
              />
            </mesh>
          </AnimatedPart>
        ))}

        {/* GPU */}
        <AnimatedPart
          assembled={[0, -0.65, 0.46]}
          exploded={[1.6, -0.4, 1.2]}
          delay={1.8}
          duration={1.2}
        >
          <GraphicsCard />
        </AnimatedPart>

        {/* Cooling fans */}
        {[0, 1, 2].map((i) => (
          <AnimatedPart
            key={`fan-${i}`}
            assembled={[0.83, 1.05 - i * 0.88, 0.1]}
            exploded={[1.8, 1.6 - i * 0.8, 0.9]}
            delay={2.5 + i * 0.18}
            duration={0.85}
          >
            <Fan position={[0, 0, 0]} radius={0.27} />
          </AnimatedPart>
        ))}

        {/* Power supply */}
        <AnimatedPart
          assembled={[0, -1.55, -0.05]}
          exploded={[-1.5, -1.8, 0.8]}
          delay={3.2}
          duration={1}
        >
          <mesh>
            <boxGeometry args={[1.35, 0.4, 0.7]} />
            <meshStandardMaterial
              color="#34303f"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </AnimatedPart>
      </group>
    </>
  );
}

export default function PCAssemblyScene() {
  return (
    <div className="vf-pc-scene">
      <Canvas
        camera={{ position: [4.5, 2.2, 7], fov: 38 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <PCScene />
        </Suspense>
      </Canvas>

      <div className="vf-scene-label">
        <span className="vf-scene-indicator" />
        <span>ENGINEERING YOUR NEXT BUILD</span>
      </div>
    </div>
  );
}
