import {
  FaChartLine,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaPrayingHands,
} from "react-icons/fa";
import logo from "../assets/iceslogo12.png";
import "../css/Home.css";

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
      </div>
    </div>
  );
}
