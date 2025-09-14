
import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

function PWAInstallPrompt() {
  // Estilos inline
  const styles = {
    wrapper: {
      position: "fixed",
      top: 80,
      right: 16,
      zIndex: 50,
      width: 320,
      maxWidth: "calc(100vw - 2rem)",
    },
    card: {
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
    },
    content: {
      padding: 16,
    },
    header: {
      display: "flex",
      alignItems: "start",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    iconWrap: {
      width: 40,
      height: 40,
      background: "#d1fae5",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontWeight: 600,
      color: "#111827",
      fontSize: 14,
      margin: 0,
    },
    subtitle: {
      fontSize: 12,
      color: "#4b5563",
      margin: 0,
    },
    btnClose: {
      color: "#9ca3af",
      background: "none",
      border: "none",
      cursor: "pointer",
      transition: "color 0.2s",
      padding: 0,
    },
    btnGroup: {
      display: "flex",
      gap: 8,
    },
    btnInstall: {
      flex: 1,
      background: "#16a34a",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: 6,
      fontSize: 14,
      fontWeight: 500,
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "background 0.2s",
    },
    btnInstallHover: {
      background: "#15803d",
    },
    btnLater: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: 6,
      fontSize: 14,
      color: "#374151",
      background: "#fff",
      cursor: "pointer",
      transition: "background 0.2s",
    },
    btnLaterHover: {
      background: "#f3f4f6",
    },
  };
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInApp = window.navigator.standalone;
    setIsInstalled(isStandalone || isInApp);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Mostrar prompt após 3 segundos (menos intrusivo)
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);

      // Mostrar feedback de sucesso
      console.log("📱 Sistema Vendas instalado com sucesso!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const userChoice = await deferredPrompt.userChoice;
      const outcome = userChoice && userChoice.outcome;

      if (outcome === "accepted") {
        console.log("📱 Usuário aceitou a instalação");
      } else {
        console.log("❌ Usuário recusou a instalação");
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error("Erro ao instalar PWA:", error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Mostrar novamente após 1 hora
    setTimeout(() => {
      if (deferredPrompt && !isInstalled) {
        setShowPrompt(true);
      }
    }, 60 * 60 * 1000);
  };

  if (!showPrompt || !deferredPrompt || isInstalled) {
    return null;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.content}>
          <div style={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={styles.iconWrap}>
                <Smartphone
                  style={{ width: 20, height: 20, color: "#16a34a" }}
                />
              </div>
              <div>
                <h3 style={styles.title}>Instalar Sistema</h3>
                <p style={styles.subtitle}>Acesso rápido na tela inicial</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              style={styles.btnClose}
              aria-label="Fechar"
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <div style={styles.btnGroup}>
            <button
              onClick={handleInstall}
              style={styles.btnInstall}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#15803d")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#16a34a")}
            >
              <Download style={{ width: 16, height: 16 }} />
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              style={styles.btnLater}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
            >
              Depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
