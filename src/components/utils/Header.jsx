import styled from "styled-components";
import { FaBars, FaSignOutAlt, FaUserEdit, FaKey } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { usuariosAPI } from "../../services/api";

// 1. Estilizando o componente principal do cabeçalho
const HeaderContainer = styled.header`
  background: linear-gradient(
    to right,
    #007bff,
    #0056b3
  ); /* Gradiente azul elegante */
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
  font-size: 0.9rem;
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

export default function Header({ userInfo, drawerOpen, setDrawerOpen }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaLoading, setSenhaLoading] = useState(false);
  const [senhaError, setSenhaError] = useState("");
  const [senhaSuccess, setSenhaSuccess] = useState("");
  const avatarRef = useRef(null);
  const popoverRef = useRef(null);
  // Mapeamento dos cargos para nomes legíveis
  const cargoMap = {
    Diacono: "Diácono",
    Diretor_Patrimonio: "Diretor de Patrimônio",
    Pastor: "Pastor",
    Presbitero: "Presbítero",
    primeiro_usuario: "Primeiro Usuário",
    Secretario: "Secretário",
    Segundo_Secretario: "Segundo Secretário",
    Segundo_Tesoureiro: "Segundo Tesoureiro",
    Tesoureiro: "Tesoureiro",
  };

  const getCargoName = (cargo) => cargoMap[cargo] || cargo;

  const getInitials = (name) => {
    const names = name?.split(" ") || [];
    if (names.length === 0) return "?";
    return names[0][0] + (names.length > 1 ? names[names.length - 1][0] : "");
  };

  const getShortName = (name) => {
    const names = name?.split(" ") || [];
    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    return `${names[0]} ${names[1]}`;
  };

  // Função para abrir/fechar popover
  const handleAvatarClick = () => setPopoverOpen((v) => !v);
  const handleClosePopover = () => setPopoverOpen(false);

  // Função para abrir modal de senha
  const handleOpenSenhaModal = () => {
    setPopoverOpen(false);
    setModalOpen(true);
    setNovaSenha("");
    setSenhaError("");
    setSenhaSuccess("");
  };

  // Função para alterar senha
  const handleAlterarSenha = async () => {
    setSenhaLoading(true);
    setSenhaError("");
    setSenhaSuccess("");
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      if (!token) throw new Error("Usuário não autenticado");
      await usuariosAPI.alterarSenha(novaSenha, token);
      setSenhaSuccess("Senha alterada com sucesso!");
      setNovaSenha("");
    } catch (err) {
      setSenhaError(err.message || "Erro ao alterar senha");
    } finally {
      setSenhaLoading(false);
    }
  };

  // Fecha modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSenhaError("");
    setSenhaSuccess("");
    setNovaSenha("");
  };

  // Fecha popover ao clicar fora
  useEffect(() => {
    if (!popoverOpen) return;
    function handleClickOutside(e) {
      if (avatarRef.current && avatarRef.current.contains(e.target)) {
        return;
      }
      if (popoverRef.current && popoverRef.current.contains(e.target)) {
        return;
      }
      setPopoverOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen]);

  return (
    <HeaderContainer>
      {userInfo && (
        <UserContentWrapper>
          <LeftGroup>
            {/* Oculta o botão do hambúrguer se o drawer já estiver aberto para evitar clique duplo em alguns casos, ou se não houver setDrawerOpen */}
            {!drawerOpen && setDrawerOpen && (
              <HamburgerButton
                onClick={() => setDrawerOpen(true)}
                title="Abrir Menu"
              >
                <FaBars />
              </HamburgerButton>
            )}
          </LeftGroup>

          <RightGroup>
            <UserInfoText>
              <UserName>{getShortName(userInfo?.nome_membro)}</UserName>
              {userInfo?.cargos && userInfo.cargos.length > 0 && (
                <UserRole>{getCargoName(userInfo.cargos[0])}</UserRole>
              )}
            </UserInfoText>
            {/* <LogoutButton onClick={handleLogout} title="Sair da conta">
              <FaSignOutAlt /> <span>Sair</span>
            </LogoutButton> */}
            <div style={{ position: "relative" }}>
              <UserAvatar
                ref={avatarRef}
                title="Avatar do usuário"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={handleAvatarClick}
              >
                {getInitials(userInfo?.nome_membro)}
              </UserAvatar>
              {popoverOpen && (
                <div
                  ref={popoverRef}
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    background: "#fff",
                    color: "#333",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                    minWidth: 180,
                    zIndex: 9999,
                    padding: "0.5rem 0",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.7rem 1.2rem",
                      textAlign: "left",
                      color: "#aaa",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "not-allowed",
                    }}
                    disabled
                  >
                    <FaUserEdit style={{ opacity: 0.5 }} /> Atualizar imagem
                  </button>
                  <button
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      padding: "0.7rem 1.2rem",
                      textAlign: "left",
                      color: "#007bff",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                    }}
                    onClick={handleOpenSenhaModal}
                  >
                    <FaKey /> Alterar senha
                  </button>
                </div>
              )}
            </div>
          </RightGroup>
        </UserContentWrapper>
      )}
      {/* Modal de alteração de senha */}
      {modalOpen && (
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
          onClick={handleCloseModal}
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 18, color: "#007bff" }}>
              Alterar senha
            </h3>
            <input
              type="password"
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={{
                width: "100%",
                padding: "0.7rem 1rem",
                fontSize: "1rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 12,
              }}
              disabled={senhaLoading}
            />
            <button
              style={{
                width: "100%",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "0.7rem 1rem",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: 10,
                opacity: novaSenha.length < 4 || senhaLoading ? 0.6 : 1,
              }}
              onClick={handleAlterarSenha}
              disabled={novaSenha.length < 4 || senhaLoading}
            >
              {senhaLoading ? "Alterando..." : "Confirmar"}
            </button>
            {senhaError && (
              <div style={{ color: "#d00", marginBottom: 8 }}>{senhaError}</div>
            )}
            {senhaSuccess && (
              <div style={{ color: "#090", marginBottom: 8 }}>
                {senhaSuccess}
              </div>
            )}
            <button
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "none",
                border: "none",
                fontSize: 22,
                color: "#aaa",
                cursor: "pointer",
              }}
              onClick={handleCloseModal}
              title="Fechar"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </HeaderContainer>
  );
}
