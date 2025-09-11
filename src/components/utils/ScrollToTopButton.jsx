import React, { useEffect, useState } from "react";

export default function ScrollToTopButton({
  right = "1.2rem",
  bottom = "1.2rem",
  size = 40,
  color = "#4f46e5",
  showAfter = 300,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > showAfter);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Voltar ao topo"
      style={{
        position: "fixed",
        right,
        bottom,
        zIndex: 2500,
        background: `linear-gradient(135deg, ${color} 60%, #2563eb 100%)`,
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        boxShadow: "0 8px 24px rgba(79,70,229,0.22)",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
        borderWidth: "2px",
        borderColor: "#fff",
        borderStyle: "solid",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 48 48"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="12 30 24 18 36 30" />
      </svg>
      <style>{`
        @keyframes topBtnFadeIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 0.93; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
          40% { transform: translateY(-18px); }
          50% { transform: translateY(-12px); }
          60% { transform: translateY(-6px); }
          80% { transform: translateY(0); }
        }
      `}</style>
    </button>
  );
}
