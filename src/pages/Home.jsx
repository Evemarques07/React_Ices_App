import React from "react";
import {
  FaChartLine,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaPrayingHands,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import "../css/Home.css";
import logoInstafran from "../assets/instagram.png";
import logoWhatsapp from "../assets/whatsapp.png";
import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
  const navigate = useNavigate();
  const primeiroNome = user?.nome_membro?.split(" ")[0] || "";
  const cargoRaw = user?.cargos && user.cargos.length > 0 ? user.cargos[0] : "";
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

  return (
    <div className="container-principal">
      <div className="card-boas-vindas">
        <h2 className="titulo-boas-vindas">
          <p className="saudacao">Bem-vindo,</p>
          <p className="nome-usuario-home">
            {primeiroNome || "usuário"}
            {cargoRaw && (
              <span className="cargo-tag"> {getCargoName(cargoRaw)}</span>
            )}
          </p>
        </h2>
        <img
          src={logo}
          alt="Logo Ices"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 120,
            height: 120,
            opacity: 0.18,
            pointerEvents: "none",
            zIndex: 0,
            objectFit: "contain",
          }}
        />
      </div>

      <div className="card-sobre-app">
        <h3>Sobre o Aplicativo</h3>
        <div className="lista-funcionalidades">
          <button
            className="item-funcionalidade"
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              textAlign: "left",
              width: "100%",
            }}
            onClick={() => navigate("/relatorios")}
          >
            <FaChartLine className="icone-funcionalidade" />
            <p>
              Visualize <strong>relatórios financeiros</strong> detalhados por
              mês.
            </p>
          </button>
          <button
            className="item-funcionalidade"
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              textAlign: "left",
              width: "100%",
            }}
            onClick={() => navigate("/contribuicoes")}
          >
            <FaHandHoldingUsd className="icone-funcionalidade" />
            <p>
              Acompanhe <strong>suas próprias contribuições</strong> e histórico
              financeiro.
            </p>
          </button>
          <button
            className="item-funcionalidade"
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              textAlign: "left",
              width: "100%",
            }}
            onClick={() => navigate("/calendario")}
          >
            <FaCalendarAlt className="icone-funcionalidade" />
            <p>
              Consulte o <strong>calendário de eventos</strong> da igreja e
              fique por dentro da programação.
            </p>
          </button>
        </div>
        <p className="texto-final-app">
          Tudo isso de forma prática, rápida e segura. Explore o menu para
          acessar as funcionalidades!
        </p>
      </div>

      {/* Botão flutuante único para redes sociais */}
      {(() => {
        const [showSocial, setShowSocial] = React.useState(false);
        return (
          <div
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <button
              onClick={() => setShowSocial((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#007bff",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 32,
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "1.1rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              
              <span style={{ display: "flex", gap: 4 }}>
                <img
                  src={logoInstafran}
                  alt="Instagram"
                  style={{ width: 22, height: 22, borderRadius: 5 }}
                />
                <img
                  src={logoWhatsapp}
                  alt="WhatsApp"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    backgroundColor: "white",
                    padding: 2,
                  }}
                />
              </span>
            </button>
            {showSocial && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginTop: 12,
                }}
              >
                <a
                  href="https://www.instagram.com/icesiqueiraice?utm_source=ig_web_button_share_sheet&igsh=MWljbnBxbW9qemc2Zg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#24181cff",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: 24,
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    transition: "background 0.2s",
                  }}
                >
                  <img
                    src={logoInstafran}
                    alt="Instagram"
                    style={{ width: 22, height: 22, borderRadius: 5 }}
                  />{" "}
                  Instagram
                </a>
                <a
                  href="https://wa.me/message/PPUZKEH5DLXIE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#25d366",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: 24,
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    transition: "background 0.2s",
                  }}
                >
                  <img
                    src={logoWhatsapp}
                    alt="WhatsApp"
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 5,
                      backgroundColor: "white",
                      padding: 2,
                    }}
                  />{" "}
                  WhatsApp
                </a>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
