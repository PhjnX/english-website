import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface InfiniteScrollProps {
  items: { content: string }[];
  direction?: "left" | "right";
  speed?: number;
  style?: React.CSSProperties;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  items,
  direction = "left",
  speed = 1,
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const distance = container.scrollWidth / 2;

      timeline.current = gsap.timeline({ repeat: -1 });

      timeline.current.to(container, {
        x: direction === "left" ? `-=${distance}` : `+=${distance}`,
        ease: "none",
        duration: distance / (speed * 50),
      });
    });

    return () => ctx.revert();
  }, [items, direction, speed]);

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={containerRef}
        className="flex whitespace-nowrap gap-8 px-4"
        style={{ ...style }}
      >
        {[...items, ...items].map((item, index) => (
          <div key={index} className="shrink-0 text-nowrap text-[#d84315]">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroll;
