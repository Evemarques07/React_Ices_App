import Home from "./pages/Home";
import Contribuicoes from "./pages/Contribuicoes";
import Relatorios from "./pages/Relatorios";
import Tesoureiro from "./pages/Tesoureiro";

export default function Routes({ user, route, setRoute, autorizadoTesoureiro }) {

  if (!user) return null;

  return (
    <>
      {route === "home" && <Home user={user} />}
      {route === "contribuicoes" && <Contribuicoes />}
      {route === "relatorios" && <Relatorios />}
      {route === "tesoureiro" && autorizadoTesoureiro && (
        <Tesoureiro user={user} />
      )}
    </>
  );
}
