import {
  FaChartLine,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaPrayingHands,
} from "react-icons/fa";
import logo from "../assets/logo.png"; // Importando a logo
import "../css/Home.css";

export default function Home({ user }) {
  const primeiroNome = user?.nome_membro?.split(" ")[0] || "";
  const cargo = user?.cargos && user.cargos.length > 0 ? user.cargos[0] : "";

  return (
    <div className="container-principal">
      <div className="card-boas-vindas">
        {/* Adicionando a logo aqui */}
        <img src={logo} alt="Logo da Aplicação" className="logo-home" />
        <h2>
          <p>Bem-vindo,</p>
          <br />
          <p className="nome-usuario-home" style={{ margin: 0 }}>
            {primeiroNome || "usuário"}!
          </p>
        </h2>
        <p className="texto-boas-vindas">
          Estamos felizes em tê-lo(a) conosco. Explore as ferramentas que
          preparamos para você!
        </p>
        <FaPrayingHands className="icon-boas-vindas-fundo" />{" "}
        {/* Mudei este ícone para ser um elemento de fundo decorativo */}
      </div>

      <div className="card-sobre-app">
        <h3>Sobre o aplicativo</h3>
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
