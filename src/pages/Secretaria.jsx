import React, { useState } from "react";
import ScrollToTopButton from "../components/utils/ScrollToTopButton";
import ListaMembros from "../components/secretaria/ListaMembros";
import NovoMembro from "../components/secretaria/NovoMembro";
import CriarEvento from "../components/eventos/CriarEvento";
import CriarCargo from "../components/cargos/CriarCargo";
import ListarCargos from "../components/cargos/ListarCargos";
import ListarLideranca from "../components/cargos/ListarLideranca";
import ListarEventos from "../components/eventos/ListarEventos";
import ListarUsuarios from "../components/usuarios/ListarUsuarios";
import CriarUsuario from "../components/usuarios/CriarUsuario";
import ListaTodosNomes from "../components/secretaria/ListaTodosNomes";
import ListaFilhos from "../components/secretaria/ListaFilhos";

const commonButtonStyles = {
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
  flexGrow: 1,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(0, 118, 255, 0.45)",
    background: "linear-gradient(45deg, #005f99, #008ccb)",
  },
  "&:active": {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 15px rgba(0, 118, 255, 0.2)",
  },
};

const styles = {
  mainContainer: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    width: "100%",
    backgroundColor: "#f0f2f5",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.08)",
    padding: "3.5rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    maxWidth: "98%",
    margin: "2rem auto",
    position: "relative",
    overflow: "hidden",
  },
  acessoRestrito: {
    maxWidth: "800px",
    margin: "4rem auto",
    textAlign: "center",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0, 100, 150, 0.08)",
    padding: "3rem 2rem",
  },
  acessoRestritoTitle: {
    color: "#e53e3e",
    fontSize: "2.2rem",
    marginBottom: "1rem",
    fontWeight: 700,
  },
  acessoRestritoText: {
    color: "#4a5568",
    fontSize: "1.1rem",
    lineHeight: "1.6",
  },
  header: {
    textAlign: "center",
    marginBottom: "2.5rem",
    color: "#2c3e50",
    textShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: 800,
    marginBottom: "0.8rem",
    color: "#0077b6", 
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#5f728c",
    lineHeight: 1.6,
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.2rem",
    marginBottom: "2rem",
    justifyContent: "center",
  },
  actionButton: {
    ...commonButtonStyles,
  },
  secondaryButton: {
    background: "#6c757d", 
    "&:hover": {
      background: "#5a6268",
    },
  },
  divider: {
    width: "100%",
    borderBottom: "2px solid #e0e6ed",
    margin: "2rem 0",
  },
  modalOverlay: {
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
    animation: "fadeIn 0.3s ease-out forwards",
  },
  modalContent: {
    position: "relative", 
    width: "95%",
    maxWidth: "800px",
    minHeight: "auto",
    maxHeight: "90vh",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
    padding: "2.5rem",
    overflowY: "auto",
    zIndex: 2100,
    animation: "slideInFromTop 0.4s ease-out forwards",
  },
  modalCloseButton: {
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
    "&:hover": {
      backgroundColor: "#f0f2f5",
      color: "#6c757d",
      transform: "rotate(90deg)",
    },
  },
  sectionContainer: {
    marginBottom: "1.8rem",
    background: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
    padding: "1.5rem 1.8rem",
    borderLeft: "6px solid #0077b6", 
  },
  collapseBtn: {
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
    "&:hover": {
      color: "#005f99",
      transform: "translateX(5px)",
    },
  },
  collapseIcon: {
    fontSize: "1rem",
    transition: "transform 0.2s ease",
  },
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "@keyframes slideInFromTop": {
    from: { transform: "translateY(-50px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },

  "@media (max-width: 768px)": {
    mainContainer: {
      width: "98%",
      margin: "1rem auto",
      padding: "2rem 1rem",
      gap: "1.5rem",
    },
    title: {
      fontSize: "2.2rem",
    },
    subtitle: {
      fontSize: "1.1rem",
    },
    buttonGroup: {
      flexDirection: "column",
      gap: "1rem",
      margin: "1rem 0",
    },
    actionButton: {
      minWidth: "unset",
      width: "100%",
      padding: "1rem 1.2rem",
      fontSize: "1rem",
    },
    modalContent: {
      width: "90%",
      padding: "1.5rem",
      borderRadius: "10px",
    },
    modalCloseButton: {
      fontSize: "1.8rem",
      top: "0.8rem",
      right: "0.8rem",
    },
    sectionContainer: {
      padding: "1rem 1.2rem",
      borderLeftWidth: "4px",
    },
    collapseBtn: {
      fontSize: "1.1rem",
    },
    collapseIcon: {
      fontSize: "0.8rem",
    },
  },
  "@media (max-width: 480px)": {
    mainContainer: {
      padding: "1.5rem 0.8rem",
    },
    title: {
      fontSize: "1.8rem",
    },
    subtitle: {
      fontSize: "0.95rem",
    },
    buttonGroup: {
      gap: "0.8rem",
    },
    actionButton: {
      padding: "0.9rem 1rem",
      fontSize: "0.9rem",
    },
    modalContent: {
      padding: "1rem",
    },
    modalCloseButton: {
      fontSize: "1.6rem",
    },
    sectionContainer: {
      padding: "0.8rem 1rem",
    },
    collapseBtn: {
      fontSize: "1rem",
      gap: "0.6rem",
    },
  },
};

export default function Secretaria({ user }) {
  const [modal, setModal] = useState(null);
  const [colCargos, setColCargos] = useState(true);
  const [colEventos, setColEventos] = useState(true);
  const [colLideranca, setColLideranca] = useState(true);
  const [colFilhos, setColFilhos] = useState(true);
  const [colContribuintes, setColContribuintes] = useState(true);
  const [colMembros, setColMembros] = useState(true);
  const [colUsuarios, setColUsuarios] = useState(true);

  const cargos = user?.cargos || [];
  const autorizado =
    cargos.includes("Secretario") ||
    cargos.includes("Segundo_Secretario") ||
    cargos.includes("Pastor") ||
    cargos.includes("primeiro_usuario");

  if (!autorizado) {
    return (
      <div style={styles.acessoRestrito}>
        <h2 style={styles.acessoRestritoTitle}>Acesso Restrito</h2>
        <p style={styles.acessoRestritoText}>
          Esta área é exclusiva para Secretarios e Segundo Secretarios.
        </p>
      </div>
    );
  }

  const token =
    (user && user.access_token) ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).access_token
      : "");

  const openModal = (tipo) => setModal(tipo);
  const closeModal = () => setModal(null);

  return (
    <div style={styles.mainContainer}>
      {/* <div style={styles.header}>
        <h1 style={styles.title}>Painel da Secretaria</h1>
        <p style={styles.subtitle}>
          Gerencie membros, usuários, eventos e escalas da sua organização de
          forma eficiente.
        </p>
      </div> */}

      <div style={styles.buttonGroup}>
        <button
          onClick={() => openModal("novoMembro")}
          style={styles.actionButton}
        >
          Novo Membro / Contribuinte
        </button>
        <button
          onClick={() => openModal("criarUsuario")}
          style={styles.actionButton}
        >
          Criar Usuário
        </button>
        <button onClick={() => openModal("evento")} style={styles.actionButton}>
          Novo Evento
        </button>
        {/* <button onClick={() => openModal("escala")} style={styles.actionButton}>
          Nova Escala
        </button> */}
        <button onClick={() => openModal("cargo")} style={styles.actionButton}>
          Novo Cargo
        </button>
      </div>

      {modal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "700px",
              minWidth: "320px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 1.2rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} style={styles.modalCloseButton}>
              &times;
            </button>
            <div style={{ width: "100%", maxWidth: 420 }}>
              {modal === "novoMembro" && <NovoMembro />}
              {modal === "evento" && <CriarEvento token={token} />}
              {modal === "cargo" && <CriarCargo token={token} />}
              {modal === "criarUsuario" && <CriarUsuario token={token} />}
            </div>
          </div>
        </div>
      )}

      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColCargos((v) => !v)}
        >
          <span
            style={{
              ...styles.collapseIcon,
              transform: colCargos ? "rotate(0deg)" : "rotate(90deg)",
            }}
          >
            ▶
          </span>{" "}
          Lista de Cargos 
        </button>
        {!colCargos && <ListarCargos />}
      </div>
      
      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColLideranca((v) => !v)}
        >
          <span
            style={{
              ...styles.collapseIcon,
              transform: colLideranca ? "rotate(0deg)" : "rotate(90deg)",
            }}
          >
            ▶
          </span>{" "}
          Lista de Liderança
        </button>
        {!colLideranca && <ListarLideranca token={token} />}
      </div>

      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColMembros((v) => !v)}
        >
          <span
            style={{
              ...styles.collapseIcon,
              transform: colMembros ? "rotate(0deg)" : "rotate(90deg)",
            }}
          >
            ▶
          </span>{" "}
          Lista de Membros
        </button>
        {!colMembros && <ListaMembros />}
      </div>
      
      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColContribuintes((v) => !v)}
        >
          <span
            style={{
              ...styles.collapseIcon,
              transform: colContribuintes ? "rotate(0deg)" : "rotate(90deg)",
            }}
          >
            ▶
          </span>{" "}
          Lista de Contribuintes
        </button>
        {!colContribuintes && <ListaTodosNomes />}
      </div>
      
      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColUsuarios((v) => !v)}
        >
          <span
            style={{
              ...styles.collapseIcon,
              transform: colUsuarios ? "rotate(0deg)" : "rotate(90deg)",
            }}
          >
            ▶
          </span>{" "}
          Lista de Usuários
        </button>
        {!colUsuarios && <ListarUsuarios />}
      </div>
      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColEventos((v) => !v)}
        >
          <span
            style={{
              ...styles.collapseIcon,
              transform: colEventos ? "rotate(0deg)" : "rotate(90deg)",
            }}
          >
            ▶
          </span>{" "}
          Lista de Eventos
        </button>
        {!colEventos && <ListarEventos />}
      </div>

      <div style={styles.sectionContainer}>
        <button
          style={styles.collapseBtn}
          onClick={() => setColFilhos((v) => !v)}
        >
          <span
            style={{
              ...styles.collapseIcon,
              transform: colFilhos ? "rotate(0deg)" : "rotate(90deg)",
            }}
          >
            ▶
          </span>{" "}
          Lista de Pais e Filhos
        </button>
        {!colFilhos && <ListaFilhos token={token} />}
      </div>

      {!modal && <ScrollToTopButton size={60} />}
    </div>
  );
}
