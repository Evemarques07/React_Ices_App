import { useEffect, useState } from "react";
import { relatoriosAPI } from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
import ScrollToTopButton from "../components/utils/ScrollToTopButton";
// Importando ícones para uma UI mais rica
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Banknote,
  Landmark,
  Rocket,
  HeartHandshake,
} from "lucide-react";
import "../css/Relatorios.css";

export default function Relatorios() {
  // Verifica se o usuário tem cargos
  const user = JSON.parse(localStorage.getItem("user"));
  const cargos = user?.cargos || [];
  const temCargo = Array.isArray(cargos) && cargos.length > 0;
  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [ano, setAno] = useState(now.getFullYear());
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function buscarRelatorio(m, a) {
    setLoading(true);
    setError("");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.access_token) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }
    const cargos = user.cargos || [];
    const temCargo = Array.isArray(cargos) && cargos.length > 0;
    const apiCall = temCargo
      ? relatoriosAPI.getRelatorioFinanceiroDetalhado
      : relatoriosAPI.getRelatorioFinanceiroResumido;

    apiCall(m, a, user.access_token)
      .then(setRelatorio)
      .catch(() => setError("Erro ao buscar relatório financeiro"))
      .finally(() => setLoading(false));

  }

  useEffect(() => {
    buscarRelatorio(mes, ano);
    // eslint-disable-next-line
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    buscarRelatorio(mes, ano);
  }

  // Cálculos para os cards de resumo
  const saldoMesFinanceiro = relatorio
    ? relatorio.total_entradas - relatorio.total_saidas
    : 0;

  return (
    <div className="container-principal relatorios-page">
      <h2>Relatório Financeiro</h2>

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="mes">Mês:</label>
          <select
            id="mes"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="form-input"
          >
            {[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ].map((nome, idx) => (
              <option key={nome} value={idx + 1}>
                {nome}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="ano">Ano:</label>
          <input
            id="ano"
            type="number"
            min={1900}
            max={2100}
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {loading && <p className="loading-message">Carregando relatório...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && relatorio && (
        <div className="relatorio-content">
          <h3 className="report-period">
            Resumo de {String(relatorio.mes).padStart(2, "0")}/{relatorio.ano}
          </h3>

          {/* --- GRID DE RESUMO GERAL --- */}
          <div className="summary-grid">
            {/* Cards de Resumo (Entradas, Saídas, Saldo do Mês, Saldo Final) */}
            <div className="summary-card income">
              <ArrowUpCircle size={28} className="summary-card__icon" />
              <div className="summary-card__details">
                <span className="summary-card__title">Total Entradas</span>
                <span className="summary-card__value">
                  {formatCurrency(relatorio.total_entradas)}
                </span>
              </div>
            </div>
            <div className="summary-card expense">
              <ArrowDownCircle size={28} className="summary-card__icon" />
              <div className="summary-card__details">
                <span className="summary-card__title">Total Saídas</span>
                <span className="summary-card__value">
                  {formatCurrency(relatorio.total_saidas)}
                </span>
              </div>
            </div>
            <div
              className={`summary-card balance ${
                saldoMesFinanceiro >= 0 ? "positive" : "negative"
              }`}
            >
              <Banknote size={28} className="summary-card__icon" />
              <div className="summary-card__details">
                <span className="summary-card__title">Saldo do Mês</span>
                <span className="summary-card__value">
                  {formatCurrency(saldoMesFinanceiro)}
                </span>
              </div>
            </div>
            <div className="summary-card final-balance">
              <Landmark size={28} className="summary-card__icon" />
              <div className="summary-card__details">
                <span className="summary-card__title">
                  Saldo Final (Financeiro)
                </span>
                <span className="summary-card__value">
                  {formatCurrency(relatorio.saldo_atual_financeiro)}
                </span>
              </div>
            </div>
          </div>

          {/* --- [VISÃO DETALHADA - APENAS PARA USUÁRIOS COM CARGO] --- */}
          {temCargo && (
            <>
              {/* === DETALHES FINANCEIROS (DETALHADO) === */}
              <section className="report-section detailed-view">
                <div className="report-section__header">
                  <HeartHandshake className="section-icon" size={24} />
                  <h4>Detalhes Financeiros</h4>
                  <span className="saldo-info">
                    Saldo Anterior:{" "}
                    {formatCurrency(relatorio.saldo_anterior_financeiro)}
                    <br />
                    Total de Entradas:{" "}
                    {formatCurrency(relatorio.total_entradas)}
                    <br />
                    Total de Saídas:{" "}
                    {formatCurrency(relatorio.total_saidas)}
                    <br />
                    <br />
                    <strong>
                      Saldo Final:{" "}
                      {formatCurrency(relatorio.saldo_atual_financeiro)}
                    </strong>
                  </span>
                </div>
                {/* Entradas Financeiras */}
                <div className="details-block-header">
                  <h5>Entradas Financeiras</h5>
                </div>
                <div className="report-section__body full-width">
                  <TransactionTable
                    transactions={relatorio.entradas}
                    type="entrada"
                  />
                </div>
                {/* Saídas Financeiras */}
                <div className="details-block-header">
                  <h5>Saídas Financeiras</h5>
                </div>
                <div className="report-section__body full-width">
                  <TransactionList transactions={relatorio.saidas} />
                </div>
              </section>

              {/* === DETALHES DE MISSÕES (DETALHADO) === */}
              <section className="report-section detailed-view">
                <div className="report-section__header">
                  <Rocket className="section-icon" size={24} />
                  <h4>Detalhes de Missões</h4>
                  <span className="saldo-info">
                    Saldo Anterior:{" "}
                    {formatCurrency(relatorio.saldo_anterior_missoes)}
                    <br />
                    Total de Entradas:{" "}
                    {formatCurrency(relatorio.total_entradas_missoes)}
                    <br />
                    Total de Saídas:{" "}
                    {formatCurrency(relatorio.total_saidas_missoes)}
                    <br />
                    <br />
                    <strong>
                      Saldo Final:{" "}
                      {formatCurrency(relatorio.saldo_atual_missoes)}
                    </strong>
                  </span>
                </div>
                {/* Entradas de Missões */}
                <div className="details-block-header">
                  <h5>Entradas de Missões</h5>
                </div>
                <div className="report-section__body full-width">
                  <TransactionTable
                    transactions={relatorio.entradas_missoes}
                    type="entrada"
                  />
                </div>
                {/* Saídas de Missões */}
                <div className="details-block-header">
                  <h5>Saídas de Missões</h5>
                </div>
                <div className="report-section__body full-width">
                  <TransactionList transactions={relatorio.saidas_missoes} />
                </div>
              </section>

              {/* === DETALHES DE PROJETOS (DETALHADO) === */}
              <section className="report-section detailed-view">
                <div className="report-section__header">
                  <Landmark className="section-icon" size={24} />
                  <h4>Detalhes de Projetos</h4>
                  <span className="saldo-info">
                    Saldo Anterior:{" "}
                    {formatCurrency(relatorio.saldo_anterior_projetos)}
                    <br />
                    Total de Entradas:{" "}
                    {formatCurrency(relatorio.total_entradas_projetos)}
                    <br />
                    Total de Saídas:{" "}
                    {formatCurrency(relatorio.total_saidas_projetos)}
                    <br />
                    <br />
                    <strong>
                      Saldo Final:{" "}
                      {formatCurrency(relatorio.saldo_atual_projetos)}
                    </strong>
                  </span>
                </div>
                {/* Entradas de Projetos */}
                <div className="details-block-header">
                  <h5>Entradas de Projetos</h5>
                </div>
                <div className="report-section__body full-width">
                  <TransactionTable
                    transactions={relatorio.entradas_projetos}
                    type="entrada"
                  />
                </div>
                {/* Saídas de Projetos */}
                <div className="details-block-header">
                  <h5>Saídas de Projetos</h5>
                </div>
                <div className="report-section__body full-width">
                  <TransactionList transactions={relatorio.saidas_projetos} />
                </div>
              </section>
            </>
          )}

          {/* --- [VISÃO RESUMIDA - PARA TODOS OS USUÁRIOS (NÃO ADMINISTRADORES)] --- */}
          {!temCargo && (
            <>
              {/* Detalhes Financeiros (Resumido) */}
              <section className="report-section">
                <div className="report-section__header">
                  <HeartHandshake className="section-icon" size={24} />
                  <h4>Detalhes Financeiros</h4>
                  <span className="saldo-info">
                    Saldo Anterior:{" "}
                    {formatCurrency(relatorio.saldo_anterior_financeiro)}
                    <br />
                    <strong>
                      Saldo Final:{" "}
                      {formatCurrency(relatorio.saldo_atual_financeiro)}
                    </strong>
                  </span>
                </div>
                <div className="report-section__body">
                  <div className="details-block">
                    <h5>Entradas por Tipo</h5>
                    <ul className="breakdown-list">
                      {Object.entries(relatorio.entradas_por_tipo || {}).map(
                        ([tipo, valor]) => (
                          <li key={tipo}>
                            <span>{tipo}</span>
                            <strong>{formatCurrency(valor)}</strong>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="details-block">
                    <h5>Saídas</h5>
                    <TransactionList transactions={relatorio.saidas} />
                  </div>
                </div>
              </section>

              {/* Detalhes de Missões (Resumido) */}
              <section className="report-section">
                <div className="report-section__header">
                  <Rocket className="section-icon" size={24} />
                  <h4>Detalhes de Missões</h4>
                  <span className="saldo-info">
                    Saldo Anterior:{" "}
                    {formatCurrency(relatorio.saldo_anterior_missoes)}
                    <br />
                    <strong>
                      Saldo Final:{" "}
                      {formatCurrency(relatorio.saldo_atual_missoes)}
                    </strong>
                  </span>
                </div>
                <div className="report-section__body">
                  <div className="details-block">
                    <h5>Entradas por Tipo</h5>
                    <ul className="breakdown-list">
                      {Object.entries(
                        relatorio.entradas_missoes_por_tipo || {}
                      ).map(([tipo, valor]) => (
                        <li key={tipo}>
                          <span>{tipo}</span>
                          <strong>{formatCurrency(valor)}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="details-block">
                    <h5>Saídas</h5>
                    <TransactionList transactions={relatorio.saidas_missoes} />
                  </div>
                </div>
              </section>

              {/* Detalhes de Projetos (Resumido) */}
              <section className="report-section">
                <div className="report-section__header">
                  <Landmark className="section-icon" size={24} />
                  <h4>Detalhes de Projetos</h4>
                  <span className="saldo-info">
                    Saldo Anterior:{" "}
                    {formatCurrency(relatorio.saldo_anterior_projetos)}
                    <br />
                    <strong>
                      Saldo Final:{" "}
                      {formatCurrency(relatorio.saldo_atual_projetos)}
                    </strong>
                  </span>
                </div>
                <div className="report-section__body">
                  <div className="details-block">
                    <h5>Entradas por Tipo</h5>
                    <ul className="breakdown-list">
                      {Object.entries(
                        relatorio.entradas_projetos_por_tipo || {}
                      ).map(([tipo, valor]) => (
                        <li key={tipo}>
                          <span>{tipo}</span>
                          <strong>{formatCurrency(valor)}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="details-block">
                    <h5>Saídas</h5>
                    <TransactionList transactions={relatorio.saidas_projetos} />
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      )}
      <ScrollToTopButton size={60} />
    </div>
  );
}

// Componente para a tabela detalhada (visão de administrador)
const TransactionTable = ({ transactions, type = "entrada" }) => {
  if (!transactions || transactions.length === 0) {
    return <p className="no-data-message">Nenhuma transação no período.</p>;
  }
  return (
    <>
      {/* Tabela para telas grandes */}
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Data</th>
              {type === "entrada" && <th>Membro</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((e) => (
              <tr key={e.id}>
                <td className={`currency ${type}`}>
                  {formatCurrency(e.valor)}
                </td>
                <td>{e.tipo}</td>
                <td>{e.descricao}</td>
                <td>{formatDate(e.data)}</td>
                {type === "entrada" && <td>{e.membro_nome || "-"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards para telas pequenas */}
      <div className="transactions-list-container">
        {transactions.map((e) => (
          <div key={e.id} className="transaction-card">
            <div className="transaction-card__main">
              <span className="transaction-card__description">
                {e.descricao}
              </span>
              <span className="transaction-card__type">{e.tipo}</span>
              {type === "entrada" && (
                <span className="transaction-card__member">
                  {e.membro_nome || "-"}
                </span>
              )}
            </div>
            <div className="transaction-card__meta">
              <span className="transaction-card__date">
                {formatDate(e.data)}
              </span>
              <span className={`transaction-card__value ${type}`}>
                {formatCurrency(e.valor)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

// Componente auxiliar para Saídas (resumo e detalhado) que renderiza tabela ou cards
const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <p className="no-data-message">Nenhuma transação no período.</p>;
  }
  return (
    <>
      {/* Estrutura de Tabela para telas > 820px */}
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Data</th>
              <th style={{ textAlign: "right" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((s) => (
              <tr key={s.id}>
                <td>{s.descricao}</td>
                <td>{s.tipo}</td>
                <td>{formatDate(s.data)}</td>
                <td className="currency saida">{formatCurrency(s.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estrutura de Cards para telas <= 820px */}
      <div className="transactions-list-container">
        {transactions.map((s) => (
          <div key={s.id} className="transaction-card">
            <div className="transaction-card__main">
              <span className="transaction-card__description">
                {s.descricao}
              </span>
              <span className="transaction-card__type">{s.tipo}</span>
            </div>
            <div className="transaction-card__meta">
              <span className="transaction-card__date">
                {formatDate(s.data)}
              </span>
              <span className="transaction-card__value saida">
                {formatCurrency(s.valor)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
