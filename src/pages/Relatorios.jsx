import { useEffect, useState } from "react";
import { relatoriosAPI } from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
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
    relatoriosAPI.getRelatorioFinanceiroResumido(m, a, user.access_token)
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
  const saldoFinalFinanceiro = relatorio
    ? relatorio.saldo_anterior_financeiro + saldoMesFinanceiro
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

          <div className="summary-grid">
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
                  {formatCurrency(saldoFinalFinanceiro)}
                </span>
              </div>
            </div>
          </div>

          <section className="report-section">
            <div className="report-section__header">
              <HeartHandshake className="section-icon" size={24} />
              <h4>Detalhes Financeiros</h4>
              <span className="saldo-anterior">
                Saldo Anterior:{" "}
                {formatCurrency(relatorio.saldo_anterior_financeiro)}
              </span>
            </div>
            <div className="report-section__body">
              <div className="details-block">
                <h5>Entradas</h5>
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

          <section className="report-section">
            <div className="report-section__header">
              <Rocket className="section-icon" size={24} />
              <h4>Detalhes de Missões</h4>
              <span className="saldo-anterior">
                Saldo Anterior:{" "}
                {formatCurrency(relatorio.saldo_anterior_missoes)}
              </span>
            </div>
            <div className="report-section__body">
              <div className="details-block">
                <h5>Entradas</h5>
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

          <section className="report-section">
            <div className="report-section__header">
              <Landmark className="section-icon" size={24} />
              <h4>Detalhes de Projetos</h4>
              <span className="saldo-anterior">
                Saldo Anterior:{" "}
                {formatCurrency(relatorio.saldo_anterior_projetos)}
              </span>
            </div>
            <div className="report-section__body">
              <div className="details-block">
                <h5>Entradas</h5>
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
        </div>
      )}
    </div>
  );
}

// Componente auxiliar que renderiza a tabela E a lista responsiva.
// O CSS controlará qual deles é exibido.
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
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((s) => (
              <tr key={s.id}>
                <td>{s.descricao}</td>
                <td>{s.tipo}</td>
                <td>{formatDate(s.data)}</td>
                <td className="currency">{formatCurrency(s.valor)}</td>
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
              <span className="transaction-card__value">
                {formatCurrency(s.valor)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
