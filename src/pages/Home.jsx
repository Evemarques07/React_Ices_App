import {
  FaChartLine,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaPrayingHands,
} from "react-icons/fa";
import logo from "../assets/iceslogo12.png";
import "../css/Home.css";
import logoInstafran from "../assets/instagram.png";
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
        <div className="logo-home-bg">
          <img src={logo} alt="Logo da Aplicação" className="logo-home" />
        </div>
        <h2 className="titulo-boas-vindas">
          <p className="saudacao">Bem-vindo,</p>
          <p className="nome-usuario-home">
            {primeiroNome || "usuário"}
              {cargoRaw && <span className="cargo-tag"> {getCargoName(cargoRaw)}</span>}
          </p>
        </h2>
        <p className="texto-boas-vindas">
          Estamos felizes em tê-lo(a) conosco. Explore as ferramentas que
          preparamos para você!
        </p>
        <FaPrayingHands className="icon-boas-vindas-fundo" />
      </div>

      <div className="card-sobre-app">
        <h3>Sobre o Aplicativo</h3>
        <div className="lista-funcionalidades">
          <button
            className="item-funcionalidade"
            style={{ cursor: "pointer", background: "none", border: "none", textAlign: "left", width: "100%" }}
            onClick={() => navigate("/relatorios")}
          >
            <FaChartLine className="icone-funcionalidade" />
            <p>
              Visualize <strong>relatórios financeiros</strong> detalhados por mês.
            </p>
          </button>
          <button
            className="item-funcionalidade"
            style={{ cursor: "pointer", background: "none", border: "none", textAlign: "left", width: "100%" }}
            onClick={() => navigate("/contribuicoes")}
          >
            <FaHandHoldingUsd className="icone-funcionalidade" />
            <p>
              Acompanhe <strong>suas próprias contribuições</strong> e histórico financeiro.
            </p>
          </button>
          <button
            className="item-funcionalidade"
            style={{ cursor: "pointer", background: "none", border: "none", textAlign: "left", width: "100%" }}
            onClick={() => navigate("/calendario")}
          >
            <FaCalendarAlt className="icone-funcionalidade" />
            <p>
              Consulte o <strong>calendário de eventos</strong> da igreja e fique por dentro da programação.
            </p>
          </button>
        </div>
        <p className="texto-final-app">
          Tudo isso de forma prática, rápida e segura. Explore o menu para
          acessar as funcionalidades!
        </p>
      </div>

      {/* Botão flutuante do Instagram */}
      <a
        href="https://www.instagram.com/icesiqueiraice?utm_source=ig_web_button_share_sheet&igsh=MWljbnBxbW9qemc2Zg=="
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#24181cff",
          color: "#fff",
          padding: "12px 22px",
          borderRadius: 28,
          fontWeight: 600,
          textDecoration: "none",
          fontSize: "1rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          transition: "background 0.2s",
        }}
      >
        <img
          src={logoInstafran}
          alt="Instagram"
          style={{ width: 26, height: 26, borderRadius: 6 }}
        />
        Instagram da Igreja
      </a>
    </div>
  );
}
