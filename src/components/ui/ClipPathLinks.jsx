import React from "react";
import { SiGmail, SiLeetcode, SiSalesforce, SiWhatsapp } from "react-icons/si";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useAnimate } from "framer-motion";

export const ClipPathLinks = () => {
  return (
    <div className="divide-y border divide-[color:var(--line)] border-[color:var(--line)] mt-12 overflow-hidden rounded-xl bg-[color:var(--black)]/20 backdrop-blur-sm">
      <div className="grid grid-cols-2 divide-x divide-[color:var(--line)]">
        <LinkBox Icon={SiGmail} href="mailto:krohithpavan@gmail.com" label="Email Me" />
        <LinkBox Icon={FaLinkedin} href="https://www.linkedin.com/in/rohith-pavan/" label="LinkedIn" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[color:var(--line)]">
        <LinkBox Icon={FaGithub} href="https://github.com/RohithPavan1205" label="GitHub" />
        <LinkBox Icon={SiLeetcode} href="https://leetcode.com/u/RohithPavan12/" label="LeetCode" />
        <LinkBox Icon={SiSalesforce} href="https://www.salesforce.com/trailblazer/rohithpavan" label="Trailhead" />
        <LinkBox Icon={SiWhatsapp} href="https://wa.me/919398392620" label="WhatsApp" />
      </div>
    </div>
  );
};

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const LinkBox = ({ Icon, href, imgSrc, className, label }) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e) => {
    const box = e.currentTarget.getBoundingClientRect();

    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };

    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);

    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side],
    });
  };

  const handleMouseLeave = (e) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side],
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative grid h-24 w-full place-content-center sm:h-28 md:h-36 text-[color:var(--chalk)] bg-transparent overflow-hidden group"
    >
      <div className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:scale-110">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={label}
            className={className ?? "max-h-8 sm:max-h-12 object-contain"}
          />
        ) : (
          <Icon className="text-2xl sm:text-3xl md:text-4xl" />
        )}
        <span className="text-[10px] uppercase tracking-widest opacity-50 font-medium">{label}</span>
      </div>

      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-[color:var(--amber)] text-[color:var(--black)] transition-colors duration-300 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={label}
              className={className ?? "max-h-8 sm:max-h-12 object-contain filter invert"}
            />
          ) : (
            <Icon className="text-2xl sm:text-3xl md:text-4xl" />
          )}
          <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
        </div>
      </div>
    </a>
  );
};
