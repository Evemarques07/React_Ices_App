import React, { useState } from "react";
import CriarEscala from "../components/escalas/CriarEscala";
import ListarEscalas from "../components/escalas/ListarEscalas";

export default function Diacono({ user }) {
  const [modal, setModal] = useState(null);
  const [colEscalas, setColEscalas] = useState(true);

  // Recupera token do usuário logado
  const token =
    (user && user.access_token) ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).access_token
      : "");

  const openModal = (tipo) => setModal(tipo);
  const closeModal = () => setModal(null);

  return (
    <div
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        width: "100%",
        backgroundColor: "#f0f2f5",
        borderRadius: "20px",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.08)",
        padding: "3.5rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
        maxWidth: "98%",
        margin: "2rem auto",
        position: "relative",
        overflow: "hidden",
        minHeight: "60vh",
      }}
    >
      <h1
        style={{
          fontSize: "1.8rem",
          fontWeight: 800,
          color: "#0077b6",
          marginBottom: "1.2rem",
        }}
      >
        Painel do Diácono
      </h1>

      <div
        style={{
          display: "flex",
          gap: "1.2rem",
          marginBottom: "2rem",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => openModal("escala")}
          style={{
            background: "linear-gradient(45deg, #0077b6, #00a4eb)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "1.2rem 2rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1.1rem",
            boxShadow: "0 8px 25px rgba(0, 118, 255, 0.3)",
            transition: "all 0.3s ease",
            minWidth: "250px",
          }}
        >
          Nova Escala
        </button>
      </div>

      {modal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(6px)",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              position: "relative",
              width: "95%",
              maxWidth: "700px",
              minWidth: "320px",
              backgroundColor: "#ffffff",
              borderRadius: "15px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
              padding: "2.5rem",
              overflowY: "auto",
              zIndex: 2100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "1.2rem",
                right: "1.2rem",
                background: "none",
                border: "none",
                color: "#9daab9",
                fontSize: "2.2rem",
                fontWeight: "bold",
                cursor: "pointer",
                lineHeight: 1,
                padding: "0.6rem",
                borderRadius: "50%",
                transition:
                  "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
              }}
            >
              &times;
            </button>
            <div style={{ width: "100%", maxWidth: 420 }}>
              {modal === "escala" && <CriarEscala token={token} />}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          marginBottom: "1.8rem",
          background: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
          padding: "1.5rem 1.8rem",
          borderLeft: "6px solid #0077b6",
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: "#0077b6",
            fontWeight: 700,
            fontSize: "1.3rem",
            cursor: "pointer",
            padding: "0.5rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            transition: "color 0.2s ease, transform 0.2s ease",
            width: "100%",
            textAlign: "left",
          }}
          onClick={() => setColEscalas((v) => !v)}
        >
          <span
            style={{
              fontSize: "1rem",
              transition: "transform 0.2s ease",
              transform: colEscalas ? "rotate(0deg)" : "rotate(90deg)",
            }}
          >
            ▶
          </span>{" "}
          Lista de Escalas
        </button>
        {!colEscalas && <ListarEscalas />}
      </div>
    </div>
  );
}
