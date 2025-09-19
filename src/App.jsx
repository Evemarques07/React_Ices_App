// src/App.jsx
import { useState, useEffect } from "react";
import { Routes as RouterRoutes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Contribuicoes from "./pages/Contribuicoes";
import Relatorios from "./pages/Relatorios";
import Tesoureiro from "./pages/Tesoureiro";
import Secretaria from "./pages/Secretaria";
import Diacono from "./pages/Diacono";
import Patrimonio from "./pages/Patrimonio";
import CalendarioEventos from "./pages/CalendarioEventos";
import Drawer from "./components/utils/Drawer";
import Header from "./components/utils/Header";
import PWAInstallPrompt from "./components/utils/PWAInstallPrompt";

// Componente para avisar sobre nova versão
function UpdateBanner({ onReload }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        background: "#007bff",
        color: "#fff",
        textAlign: "center",
        padding: "1rem",
        zIndex: 99999,
        fontWeight: "bold",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.18)",
        cursor: "pointer",
      }}
      onClick={onReload}
    >
      Nova versão disponível! Clique para atualizar.
    </div>
  );
}
import "./App.css";

function decodeJWT(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded;
  } catch {
    return null;
  }
}

function isTokenExpired(decoded) {
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingPop, setPendingPop] = useState(false);

  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    let lastVersion = null;
    let intervalId = null;
    function checkVersion() {
      fetch("/index.html", { cache: "no-store" })
        .then((res) => res.text())
        .then((text) => {
          // Extrai um hash ou data do build do HTML
          const match = text.match(
            /<meta name="build-version" content="([^"]+)"/
          );
          const version = match ? match[1] : text.length; 
          if (lastVersion === null) {
            lastVersion = version;
          } else if (version !== lastVersion) {
            setUpdateAvailable(true);
            clearInterval(intervalId);
          }
        });
    }
    intervalId = setInterval(checkVersion, 15000); 
    checkVersion();
    return () => clearInterval(intervalId);
  }, []);

  const handleReload = () => {
    if (window.caches) {
      caches.keys().then((names) => {
        for (let name of names) caches.delete(name);
      });
    }
    window.location.reload(true);
  };

  useEffect(() => {
    if (!userInfo) return;
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/login") {
        setShowExitModal(true);
        setPendingPop(true);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) return;
    const interval = setInterval(() => {
      if (isTokenExpired(userInfo)) {
        handleLogout();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [userInfo]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const obj = JSON.parse(saved);
      if (obj.access_token) {
        const info = decodeJWT(obj.access_token);
        if (isTokenExpired(info)) {
          handleLogout();
          return;
        }
        setUser(obj);
        setUserInfo(info);
      } else {
        setUser(obj);
      }
    }
  }, []);

  const handleLogin = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    if (data.access_token) {
      const info = decodeJWT(data.access_token);
      setUserInfo(info);
      navigate("/");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserInfo(null);
    localStorage.removeItem("user");
    setShowExitModal(false);
    setPendingPop(false);
    navigate("/login");
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    if (pendingPop) {
      navigate(-1);
      setPendingPop(false);
    }
  };

  const cargos = userInfo?.cargos || [];
  const autorizadoTesoureiro =
    cargos.includes("Tesoureiro") ||
    cargos.includes("Segundo_Tesoureiro") ||
    cargos.includes("primeiro_usuario");

  const autorizadoSecretario =
    cargos.includes("Secretario") ||
    cargos.includes("Segundo_Secretario") ||
    cargos.includes("primeiro_usuario");

  const autorizadoPastor = cargos.includes("Pastor");

  const autorizadoDiacono =
    cargos.includes("Diacono") || cargos.includes("primeiro_usuario");

  const autorizadoPatrimonio =
    cargos.includes("Patrimonio") || cargos.includes("primeiro_usuario");

  return (
    <div className="app-root">
      {updateAvailable && <UpdateBanner onReload={handleReload} />}
      {userInfo && (
        <>
          <Header
            userInfo={userInfo}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            handleLogout={handleLogout}
          />
          <Drawer
            userInfo={userInfo}
            open={drawerOpen}
            setOpen={setDrawerOpen}
            autorizadoTesoureiro={autorizadoTesoureiro || autorizadoPastor}
            autorizadoSecretario={autorizadoSecretario || autorizadoPastor}
            autorizadoDiacono={autorizadoDiacono || autorizadoPastor}
            autorizadoPatrimonio={autorizadoPatrimonio || autorizadoPastor}
            handleLogout={handleLogout}
            navigate={navigate}
          />
        </>
      )}

      {showExitModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              minWidth: 320,
              maxWidth: 400,
              padding: "2rem 1.5rem 1.5rem 1.5rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              position: "relative",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: 18, color: "#007bff" }}>
              Deseja realmente sair do aplicativo?
            </h3>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <button
                style={{
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.7rem 1.2rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  transition: "background 0.2s",
                }}
                onClick={handleLogout}
              >
                Sim, quero sair
              </button>
              <button
                style={{
                  background: "#e9ecef",
                  color: "#007bff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.7rem 1.2rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "background 0.2s",
                }}
                onClick={handleCancelExit}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <PWAInstallPrompt />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: userInfo ? "2.8rem" : 0,
        }}
        className={userInfo ? "main-content" : ""}
      >
        {!userInfo ? (
          <RouterRoutes>
            <Route path="/*" element={<Login onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          </RouterRoutes>
        ) : (
          <div className="drawer-content" style={{ width: "100%" }}>
            <RouterRoutes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/contribuicoes" element={<Contribuicoes />} />
              <Route path="/relatorios" element={<Relatorios />} />
              {autorizadoTesoureiro || autorizadoPastor ? (
                <Route
                  path="/tesoureiro"
                  element={<Tesoureiro user={user} />}
                />
              ) : null}
              {autorizadoSecretario || autorizadoPastor ? (
                <Route
                  path="/secretaria"
                  element={<Secretaria user={user} />}
                />
              ) : null}
              <Route path="/calendario" element={<CalendarioEventos />} />
              {autorizadoDiacono || autorizadoPastor ? (
                <Route path="/diacono" element={<Diacono user={user} />} />
              ) : null}
              {autorizadoPatrimonio || autorizadoPastor ? (
                <Route
                  path="/patrimonio"
                  element={<Patrimonio user={user} />}
                />
              ) : null}
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </RouterRoutes>
          </div>
        )}
      </main>

      <style>{`
        @media (min-width: 1020px) {
          .main-content {
            padding-left: 30px;
          }
          .drawer-content {
            margin-left: 220px;
            transition: margin-left 0.3s;
          }
        }
        @media (max-width: 767px) {
          .main-content {
            padding-left: 0;
          }
          .drawer-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
