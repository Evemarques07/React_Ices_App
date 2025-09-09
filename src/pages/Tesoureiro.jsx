import { useEffect, useState } from "react";
import NovaEntrada from "../components/NovaEntrada";
import NovaSaida from "../components/NovaSaida";
import MovimentacoesFiltradas from "../components/MovimentacoesFiltradas";

const styles = {
  mainContainer: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    maxWidth: "1200px",
    width: "96%",
    margin: "2.5rem auto",
    backgroundColor: "#f8f9fa", 
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0, 100, 150, 0.08)",
    padding: "3rem 2.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
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

  pageTitle: {
    color: "#0056b3", 
    fontSize: "2.5rem",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "1rem",
    letterSpacing: "-0.8px",
  },
  welcomeText: {
    color: "#4a5568",
    fontSize: "1.15rem",
    textAlign: "center",
    marginBottom: "0.5rem",
    lineHeight: "1.6",
  },
  descriptionText: {
    color: "#6b7280",
    fontSize: "1.05rem",
    textAlign: "center",
    marginBottom: "2rem", 
  },

  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    margin: "2.5rem 0",
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
    boxShadow: "0 6px 20px rgba(0, 118, 255, 0.35)", // Sombra elegante
    transition: "transform 0.2s ease, box-shadow 0.3s ease",
    minWidth: "220px", // Garante largura mínima para cada botão
    flexGrow: 1, // Permite que os botões cresçam se houver espaço
    "&:hover": {
      // Estilo de hover
      transform: "translateY(-3px)",
      boxShadow: "0 8px 25px rgba(0, 118, 255, 0.45)",
    },
  },

  // --- Modal (Fundo escuro) ---
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)", // Fundo mais escuro para maior contraste
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)", // Efeito de desfoque no fundo
  },

  // --- Conteúdo do Modal (o formulário) ---
  modalContent: {
    position: "relative",
    backgroundColor: "#ffffff", // Fundo branco puro
    borderRadius: "18px", // Bordas arredondadas
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.2)", // Sombra mais intensa para o modal
    padding: "2rem",
    width: "90%", // Ocupa 90% da largura do overlay
    maxWidth: "600px", // Aumenta o maxWidth para o modal
    minHeight: "fit-content", // Ajusta a altura ao conteúdo
    maxHeight: "90vh", // Limita a altura do modal para evitar overflow
    overflowY: "auto", // Adiciona scroll se o conteúdo for muito longo
    transform: "scale(0.95)", // Começa um pouco menor
    animation: "modalFadeIn 0.3s forwards ease-out", // Animação de entrada (veja o keyframes no CSS global, se usar)
  },

  // --- Botão Fechar do Modal ---
  modalCloseButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "none", // Sem background
    border: "none",
    color: "#6b7280", // Cor mais neutra para o 'x'
    fontSize: "1.8rem", // Ícone 'x' maior
    fontWeight: "bold",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0.5rem",
    borderRadius: "50%",
    transition: "background-color 0.2s ease, color 0.2s ease",
    "&:hover": {
      backgroundColor: "#edf2f7",
      color: "#344054",
    },
  },

  // --- Componentes listados (EntradasFinanceiras, etc.) ---
  sectionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.05)",
    padding: "2.5rem",
    marginBottom: "2rem", // Espaçamento entre as seções
  },

  // --- Media Queries para responsividade ---
  "@media (max-width: 768px)": {
    mainContainer: {
      width: "98%",
      margin: "1.5rem auto",
      padding: "2rem 1rem",
      gap: "1.5rem",
    },
    pageTitle: {
      fontSize: "2rem",
    },
    welcomeText: {
      fontSize: "1rem",
    },
    descriptionText: {
      fontSize: "0.9rem",
    },
    buttonGroup: {
      flexDirection: "column", // Botões empilhados em telas menores
      gap: "1rem",
      margin: "1.5rem 0",
    },
    actionButton: {
      minWidth: "unset", // Remove largura mínima para se adaptar
      width: "100%", // Ocupa toda a largura disponível
      padding: "1rem 1.2rem",
      fontSize: "0.95rem",
    },
    modalContent: {
      width: "95%", // Ocupa mais largura em telas pequenas
      padding: "1.5rem",
    },
    modalCloseButton: {
      fontSize: "1.5rem",
    },
    acessoRestrito: {
      padding: "2rem 1rem",
      fontSize: "1.8rem",
    },
    acessoRestritoText: {
      fontSize: "1rem",
    },
  },
};

export default function Tesoureiro({ user }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cargos = user?.cargos || [];
  const autorizado =
    cargos.includes("Tesoureiro") || cargos.includes("Segundo_Tesoureiro");

  if (!autorizado) {
    return (
      <div style={styles.acessoRestrito}>
        <h2 style={styles.acessoRestritoTitle}>Acesso Restrito</h2>
        <p style={styles.acessoRestritoText}>
          Esta área é exclusiva para Tesoureiros e Segundo Tesoureiros.
        </p>
      </div>
    );
  }

  const [modal, setModal] = useState(null); // 'caixa', 'projetos', 'missionaria', 'saida'

  const openModal = (tipo) => setModal(tipo);
  const closeModal = () => setModal(null);

  return (
    <div style={styles.mainContainer}>
      <p style={styles.welcomeText}>
        Bem-vindo, {user?.nome_membro?.split(" ").slice(0, 2).join(" ")}!
      </p>

      <div style={styles.buttonGroup}>
        <button onClick={() => openModal("entrada")} style={styles.actionButton}>
          Nova Entrada
        </button>
        <button onClick={() => openModal("saida")} style={styles.actionButton}>
          Nova Saída
        </button>
      </div>

      {modal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} style={styles.modalCloseButton}>
              &times; {/* Caractere 'X' para fechar */}
            </button>
            {modal === "entrada" && (
              <NovaEntrada
                token={user?.access_token}
                onSuccess={closeModal}
              />
            )}
            {modal === "saida" && (
              <NovaSaida token={user?.access_token} onSuccess={closeModal} />
            )}
          </div>
        </div>
      )}
      <div style={styles.sectionContainer}>
        <MovimentacoesFiltradas token={user?.access_token} />
      </div>
    </div>
  );
}
