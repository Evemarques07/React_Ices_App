import styled, { css } from "styled-components";
import {
  Home,
  HandCoins,
  Wallet,
  TrendingUp,
  Users,
  Calendar,
  X,
} from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";

const colors = {
  primary: "#007bff",
  primaryDark: "#0056b3",
  background: "rgba(0, 0, 0, 0.4)",
  white: "#fff",
  textActive: "#007bff",
  textInactive: "#fff",
  hoverInactive: "rgba(255, 255, 255, 0.15)",
  hoverActive: "#e9ecef",
  accent: "#e91e63", 
  accentHover: "#c2185b",
};

const transitions = {
  smooth: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
};

const DrawerContainer = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$open ? "0" : "-280px")};
  width: 280px;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    ${colors.primary},
    ${colors.primaryDark}
  );
  color: ${colors.white};
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
  transition: ${transitions.smooth};
  z-index: 1099;
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  overflow-y: auto;

  ${(props) =>
    props.$open &&
    css`
      /* Animação de entrada suave */
      transform: translateX(0);
    `}

  /* Estilos para desktop */
  @media (min-width: 1020px) {
    left: 0;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transform: translateX(0);
  }
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1; /* Permite que o menu ocupe o espaço restante */
  gap: 8px;
  padding: 1.5rem 1rem;
`;

const MenuItemButton = styled.button`
  background: ${(props) => (props.$active ? colors.white : "transparent")};
  color: ${(props) =>
    props.$active ? colors.textActive : colors.textInactive};
  border: none;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  transition: ${transitions.smooth};
  display: flex;
  align-items: center;
  gap: 15px;

  &:hover {
    background: ${(props) =>
      props.$active ? colors.hoverActive : colors.hoverInactive};
    color: ${(props) =>
      props.$active ? colors.primaryDark : colors.textInactive};
  }

  svg {
    stroke-width: 2.5;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const CloseButton = styled(MenuItemButton)`
  margin: 1rem;
  background: ${colors.white};
  color: ${colors.primary};
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${colors.hoverActive};
    color: ${colors.primaryDark};
  }
`;

const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${(props) => (props.$open ? colors.background : "transparent")};
  backdrop-filter: ${(props) => (props.$open ? "blur(2px)" : "none")};
  z-index: 1098;
  visibility: ${(props) => (props.$open ? "visible" : "hidden")};
  transition: background 0.4s ease, backdrop-filter 0.4s ease,
    visibility 0.4s ease;

  @media (min-width: 1020px) {
    display: none;
  }
`;

const LogoutButton = styled(MenuItemButton)`
  margin: 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: ${colors.white};
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: ${colors.white};
  }
`;

export default function Drawer({
  userInfo,
  open,
  setOpen,
  autorizadoTesoureiro,
  autorizadoSecretario,
  autorizadoDiacono,
  handleLogout,
  navigate,
}) {
  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1020) {
      setOpen(false);
    }
  };

  const currentPath = window.location.pathname;

  return (
    <>
      <DrawerOverlay $open={open} onClick={() => setOpen(false)} />
      <DrawerContainer $open={open}>
        <NavMenu>
          <MenuItemButton
            $active={currentPath === "/"}
            onClick={() => handleNavigation("/")}
          >
            <Home size={20} /> Home
          </MenuItemButton>

          {autorizadoTesoureiro && (
            <MenuItemButton
              $active={currentPath === "/tesoureiro"}
              onClick={() => handleNavigation("/tesoureiro")}
            >
              <Wallet size={20} /> Tesouraria
            </MenuItemButton>
          )}

          {autorizadoSecretario && (
            <MenuItemButton
              $active={currentPath === "/secretaria"}
              onClick={() => handleNavigation("/secretaria")}
            >
              <Users size={20} /> Secretaria
            </MenuItemButton>
          )}

          {autorizadoDiacono && (
            <MenuItemButton
              $active={currentPath === "/diacono"}
              onClick={() => handleNavigation("/diacono")}
            >
              <Users size={20} /> Diácono
            </MenuItemButton>
          )}

          <MenuItemButton
            $active={currentPath === "/contribuicoes"}
            onClick={() => handleNavigation("/contribuicoes")}
          >
            <HandCoins size={20} /> Minhas Contribuições
          </MenuItemButton>

          <MenuItemButton
            $active={currentPath === "/relatorios"}
            onClick={() => handleNavigation("/relatorios")}
          >
            <TrendingUp size={20} /> Relatórios
          </MenuItemButton>

          <MenuItemButton
            $active={currentPath === "/calendario"}
            onClick={() => handleNavigation("/calendario")}
          >
            <Calendar size={20} /> Calendário Ices
          </MenuItemButton>
        </NavMenu>
        <LogoutButton onClick={handleLogout} title="Sair da conta">
          <FaSignOutAlt /> Sair
        </LogoutButton>
      </DrawerContainer>
    </>
  );
}
