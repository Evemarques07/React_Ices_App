// src/routes.jsx
import Home from "./pages/Home";
import Contribuicoes from "./pages/Contribuicoes";
import Relatorios from "./pages/Relatorios";
import Tesoureiro from "./pages/Tesoureiro";
import Secretaria from "./pages/Secretaria";
import CalendarioEventos from "./pages/CalendarioEventos";

export default function Routes({
  user,
  route,
  setRoute,
  autorizadoTesoureiro,
  autorizadoSecretario,
}) {
  if (!user) return null;

  return (
    <>
      {route === "home" && <Home user={user} />}
      {route === "contribuicoes" && <Contribuicoes />}
      {route === "relatorios" && <Relatorios />}
      {route === "tesoureiro" && autorizadoTesoureiro && (
        <Tesoureiro user={user} />
      )}
      {route === "secretaria" && autorizadoSecretario && (
        <Secretaria user={user} />
      )}
      {route === "calendario" && <CalendarioEventos />}
    </>
  );
}
