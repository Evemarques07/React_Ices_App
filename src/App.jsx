import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Routes from "./routes";
import Drawer from "./components/utils/Drawer";
import Header from "./components/utils/Header";
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

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [route, setRoute] = useState("home");

  useEffect(() => {
    // Recupera usuário do localStorage se existir
    const saved = localStorage.getItem("user");
    if (saved) {
      const obj = JSON.parse(saved);
      setUser(obj);
      if (obj.access_token) {
        const info = decodeJWT(obj.access_token);
        setUserInfo(info);
      }
    }
  }, []);

  const handleLogin = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    if (data.access_token) {
      const info = decodeJWT(data.access_token);
      setUserInfo(info);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserInfo(null);
    localStorage.removeItem("user");
  };

  const cargos = userInfo?.cargos || [];
  const autorizadoTesoureiro =
    cargos.includes("Tesoureiro") || cargos.includes("Segundo_Tesoureiro");

  const autorizadoSecretario =
    cargos.includes("Secretario") || cargos.includes("Segundo_Secretario");

  return (
    <div className="app-root">
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
            route={route}
            setRoute={setRoute}
            open={drawerOpen}
            setOpen={setDrawerOpen}
            autorizadoTesoureiro={autorizadoTesoureiro}
            autorizadoSecretario={autorizadoSecretario}
            handleLogout={handleLogout}
          />
        </>
      )}
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
          <Login onLogin={handleLogin} />
        ) : (
          <div className="drawer-content" style={{ width: "100%" }}>
            <Routes
              user={userInfo}
              route={route}
              setRoute={setRoute}
              autorizadoTesoureiro={autorizadoTesoureiro}
              autorizadoSecretario={autorizadoSecretario}
            />
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

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setShow(false);
    }
  };

  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#0097d8",
        color: "#fff",
        padding: "0.7rem 1.2rem",
        borderRadius: 8,
        fontSize: "small",
        zIndex: 1000,
      }}
    >
      <span>Instale o app para acesso rápido!</span>
      <button
        onClick={handleInstall}
        style={{
          marginLeft: 10,
          background: "#fff",
          color: "#0097d8",
          border: "none",
          borderRadius: 4,
          padding: "0.3rem 0.7rem",
          fontSize: "small",
        }}
      >
        Instalar
      </button>
    </div>
  );
}

export default App;
