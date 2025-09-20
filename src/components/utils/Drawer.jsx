import styled, { css } from "styled-components";
import {
  Home,
  HandCoins,
  Wallet,
  TrendingUp,
  Users,
  Calendar,
  Wrench,
  HeartHandshake,
  ChevronLeft,
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
  fast: "all 0.2s ease-in-out",
};

const DrawerContainer = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$open ? "0" : props.$collapsed ? "-70px" : "-280px")};
  width: ${(props) => (props.$collapsed ? "70px" : "280px")};
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
  padding-top: 60px; /* Aumentei para dar espaço ao header (altura do header + margem) */
  overflow-y: auto;
  overflow-x: hidden;

  /* Estilos para desktop */
  @media (min-width: 1020px) {
    left: 0;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transform: translateX(0);
  }

  /* No mobile, sempre usa largura completa e ignora collapsed */
  @media (max-width: 1019px) {
    left: ${(props) => (props.$open ? "0" : "-280px")};
    width: 280px; /* Largura fixa no mobile */
  }
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  padding: 1.5rem 1rem;
`;

const MenuItemButton = styled.button`
  background: ${(props) => (props.$active ? colors.white : "transparent")};
  color: ${(props) =>
    props.$active ? colors.textActive : colors.textInactive};
  border: none;
  border-radius: 12px;
  padding: 1rem 1.2rem; /* Padding base para ambos os modos */
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  transition: ${transitions.smooth};
  display: flex;
  align-items: center;
  gap: 15px; /* Gap padrão */
  white-space: nowrap;
  position: relative;
  
  /* Ajuste para centralizar o ícone no modo colapsado - APENAS NO DESKTOP */
  @media (min-width: 1020px) {
    gap: ${(props) => (props.$collapsed ? "0" : "15px")}; /* Gap condicional apenas no desktop */
    
    ${(props) =>
      props.$collapsed &&
      css`
        justify-content: center;
        padding: 1rem; /* Padding uniforme para ícone centralizado */
      `}
  }

  &:hover {
    background: ${(props) =>
      props.$active ? colors.hoverActive : colors.hoverInactive};
    color: ${(props) =>
      props.$active ? colors.primaryDark : colors.textInactive};
  }

  svg {
    stroke-width: 2.5;
    transition: ${transitions.fast}; /* Transição mais rápida para o SVG */
    min-width: 20px;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  /* Tooltip para modo colapsado - APENAS NO DESKTOP */
  @media (min-width: 1020px) {
    ${(props) =>
      props.$collapsed &&
      css`
        &:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 80px; /* Mais próximo do ícone colapsado */
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          white-space: nowrap;
          z-index: 1100;
          opacity: 1;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
      `}
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

  @media (min-width: 1020px) {
    display: none; /* Esconde o botão fechar no desktop */
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

const MenuText = styled.span`
  overflow: hidden; /* Garante que o texto escondido não ocupe espaço visual */
  transition: opacity 0.3s ease, width 0.3s ease 0.1s; /* Transição com delay para o width */
  
  /* No desktop, aplica o comportamento de collapsed */
  @media (min-width: 1020px) {
    opacity: ${(props) => (props.$collapsed ? "0" : "1")};
    width: ${(props) => (props.$collapsed ? "0" : "auto")}; /* Ajuda a esconder o texto */
  }
  
  /* No mobile, sempre mostra o texto */
  @media (max-width: 1019px) {
    opacity: 1;
    width: auto;
  }
`;

export default function Drawer({
  userInfo,
  open,
  setOpen,
  autorizadoTesoureiro,
  autorizadoSecretario,
  autorizadoDiacono,
  autorizadoPatrimonio,
  handleLogout,
  navigate,
  collapsed,
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
      <DrawerContainer $open={open} $collapsed={collapsed}>
        <NavMenu>
          <MenuItemButton
            $active={currentPath === "/"}
            $collapsed={collapsed}
            data-tooltip="Home"
            onClick={() => handleNavigation("/")}
          >
            <Home size={20} />
            <MenuText $collapsed={collapsed}>Home</MenuText>
          </MenuItemButton>

          {autorizadoTesoureiro && (
            <MenuItemButton
              $active={currentPath === "/tesoureiro"}
              $collapsed={collapsed}
              data-tooltip="Tesouraria"
              onClick={() => handleNavigation("/tesoureiro")}
            >
              <Wallet size={20} />
              <MenuText $collapsed={collapsed}>Tesouraria</MenuText>
            </MenuItemButton>
          )}

          {autorizadoSecretario && (
            <MenuItemButton
              $active={currentPath === "/secretaria"}
              $collapsed={collapsed}
              data-tooltip="Secretaria"
              onClick={() => handleNavigation("/secretaria")}
            >
              <Users size={20} />
              <MenuText $collapsed={collapsed}>Secretaria</MenuText>
            </MenuItemButton>
          )}

          {autorizadoDiacono && (
            <MenuItemButton
              $active={currentPath === "/diacono"}
              $collapsed={collapsed}
              data-tooltip="Diácono"
              onClick={() => handleNavigation("/diacono")}
            >
              <HeartHandshake size={20} />
              <MenuText $collapsed={collapsed}>Diácono</MenuText>
            </MenuItemButton>
          )}

          {autorizadoPatrimonio && (
            <MenuItemButton
              $active={currentPath === "/patrimonio"}
              $collapsed={collapsed}
              data-tooltip="Patrimônio"
              onClick={() => handleNavigation("/patrimonio")}
            >
              <Wrench size={20} />
              <MenuText $collapsed={collapsed}>Patrimônio</MenuText>
            </MenuItemButton>
          )}

          <MenuItemButton
            $active={currentPath === "/contribuicoes"}
            $collapsed={collapsed}
            data-tooltip="Minhas Contribuições"
            onClick={() => handleNavigation("/contribuicoes")}
          >
            <HandCoins size={20} />
            <MenuText $collapsed={collapsed}>Minhas Contribuições</MenuText>
          </MenuItemButton>

          <MenuItemButton
            $active={currentPath === "/relatorios"}
            $collapsed={collapsed}
            data-tooltip="Relatórios"
            onClick={() => handleNavigation("/relatorios")}
          >
            <TrendingUp size={20} />
            <MenuText $collapsed={collapsed}>Relatórios</MenuText>
          </MenuItemButton>

          <MenuItemButton
            $active={currentPath === "/calendario"}
            $collapsed={collapsed}
            data-tooltip="Calendário Ices"
            onClick={() => handleNavigation("/calendario")}
          >
            <Calendar size={20} />
            <MenuText $collapsed={collapsed}>Calendário Ices</MenuText>
          </MenuItemButton>
        </NavMenu>
        
        <LogoutButton 
          $collapsed={collapsed}
          data-tooltip="Sair"
          onClick={handleLogout} 
          title="Sair da conta"
        >
          <FaSignOutAlt />
          <MenuText $collapsed={collapsed}>Sair</MenuText>
        </LogoutButton>
        
        {!collapsed && ( // O botão fechar só aparece quando não está colapsado (e em mobile)
          <CloseButton onClick={() => setOpen(false)}>
            <ChevronLeft size={20} />
            <MenuText $collapsed={false}>Fechar</MenuText>
          </CloseButton>
        )}
      </DrawerContainer>
    </>
  );
}