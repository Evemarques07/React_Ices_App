import React from "react";
import styled from "styled-components";
import {
  Home,
  HandCoins,
  BarChart2,
  X,
  Wallet,
  TrendingUp,
} from "lucide-react"; // Adicionei Wallet e TrendingUp para melhor representação

// 1. Container principal do Drawer
const DrawerContainer = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) =>
    props.open ? "0" : "-250px"}; /* Aumentei a largura para 250px */
  width: 250px; /* Largura fixa */
  height: 100vh;
  background: linear-gradient(
    to bottom,
    #007bff,
    #0056b3
  ); /* Gradiente azul para combinar com o Header */
  color: #fff;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2); /* Sombra mais pronunciada e elegante */
  transition: left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Transição mais suave e profissional */
  z-index: 1099;
  display: flex;
  flex-direction: column;
  padding-top: 70px; /* Ajuste para o Header fixo */

  /* Estilos específicos para desktop */
  @media (min-width: 1020px) {
    left: 0; /* Sempre aberto em desktop */
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1); /* Sombra mais sutil em desktop */
    width: 250px;
  }
`;

// 2. Navegação dos links
const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px; /* Mais espaço entre os itens do menu */
  padding: 1.5rem 1rem; /* Mais padding para um visual espaçoso */
`;

// 3. Estilo para os botões do menu
const MenuItemButton = styled.button`
  background: ${(props) =>
    props.$active ? "#fff" : "transparent"}; /* Fundo branco para ativo */
  color: ${(props) =>
    props.$active ? "#007bff" : "#fff"}; /* Cor do texto combinando */
  border: none;
  border-radius: 8px; /* Cantos mais arredondados */
  padding: 0.8rem 1.2rem; /* Mais padding */
  font-size: 1rem; /* Fonte um pouco maior */
  text-align: left;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  transition: all 0.3s ease; /* Transição suave para hover e ativo */
  display: flex;
  align-items: center;
  gap: 12px; /* Espaço entre ícone e texto */

  &:hover {
    background: ${(props) =>
      props.$active
        ? "#e9ecef"
        : "rgba(255, 255, 255, 0.15)"}; /* Efeito hover mais distinto */
    color: ${(props) => (props.$active ? "#0056b3" : "#fff")};
    transform: translateX(5px); /* Pequeno deslocamento no hover */
  }

  svg {
    stroke-width: 2.5; /* Deixa os ícones um pouco mais robustos */
  }
`;

// 4. Botão de fechar (apenas para mobile)
const CloseButton = styled.button`
  background: #fff;
  color: #007bff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  margin: 20px 1rem; /* Mais margem */
  display: flex;
  align-items: center;
  justify-content: center; /* Centraliza o conteúdo */
  gap: 10px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
    color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  /* Exibe apenas em telas menores */
  @media (min-width: 1020px) {
    display: none;
  }
`;

// 5. Overlay para fechar o Drawer ao clicar fora (apenas mobile)
const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* Fundo semi-transparente */
  z-index: 1098; /* Abaixo do Drawer */
  opacity: ${(props) => (props.open ? 1 : 0)};
  visibility: ${(props) => (props.open ? "visible" : "hidden")};
  transition: opacity 0.4s ease, visibility 0.4s ease;

  @media (min-width: 1020px) {
    display: none; /* Esconde em desktop */
  }
`;

export default function Drawer({
  route,
  setRoute,
  open,
  setOpen,
  autorizadoTesoureiro,
}) {
  const handleNavigation = (newRoute) => {
    setRoute(newRoute);
    // Em desktop, não fechamos o drawer porque ele está sempre aberto
    if (window.innerWidth < 1020) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* O Overlay só é visível em mobile quando o drawer está aberto */}
      <DrawerOverlay open={open} onClick={() => setOpen(false)} />

      <DrawerContainer open={open}>
        <NavMenu>
          <MenuItemButton
            $active={route === "home"}
            onClick={() => handleNavigation("home")}
          >
            <Home size={20} /> Home
          </MenuItemButton>

          {autorizadoTesoureiro && (
            <MenuItemButton
              $active={route === "tesoureiro"}
              onClick={() => handleNavigation("tesoureiro")}
            >
              <Wallet size={20} /> Tesouraria
            </MenuItemButton>
          )}

          <MenuItemButton
            $active={route === "contribuicoes"}
            onClick={() => handleNavigation("contribuicoes")}
          >
            <HandCoins size={20} /> Minhas Contribuições
          </MenuItemButton>

          <MenuItemButton
            $active={route === "relatorios"}
            onClick={() => handleNavigation("relatorios")}
          >
            <TrendingUp size={20} /> Relatórios
          </MenuItemButton>
        </NavMenu>

        {/* Botão fechar para mobile */}
        <CloseButton onClick={() => setOpen(false)}>
          <X size={20} /> Fechar
        </CloseButton>
      </DrawerContainer>
    </>
  );
}
