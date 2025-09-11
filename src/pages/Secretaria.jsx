import React, { useState } from "react";
import ScrollToTopButton from "../components/utils/ScrollToTopButton";
import ListaMembros from "../components/secretaria/ListaMembros";
import NovoMembro from "../components/secretaria/NovoMembro";
import CriarEvento from "../components/eventos/CriarEvento";
import CriarEscala from "../components/escalas/CriarEscala";
import ListarEscalas from "../components/escalas/ListarEscalas";
import ListarEventos from "../components/eventos/ListarEventos";

export default function Secretaria({ user }) {
  const [modal, setModal] = useState(null); // 'novoMembro', 'evento', 'escala'
  const [colEscalas, setColEscalas] = useState(true);
  const [colEventos, setColEventos] = useState(true);
  const [colMembros, setColMembros] = useState(true);

  const styles = {
    mainContainer: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      width: "100%",
      backgroundColor: "#f8f9fa",
      borderRadius: "18px",
      boxShadow: "0 10px 30px rgba(0, 100, 150, 0.08)",
      padding: "3rem 0.8rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      maxWidth: "96%",
      margin: "0 auto",
    },
    buttonGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.8rem",
      margin: "1rem 0",
      justifyContent: "center",
    },
    actionButton: {
      background: "linear-gradient(45deg, #0077b6, #00a4eb)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "1.1rem 1.8rem",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "1.05rem",
      boxShadow: "0 6px 20px rgba(0, 118, 255, 0.35)",
      transition: "transform 0.2s ease, box-shadow 0.3s ease",
      minWidth: "220px",
      flexGrow: 1,
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 10px 25px rgba(0, 118, 255, 0.45)",
      },
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(4px)",
    },
    modalContent: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      width: "100vw",
      maxWidth: "700px",
      margin: "0 auto",
      minHeight: "100vh",
      maxHeight: "100vh",
      backgroundColor: "#fff",
      borderRadius: 0,
      boxShadow: "none",
      padding: 0,
      overflowY: "auto",
      zIndex: 2100,
      animation: "modalFadeIn 0.3s forwards ease-out",
    },
    modalCloseButton: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      background: "none",
      border: "none",
      color: "#6b7280",
      fontSize: "1.8rem",
      fontWeight: "bold",
      cursor: "pointer",
      lineHeight: 1,
      padding: "0.5rem",
      borderRadius: "50%",
      transition: "background-color 0.2s ease, color 0.2s ease",
      "&:hover": {
        backgroundColor: "#f1f1f1",
        color: "#333",
      },
    },
    sectionContainer: {
      marginBottom: "1.5rem",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      padding: "1.2rem 1rem 0.5rem 1rem",
    },
    collapseBtn: {
      background: "none",
      border: "none",
      color: "#0077b6",
      fontWeight: 700,
      fontSize: "1.1rem",
      cursor: "pointer",
      marginBottom: "0.7rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "color 0.2s ease",
      "&:hover": {
        color: "#005f99",
      },
    },
    // ...existing code...

    "@media (max-width: 1020px)": {
      mainContainer: {
        width: "98%",
        margin: "1.5rem auto",
        padding: "2rem 1rem",
        gap: "1.5rem",
      },
      buttonGroup: {
        flexDirection: "column",
        gap: "1rem",
        margin: "1.5rem 0",
      },
      actionButton: {
        minWidth: "unset",
        width: "100%",
        padding: "1rem 1.2rem",
        fontSize: "0.95rem",
      },
      modalContent: {
        width: "95%",
        padding: "1.5rem",
      },
      modalCloseButton: {
        fontSize: "1.5rem",
      },
      sectionContainer: {
        padding: "0.7rem 0.5rem 0.2rem 0.5rem",
      },
      collapseBtn: {
        fontSize: "1rem",
      },
      topBtn: {
        width: "55px",
        height: "55px",
        fontSize: "1.8rem",
        right: "1.5rem",
        bottom: "1.5rem",
      },
    },
  };

  // Recupera token do usuário logado
  const token =
    (user && user.access_token) ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).access_token
      : "");

  const openModal = (tipo) => setModal(tipo);
  const closeModal = () => setModal(null);

  return (
    <div style={styles.mainContainer}>
      <div style={styles.buttonGroup}>
        <button
          onClick={() => openModal("novoMembro")}
          style={styles.actionButton}
        >
          Novo Membro
        </button>
        <button onClick={() => openModal("evento")} style={styles.actionButton}>
          Novo Evento
        </button>
        <button onClick={() => openModal("escala")} style={styles.actionButton}>
          Nova Escala
        </button>
      </div>

      {modal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} style={styles.modalCloseButton}>
              &times;
            </button>
            {modal === "novoMembro" && <NovoMembro />}
            {modal === "evento" && <CriarEvento token={token} />}
            {modal === "escala" && <CriarEscala token={token} />}
          </div>
        </div>
      )}

      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColEscalas((v) => !v)}
        >
          {colEscalas ? "▶" : "▼"} Lista de Escalas
        </button>
        {!colEscalas && <ListarEscalas />}
      </div>
      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColEventos((v) => !v)}
        >
          {colEventos ? "▶" : "▼"} Lista de Eventos
        </button>
        {!colEventos && <ListarEventos />}
      </div>
      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColMembros((v) => !v)}
        >
          {colMembros ? "▶" : "▼"} Lista de Membros
        </button>
        {!colMembros && <ListaMembros />}
      </div>

      <ScrollToTopButton size={60} />
      
    </div>
  );
}
