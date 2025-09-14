// src/App.jsx
import { useState, useEffect } from "react";
import { Routes as RouterRoutes, Route, useNavigate } from "react-router-dom";
import Routes from "./routes";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Drawer from "./components/utils/Drawer";
import Header from "./components/utils/Header";
import { PWAInstallPrompt } from "./components/utils/PWAInstallPrompt";
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
  // exp é em segundos, Date.now() em ms
  return Date.now() >= decoded.exp * 1000;
}

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [route, setRoute] = useState(() => {
    // Recupera rota do localStorage ou usa 'home' como padrão
    return localStorage.getItem("route") || "home";
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera usuário do localStorage se existir
    const saved = localStorage.getItem("user");
    if (saved) {
      const obj = JSON.parse(saved);
      if (obj.access_token) {
        const info = decodeJWT(obj.access_token);
        // Se o token expirou, desloga
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

  // Salva a rota atual no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("route", route);
  }, [route]);

  const handleLogin = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    if (data.access_token) {
      const info = decodeJWT(data.access_token);
      setUserInfo(info);
      navigate("/"); // redireciona para Home após login
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserInfo(null);
    localStorage.removeItem("user");
    navigate("/login"); // volta para tela de login
  };

  const cargos = userInfo?.cargos || [];
  const autorizadoTesoureiro =
    cargos.includes("Tesoureiro") || cargos.includes("Segundo_Tesoureiro");

  const autorizadoSecretario =
    cargos.includes("Secretario") || cargos.includes("Segundo_Secretario");

  const autorizadoPastor = cargos.includes("Pastor");

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
            autorizadoTesoureiro={autorizadoTesoureiro || autorizadoPastor}
            autorizadoSecretario={autorizadoSecretario || autorizadoPastor}
            handleLogout={handleLogout}
          />
        </>
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
          </RouterRoutes>
        ) : (
          <div className="drawer-content" style={{ width: "100%" }}>
            <Routes
              user={user}
              route={route}
              setRoute={setRoute}
              autorizadoTesoureiro={autorizadoTesoureiro || autorizadoPastor}
              autorizadoSecretario={autorizadoSecretario || autorizadoPastor}
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

export default App;
