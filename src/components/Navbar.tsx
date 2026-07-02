import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Plane, User, Briefcase, Sun, Moon } from "lucide-react";
import { gsap } from "gsap";

interface NavbarProps {
  currentView: string;
  onViewChange: (view: "home" | "booking" | "dashboard") => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  timeOfDay: "morning" | "noon" | "night";
  onTimeOfDayChange: (time: "morning" | "noon" | "night") => void;
}

export default function Navbar({ currentView, onViewChange, isDarkMode, onToggleDarkMode, timeOfDay, onTimeOfDayChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const logoRef = useRef<HTMLDivElement | null>(null);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);

  const navLinks = [
    { label: "Start", target: "hero", view: "home" as const },
    { label: "Story", target: "story", view: "home" as const },
    { label: "Rates", target: "rates", view: "home" as const },
    { label: "Benefits", target: "benefits", view: "home" as const },
    { label: "FAQ", target: "faq", view: "home" as const },
    { label: "Book Now", target: "", view: "booking" as const },
    { label: "Dashboard", target: "", view: "dashboard" as const },
  ];

  // Dynamic Scroll Observer for landing page sections
  useEffect(() => {
    if (currentView !== "home") return;

    const sections = ["hero", "story", "rates", "benefits", "faq"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.25, rootMargin: "-10% 0px -50% 0px" }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [currentView]);

  // GSAP Pill Hover Animation Engine
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;

        // Calculate the exact radius to cover the rounded pill
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const hoverLabel = pill.querySelector<HTMLElement>(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, {
          scale: 1.2,
          xPercent: -50,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto"
        }, 0);

        if (label) {
          tl.to(label, {
            y: -(h + 8),
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto"
          }, 0);
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 16), opacity: 0 });
          tl.to(hoverLabel, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto"
          }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener("resize", onResize);
  }, [currentView, isDarkMode]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto"
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.25,
      ease: "power3.out",
      overwrite: "auto"
    });
  };

  const handleLogoEnter = () => {
    if (!logoRef.current) return;
    gsap.killTweensOf(logoRef.current);
    gsap.to(logoRef.current, {
      rotation: 360,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      onComplete: () => {
        gsap.set(logoRef.current, { rotation: 0 });
      }
    });
  };

  const handleLinkClick = (targetId: string, view: "home" | "booking" | "dashboard") => {
    setIsMobileMenuOpen(false);
    onViewChange(view);

    if (view === "home" && targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Determine luxury brand colors based on light/dark mode
  const baseColor = isDarkMode ? "#121824" : "#202A36";
  const pillColor = isDarkMode ? "#1F293D" : "#FFFFFF";
  const pillTextColor = isDarkMode ? "#94A3B8" : "#202A36";
  const hoveredPillTextColor = "#FFFFFF";

  const cssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": pillTextColor,
    "--pill-pad-x": "16px",
    "--pill-gap": "6px",
  } as React.CSSProperties;

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0B1220]/70 backdrop-blur-md border-b border-gray-100 dark:border-white/5 transition-colors duration-300"
      style={cssVars}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Rotating Plane Container */}
          <div
            onClick={() => handleLinkClick("hero", "home")}
            onMouseEnter={handleLogoEnter}
            className="flex items-center space-x-3 cursor-pointer group"
            id="brand-logo"
          >
            <div
              ref={logoRef}
              className="w-10 h-10 rounded-full bg-[#202A36] dark:bg-white/10 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
            >
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <span className="text-xl font-bold text-[#081C3A] dark:text-white tracking-tight font-display transition-colors">
              SkyElite
            </span>
          </div>

          {/* Desktop Navigation - PillNav Center Strip */}
          <div
            className="hidden md:flex items-center rounded-full px-2 py-1.5 shadow-sm border border-gray-150/50 dark:border-white/5 transition-colors"
            style={{
              background: "var(--base)",
            }}
          >
            <ul
              role="menubar"
              className="list-none flex items-center m-0 p-0"
              style={{ gap: "var(--pill-gap)" }}
            >
              {navLinks.map((link, i) => {
                const isActive =
                  (currentView === "booking" && link.view === "booking") ||
                  (currentView === "dashboard" && link.view === "dashboard") ||
                  (currentView === "home" && link.view === "home" && link.target === activeSection);

                const PillContent = (
                  <>
                    {/* Circle that expands to fill the pill */}
                    <span
                      className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                      style={{
                        background: "var(--base)",
                        willChange: "transform",
                      }}
                      aria-hidden="true"
                      ref={(el) => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    
                    {/* Label stack for fluid transitions */}
                    <span className="label-stack relative inline-block leading-none z-[2] overflow-hidden py-1">
                      <span
                        className="pill-label relative z-[2] inline-block font-sans font-bold text-[11px] uppercase tracking-wider transition-all"
                        style={{ willChange: "transform" }}
                      >
                        {link.label}
                      </span>
                      <span
                        className="pill-label-hover absolute left-0 top-1.5 z-[3] inline-block w-full text-center font-sans font-bold text-[11px] uppercase tracking-wider transition-all"
                        style={{
                          color: "var(--hover-text)",
                          willChange: "transform, opacity",
                        }}
                        aria-hidden="true"
                      >
                        {link.label}
                      </span>
                    </span>

                    {/* Active route dot */}
                    {isActive && (
                      <span
                        className="absolute left-1/2 bottom-1.5 -translate-x-1/2 w-1 h-1 rounded-full z-[4]"
                        style={{ background: "var(--base)" }}
                        aria-hidden="true"
                      />
                    )}
                  </>
                );

                const basePillClasses = "relative overflow-hidden inline-flex items-center justify-center h-8.5 self-center no-underline rounded-full box-border font-medium text-xs uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:z-10";

                return (
                  <li key={link.label} role="none" className="flex items-center">
                    <button
                      role="menuitem"
                      onClick={() => handleLinkClick(link.target, link.view)}
                      className={basePillClasses}
                      style={{
                        background: "var(--pill-bg)",
                        color: "var(--pill-text)",
                        paddingLeft: "var(--pill-pad-x)",
                        paddingRight: "var(--pill-pad-x)",
                      }}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {PillContent}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Theme & Time Quick Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Elegant glassmorphism time selector */}
            <div className="flex items-center space-x-1 bg-gray-100/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-full p-1 shadow-sm backdrop-blur-md">
              {(["morning", "noon", "night"] as const).map((mode) => {
                const isSelected = timeOfDay === mode;
                const label = mode === "morning" ? "🌅 Morning" : mode === "noon" ? "☀️ Noon" : "🌙 Night";
                return (
                  <button
                    key={mode}
                    onClick={() => onTimeOfDayChange(mode)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-[#202A36] dark:bg-white/15 text-white shadow-sm scale-102"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onToggleDarkMode}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>

          {/* Mobile Hamburguer & Controls */}
          <div className="md:hidden flex items-center space-x-3">
            <div className="flex bg-gray-100/80 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 p-1 rounded-full backdrop-blur-md">
              {(["morning", "noon", "night"] as const).map((mode) => {
                const isSelected = timeOfDay === mode;
                const emoji = mode === "morning" ? "🌅" : mode === "noon" ? "☀️" : "🌙";
                return (
                  <button
                    key={mode}
                    onClick={() => onTimeOfDayChange(mode)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                      isSelected ? "bg-[#202A36] dark:bg-white/15 shadow-sm scale-105" : "opacity-60"
                    }`}
                    title={mode}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onToggleDarkMode}
              className="p-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-full focus:outline-none cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none cursor-pointer"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 p-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.target, link.view)}
                className="text-left py-2.5 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                id={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
