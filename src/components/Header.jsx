import React from "react";
import styled from "styled-components";
import { FaBars, FaSignOutAlt } from "react-icons/fa"; // Importando ícones do Font Awesome

// 1. Estilizando o componente principal do cabeçalho
const HeaderContainer = styled.header`
  background: linear-gradient(to right, #007bff, #0056b3); /* Gradiente azul elegante */
  color: #fff;
  padding: 0.8rem 1.5rem; /* Mais padding para um visual espaçoso */
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Sombra mais pronunciada e suave */
`;

// 2. Estilizando o contêiner interno para o conteúdo do usuário
const UserContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

// 3. Grupo de elementos à esquerda (hambúrguer e avatar)
const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* Mais espaço entre os elementos */
`;

// 4. Botão do hambúrguer estilizado
const HamburgerButton = styled.button`
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 6px; /* Borda mais suave */
  padding: 0.6rem 0.8rem;
  font-size: 1.6rem; /* Ícone um pouco maior */
  cursor: pointer;
  transition: all 0.3s ease; /* Transição suave ao interagir */

  &:hover {
    background: rgba(255, 255, 255, 0.15); /* Efeito hover sutil */
    transform: scale(1.05); /* Pequeno zoom no hover */
  }

  /* Responsividade para o botão do hambúrguer */
  @media (min-width: 1020px) {
    display: none; /* Esconde em telas maiores */
  }
`;

// 5. Avatar do usuário estilizado
const UserAvatar = styled.div`
  width: 40px; /* Avatar um pouco maior */
  height: 40px;
  border-radius: 50%;
  background: #e9ecef; /* Cor de fundo mais neutra */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #007bff; /* Cor do texto combinando com o tema */
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.5); /* Borda sutil */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// 6. Grupo de elementos à direita (info do usuário e botão de sair)
const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 25px; /* Mais espaço entre os elementos */
`;

// 7. Informações do usuário (nome e cargo)
const UserInfoText = styled.div`
  text-align: right;
`;

const UserName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap; /* Evita quebra de linha */
  overflow: hidden;
  text-overflow: ellipsis; /* Adiciona "..." se o nome for muito longo */
  max-width: 150px; /* Limite de largura para o nome */

  @media (max-width: 370px) {
    max-width: 100px; /* Reduz a largura em telas menores */
    font-size: 0.9rem;
  }
`;

const UserRole = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8); /* Cor mais suave */
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;

  @media (max-width: 370px) {
    display: none; /* Esconde o cargo em telas muito pequenas */
  }
`;

// 8. Botão de sair estilizado
const LogoutButton = styled.button`
  background: #fff;
  color: #007bff; /* Cor combinando com o tema */
  font-size: 0.9rem;
  border: none;
  padding: 0.6rem 1.3rem;
  border-radius: 8px; /* Cantos mais arredondados */
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px; /* Espaço entre o ícone e o texto */

  &:hover {
    background: #e9ecef; /* Cor de fundo suave no hover */
    color: #0056b3; /* Cor do texto mais escura no hover */
    transform: translateY(-2px); /* Efeito de "levantar" no hover */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 370px) {
    span {
      display: none; /* Esconde o texto "Sair" em telas muito pequenas */
    }
    padding: 0.6rem 0.8rem; /* Ajusta o padding para apenas o ícone */
  }
`;

export default function Header({
  userInfo,
  drawerOpen,
  setDrawerOpen,
  handleLogout,
}) {
  const getInitials = (name) => {
    const names = name?.split(" ") || [];
    if (names.length === 0) return "?";
    return names[0][0] + (names.length > 1 ? names[names.length - 1][0] : ""); // Pega a primeira e a última inicial
  };

  const getShortName = (name) => {
    const names = name?.split(" ") || [];
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    return `${names[0]} ${names[1]}`; // Retorna no máximo dois nomes
  };

  return (
    <HeaderContainer>
      {userInfo && (
        <UserContentWrapper>
          <LeftGroup>
            {/* Oculta o botão do hambúrguer se o drawer já estiver aberto para evitar clique duplo em alguns casos, ou se não houver setDrawerOpen */}
            {!drawerOpen && setDrawerOpen && (
              <HamburgerButton onClick={() => setDrawerOpen(true)} title="Abrir Menu">
                <FaBars />
              </HamburgerButton>
            )}
            <UserAvatar title="Avatar do usuário">
              {getInitials(userInfo?.nome_membro)}
            </UserAvatar>
          </LeftGroup>

          <RightGroup>
            <UserInfoText>
              <UserName>{getShortName(userInfo?.nome_membro)}</UserName>
              {userInfo?.cargos && userInfo.cargos.length > 0 && (
                <UserRole>{userInfo.cargos[0]}</UserRole>
              )}
            </UserInfoText>
            <LogoutButton onClick={handleLogout} title="Sair da conta">
              <FaSignOutAlt /> <span>Sair</span>
            </LogoutButton>
          </RightGroup>
        </UserContentWrapper>
      )}
    </HeaderContainer>
  );
}