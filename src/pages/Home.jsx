import {
  FaChartLine,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaPrayingHands,
} from "react-icons/fa";
import logo from "../assets/iceslogo12.png";
import "../css/Home.css";
import logoInstafran from "../assets/instagram.png";

export default function Home({ user }) {
  const primeiroNome = user?.nome_membro?.split(" ")[0] || "";
  const cargo = user?.cargos && user.cargos.length > 0 ? user.cargos[0] : "";

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
            {cargo && <span className="cargo-tag"> {cargo}</span>}
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
          <div className="item-funcionalidade">
            <FaChartLine className="icone-funcionalidade" />
            <p>
              Visualize <strong>relatórios financeiros</strong> detalhados por
              mês.
            </p>
          </div>
          <div className="item-funcionalidade">
            <FaHandHoldingUsd className="icone-funcionalidade" />
            <p>
              Acompanhe <strong>suas próprias contribuições</strong> e histórico
              financeiro.
            </p>
          </div>
          <div className="item-funcionalidade">
            <FaCalendarAlt className="icone-funcionalidade" />
            <p>
              Consulte o <strong>calendário de eventos</strong> da igreja e
              fique por dentro da programação.
            </p>
          </div>
        </div>
        <p className="texto-final-app">
          Tudo isso de forma prática, rápida e segura. Explore o menu para
          acessar as funcionalidades!
        </p>
        <div style={{ textAlign: "center", marginTop: 18 }}>
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
              padding: "8px 18px",
              borderRadius: 22,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.2s",
            }}
          >
            <img
              src={logoInstafran}
              alt="Instagram"
              style={{ width: 22, height: 22, borderRadius: 6 }}
            />
            Instagram da Igreja
          </a>
        </div>
      </div>
    </div>
  );
}
