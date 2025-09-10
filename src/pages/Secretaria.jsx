import React, { useEffect, useState } from "react";
import ListaMembros from "../components/secretaria/ListaMembros";
import NovoMembro from "../components/secretaria/NovoMembro";

export default function Secretaria({ user }) {
  const [modal, setModal] = useState(false);

  const styles = {
    mainContainer: {
      padding: "2rem",
      width: "100%",
      backgroundColor: "#f8f9fa",
      borderRadius: "18px",
      boxShadow: "0 10px 30px rgba(0, 100, 150, 0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "2.5rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "start",
      marginBottom: "1.5rem",
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
    },
  };

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <div style={styles.mainContainer}>
      <div style={styles.buttonGroup}>
        <button onClick={openModal} style={styles.actionButton}>
          Novo Membro
        </button>
      </div>
      {modal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} style={styles.modalCloseButton}>
              &times;
            </button>
            <NovoMembro />
          </div>
        </div>
      )}
      <ListaMembros />
    </div>
  );
}
