import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/router";
import { CATEGORIES } from "./categoryConfig";

const CANVAS_SIZE = 600;
const PARTICLE_COUNT = 120;

const SORT_DURATION = 1050;
const NAVIGATION_DELAY = 1550;
const VORTEX_CATEGORIES = [...CATEGORIES, ...CATEGORIES];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const lerp = (start, end, amount) => start + (end - start) * amount;

const easeInOutCubic = (t) => {
  if (t < 0.5) {
    return 4 * t * t * t;
  }

  return 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function AnimationVortex() {
  const router = useRouter();

  const canvasRef = useRef(null);
  const iconRefs = useRef([]);

  const animationFrameRef = useRef(null);
  const navigationTimeoutRef = useRef(null);

  const [isSorting, setIsSorting] = useState(false);
  const isSortingRef = useRef(false);
  const sortStartRef = useRef(0);

  const categoryNodesRef = useRef([]);
  useEffect(() => {
    categoryNodesRef.current = VORTEX_CATEGORIES.map((category, index) => {
      const targetAngle =
        -Math.PI / 2 + (Math.PI * 2 * index) / CATEGORIES.length;

      return {
        category,

        angle: targetAngle + (Math.random() - 0.5) * Math.PI * 2,

        radius: 100 + Math.random() * 150,

        targetRadius: 210,

        speed:
          (Math.random() > 0.5 ? 1 : -1) * (0.0015 + Math.random() * 0.003),

        wobble: Math.random() * Math.PI * 2,

        wobbleSpeed: 0.008 + Math.random() * 0.012,

        scale: 0.7 + Math.random() * 0.2,
      };
    });
  }, []);

  const particlesRef = useRef([]);
  useEffect(() => {
    particlesRef.current = Array.from(
      {
        length: PARTICLE_COUNT,
      },
      (_, index) => {
        const category = CATEGORIES[index % CATEGORIES.length];

        return {
          category,

          angle: Math.random() * Math.PI * 2,

          radius: 55 + Math.random() * 245,

          speed:
            (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.009),

          size: 1.2 + Math.random() * 2.4,

          alpha: 0.25 + Math.random() * 0.55,

          wobble: Math.random() * Math.PI * 2,

          wobbleSpeed: 0.008 + Math.random() * 0.018,

          phase: Math.random() * Math.PI * 2,
        };
      },
    );
  }, []);

  const getTargetAngle = (index) => {
    return -Math.PI / 2 + (Math.PI * 2 * index) / VORTEX_CATEGORIES.length;
  };

  const handleActivate = () => {
    if (isSortingRef.current) {
      return;
    }

    isSortingRef.current = true;
    setIsSorting(true);
    sortStartRef.current = performance.now();

    navigationTimeoutRef.current = setTimeout(() => {
      router.push("/entries");
    }, NAVIGATION_DELAY);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      handleActivate();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;

    canvas.width = CANVAS_SIZE * dpr;

    canvas.height = CANVAS_SIZE * dpr;

    canvas.style.width = `${CANVAS_SIZE}px`;

    canvas.style.height = `${CANVAS_SIZE}px`;

    context.scale(dpr, dpr);

    const center = CANVAS_SIZE / 2;

    const render = (time) => {
      context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      let sortProgress = 0;

      if (isSortingRef.current) {
        sortProgress = clamp(
          (time - sortStartRef.current) / SORT_DURATION,
          0,
          1,
        );
      }

      const sortEase = easeInOutCubic(sortProgress);

      const vortexRotation = isSortingRef.current
        ? easeOutCubic(sortProgress) * Math.PI * 2
        : 0;

      const backgroundGlow = context.createRadialGradient(
        center,
        center,
        10,
        center,
        center,
        310,
      );

      backgroundGlow.addColorStop(0, "rgba(96, 165, 250, 0.15)");

      backgroundGlow.addColorStop(0.35, "rgba(59, 130, 246, 0.07)");

      backgroundGlow.addColorStop(0.7, "rgba(37, 99, 235, 0.025)");

      backgroundGlow.addColorStop(1, "rgba(37, 99, 235, 0)");

      context.fillStyle = backgroundGlow;

      context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      particlesRef.current.forEach((particle) => {
        const categoryIndex = CATEGORIES.findIndex(
          (category) => category.id === particle.category.id,
        );

        const targetAngle = getTargetAngle(categoryIndex);

        if (isSortingRef.current) {
          const angleDifference = Math.atan2(
            Math.sin(targetAngle - particle.angle),
            Math.cos(targetAngle - particle.angle),
          );

          particle.angle += angleDifference * sortEase * 0.035;

          const targetRadius = 110 + (particle.radius % 80);

          particle.radius = lerp(
            particle.radius,
            targetRadius,
            sortEase * 0.035,
          );
        }

        const wobble =
          Math.sin(particle.wobble + particle.phase) *
          (isSortingRef.current ? lerp(5, 0, sortEase) : 9);

        const radius = particle.radius + wobble;

        const angle = particle.angle + vortexRotation;

        const x = center + Math.cos(angle) * radius;

        const y = center + Math.sin(angle) * radius;

        const glowRadius = particle.size * 5;

        const glow = context.createRadialGradient(x, y, 0, x, y, glowRadius);

        glow.addColorStop(0, `${particle.category.color}99`);

        glow.addColorStop(1, `${particle.category.color}00`);

        context.beginPath();

        context.arc(x, y, glowRadius, 0, Math.PI * 2);

        context.fillStyle = glow;

        context.fill();

        context.beginPath();

        context.arc(x, y, particle.size, 0, Math.PI * 2);

        context.globalAlpha = particle.alpha;

        context.fillStyle = particle.category.color;

        context.fill();

        context.globalAlpha = 1;
      });

      const centerPulse = 1 + Math.sin(time * 0.002) * 0.035;

      const centerRadius = 80 * centerPulse;

      const centerGlow = context.createRadialGradient(
        center,
        center,
        0,
        center,
        center,
        centerRadius,
      );

      centerGlow.addColorStop(0, "rgba(255,255,255,0.22)");

      centerGlow.addColorStop(0.2, "rgba(147,197,253,0.15)");

      centerGlow.addColorStop(0.55, "rgba(59,130,246,0.08)");

      centerGlow.addColorStop(1, "rgba(59,130,246,0)");

      context.beginPath();

      context.arc(center, center, centerRadius, 0, Math.PI * 2);

      context.fillStyle = centerGlow;

      context.fill();

      [45, 75, 110].forEach((radius, index) => {
        context.beginPath();

        context.arc(center, center, radius, 0, Math.PI * 2);

        context.strokeStyle = `rgba(147,197,253,${0.09 - index * 0.02})`;

        context.lineWidth = 1;

        context.stroke();
      });

      categoryNodesRef.current.forEach((node, index) => {
        const targetAngle = getTargetAngle(index);

        if (isSortingRef.current) {
          const angleDifference = Math.atan2(
            Math.sin(targetAngle - node.angle),
            Math.cos(targetAngle - node.angle),
          );

          node.angle += angleDifference * sortEase * 0.065;

          node.radius = lerp(node.radius, node.targetRadius, sortEase * 0.065);

          node.scale = lerp(node.scale, 1, sortEase * 0.06);
        }

        const wobble =
          Math.sin(node.wobble + time * 0.001) *
          (isSortingRef.current ? lerp(2, 0, sortEase) : 8);

        const radius = node.radius + wobble;

        const angle = node.angle + vortexRotation;

        const x = center + Math.cos(angle) * radius;

        const y = center + Math.sin(angle) * radius;

        const icon = iconRefs.current[index];

        if (!icon) {
          return;
        }

        let impactScale = 1;

        if (isSortingRef.current && sortProgress > 0.8) {
          const impactProgress = clamp((sortProgress - 0.8) / 0.2, 0, 1);

          const impactEase = easeOutCubic(impactProgress);

          impactScale = 1 + Math.sin(impactEase * Math.PI) * 0.18;
        }

        const finalScale = node.scale * impactScale;

        icon.style.transform = `
            translate3d(
              ${x}px,
              ${y}px,
              0
            )
            translate(-50%, -50%)
            scale(${finalScale})
            rotate(${angle * 8}rad)
          `;

        if (isSortingRef.current && sortProgress > 0.8) {
          icon.style.boxShadow = `
                0 0 35px
                ${node.category.color}66
              `;
        } else {
          icon.style.boxShadow = `
                0 0 24px
                ${node.category.color}33
              `;
        }
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Vortex öffnen"
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      whileHover={{
        scale: 1.025,
      }}
      whileTap={{
        scale: 0.985,
      }}
      animate={
        isSorting
          ? {
              scale: [1, 1.025, 1.09, 1],
            }
          : {
              scale: 1,
            }
      }
      transition={{
        duration: isSorting ? 1.35 : 0.2,
        ease: "easeInOut",
      }}
      className="
        relative
        mx-auto
        aspect-square
        w-full
        max-w-[600px]
        cursor-pointer
        select-none
        outline-none
      "
    >
      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          h-full
          w-full
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        {VORTEX_CATEGORIES.map((category, index) => {
          const Icon = category.icon;

          return (
            <div
              key={`${category.id}-${index}`}
              ref={(element) => {
                iconRefs.current[index] = element;
              }}
              className="
                  absolute
                  left-0
                  top-0
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-black/10
                  backdrop-blur-md
                  will-change-transform
                "
              style={{
                color: category.color,
                boxShadow: `
                    0 0 24px
                    ${category.color}33
                  `,
              }}
            >
              <Icon size={27} strokeWidth={1.8} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
