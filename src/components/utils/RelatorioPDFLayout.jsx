import React, { useEffect, useState } from "react";
import { relatoriosAPI } from "../../services/api"; // Verifique se o caminho está correto

export default function RelatorioPDFLayout({
  relatorio: relatorioProp,
  tipo,
  mes,
  ano,
  saldoMesFinanceiro,
}) {
  const [relatorio, setRelatorio] = useState(relatorioProp || null);
  const [loading, setLoading] = useState(!relatorioProp);
  const mesNome = new Date(ano, mes - 1, 1).toLocaleString("pt-BR", {
    month: "long",
  });

  useEffect(() => {
    // Se o relatório não foi passado como prop, busca na API.
    // Isso é útil para testar o layout de forma isolada.
    if (!relatorioProp) {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.access_token) {
        console.error("Usuário não autenticado para gerar PDF.");
        setLoading(false);
        return;
      }
      const apiCall =
        tipo === "detalhado"
          ? relatoriosAPI.getRelatorioFinanceiroDetalhado
          : relatoriosAPI.getRelatorioFinanceiroResumido;

      apiCall(mes, ano, user.access_token)
        .then((data) => setRelatorio(data))
        .catch((err) => {
          console.error("Erro ao buscar dados para o relatório PDF:", err);
          setRelatorio(null); // Define como nulo em caso de erro
        })
        .finally(() => setLoading(false));
    }
  }, [mes, ano, tipo, relatorioProp]);

  // Estados de Carregamento e Erro
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          fontFamily: "Segoe UI, Arial, sans-serif",
        }}
      >
        Carregando dados do relatório...
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 40,
          color: "red",
          fontFamily: "Segoe UI, Arial, sans-serif",
        }}
      >
        Não foi possível carregar os dados para gerar o relatório.
      </div>
    );
  }

  // --- ESTILOS PARA CONTROLE DE PDF ---
  const noBreakInside = { pageBreakInside: "avoid", breakInside: "avoid" };
  const forcePageBreakBefore = {
    pageBreakBefore: "always",
    breakBefore: "page",
  };
  const keepWithNext = { pageBreakAfter: "avoid", breakAfter: "avoid" };

  // --- FUNÇÕES RENDERIZADORAS (para evitar repetição) ---

  const formatValue = (value) =>
    value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ||
    "R$ 0,00";

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });

  // Renderiza uma tabela de transações detalhadas (entradas ou saídas)
  const TabelaDetalhada = ({
    items,
    title,
    headerColor,
    isEntrada = false,
  }) => (
    <div style={{ ...noBreakInside, marginTop: "24px" }}>
      <h3 style={{ color: "#1B3917", ...keepWithNext }}>{title}</h3>
      {items && items.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: headerColor, color: "#fff" }}>
              {isEntrada && (
                <th style={{ padding: 8, textAlign: "left" }}>Membro</th>
              )}
              <th style={{ padding: 8, textAlign: "left" }}>Descrição</th>
              <th style={{ padding: 8, textAlign: "left" }}>Tipo</th>
              <th style={{ padding: 8, textAlign: "left" }}>Data</th>
              <th style={{ padding: 8, textAlign: "right" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={idx}
                style={{ background: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}
              >
                {isEntrada && (
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                    {item.membro_nome || "-"}
                  </td>
                )}
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {item.descricao}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {item.tipo}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {formatDate(item.data)}
                </td>
                <td
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #eee",
                    textAlign: "right",
                  }}
                >
                  {formatValue(item.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: "#888" }}>
          Nenhuma transação encontrada para este período.
        </p>
      )}
    </div>
  );

  // Renderiza uma tabela resumida (entradas por tipo)
  const TabelaResumida = ({ data, title }) => (
    <div style={{ ...noBreakInside, marginTop: "24px" }}>
      <h3 style={{ color: "#1B3917", ...keepWithNext }}>{title}</h3>
      {data && Object.keys(data).length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1B3917", color: "#fff" }}>
              <th style={{ padding: 8, textAlign: "left" }}>Tipo</th>
              <th style={{ padding: 8, textAlign: "right" }}>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([tipo, valor], idx) => (
              <tr
                key={tipo}
                style={{ background: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}
              >
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {tipo}
                </td>
                <td
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #eee",
                    textAlign: "right",
                  }}
                >
                  {formatValue(valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: "#888" }}>Nenhuma entrada por tipo encontrada.</p>
      )}
    </div>
  );

  // Componente para renderizar os cards de resumo
  const ResumoCard = ({ title, value }) => (
    <div
      style={{
        flex: 1,
        background: "#f4f8fb",
        borderRadius: 10,
        padding: 16,
        textAlign: "center",
      }}
    >
      <strong
        style={{
          display: "block",
          marginBottom: "4px",
          fontSize: "0.9rem",
          color: "#555",
        }}
      >
        {title}
      </strong>
      <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#222" }}>
        {formatValue(value)}
      </span>
    </div>
  );

  // --- LAYOUT PRINCIPAL DO PDF ---
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        background: "#fff",
        color: "#333",
        maxWidth: 800,
        margin: "0 auto",
        padding: 32,
      }}
    >
      {/* SEÇÃO 1: FINANCEIRO */}
      <div style={noBreakInside}>
        <h2
          style={{
            color: "#1B3917",
            fontWeight: 700,
            fontSize: "2rem",
            ...keepWithNext,
          }}
        >
          Relatório Financeiro - {mesNome} de {ano}
        </h2>
        <div style={{ marginBottom: 24 }}>
          <span
            style={{ fontWeight: 600, color: "#FD6B08", fontSize: "1.2rem" }}
          >
            Saldo do Mês: {formatValue(saldoMesFinanceiro)}
          </span>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <ResumoCard
            title="Saldo Anterior"
            value={relatorio.saldo_anterior_financeiro}
          />
          <ResumoCard title="Total Entradas" value={relatorio.total_entradas} />
          <ResumoCard title="Total Saídas" value={relatorio.total_saidas} />
          <ResumoCard
            title="Saldo Final"
            value={relatorio.saldo_atual_financeiro}
          />
        </div>

        {tipo === "detalhado" ? (
          <TabelaDetalhada
            items={relatorio.entradas}
            title="Entradas Financeiras"
            headerColor="#1B3917"
            isEntrada
          />
        ) : (
          <TabelaResumida
            data={relatorio.entradas_por_tipo}
            title="Entradas Financeiras (Resumo por Tipo)"
          />
        )}
        <TabelaDetalhada
          items={relatorio.saidas}
          title="Saídas Financeiras"
          headerColor="#FD6B08"
        />
      </div>

      {/* SEÇÃO 2: MISSIONÁRIO - Força nova página */}
      <div style={{ ...forcePageBreakBefore, ...noBreakInside }}>
        <h2
          style={{
            color: "#1B3917",
            fontWeight: 700,
            fontSize: "1.8rem",
            ...keepWithNext,
          }}
        >
          Relatório de Missões
        </h2>
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <ResumoCard
            title="Saldo Anterior"
            value={relatorio.saldo_anterior_missoes}
          />
          <ResumoCard
            title="Total Entradas"
            value={relatorio.total_entradas_missoes}
          />
          <ResumoCard
            title="Total Saídas"
            value={relatorio.total_saidas_missoes}
          />
          <ResumoCard
            title="Saldo Final"
            value={relatorio.saldo_atual_missoes}
          />
        </div>

        {tipo === "detalhado" ? (
          <TabelaDetalhada
            items={relatorio.entradas_missoes}
            title="Entradas de Missões"
            headerColor="#1B3917"
            isEntrada
          />
        ) : (
          <TabelaResumida
            data={relatorio.entradas_missoes_por_tipo}
            title="Entradas de Missões (Resumo por Tipo)"
          />
        )}
        <TabelaDetalhada
          items={relatorio.saidas_missoes}
          title="Saídas de Missões"
          headerColor="#FD6B08"
        />
      </div>

      {/* SEÇÃO 3: PROJETOS - Força nova página */}
      <div style={{ ...forcePageBreakBefore, ...noBreakInside }}>
        <h2
          style={{
            color: "#1B3917",
            fontWeight: 700,
            fontSize: "1.8rem",
            ...keepWithNext,
          }}
        >
          Relatório de Projetos
        </h2>
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <ResumoCard
            title="Saldo Anterior"
            value={relatorio.saldo_anterior_projetos}
          />
          <ResumoCard
            title="Total Entradas"
            value={relatorio.total_entradas_projetos}
          />
          <ResumoCard
            title="Total Saídas"
            value={relatorio.total_saidas_projetos}
          />
          <ResumoCard
            title="Saldo Final"
            value={relatorio.saldo_atual_projetos}
          />
        </div>

        {tipo === "detalhado" ? (
          <TabelaDetalhada
            items={relatorio.entradas_projetos}
            title="Entradas de Projetos"
            headerColor="#1B3917"
            isEntrada
          />
        ) : (
          <TabelaResumida
            data={relatorio.entradas_projetos_por_tipo}
            title="Entradas de Projetos (Resumo por Tipo)"
          />
        )}
        <TabelaDetalhada
          items={relatorio.saidas_projetos}
          title="Saídas de Projetos"
          headerColor="#FD6B08"
        />
      </div>

      {/* Rodapé Final */}
      <div
        style={{
          marginTop: 45,
          textAlign: "center",
          color: "#555",
          fontSize: "0.9rem",
          paddingTop: 20,
          borderTop: "1px solid #eee",
          ...noBreakInside,
        }}
      >
        Relatório gerado por Igreja Cristã Evangélica Siqueira
      </div>
    </div>
  );
}
