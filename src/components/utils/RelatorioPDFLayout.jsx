import React, { useEffect, useState } from "react";
import { relatoriosAPI } from "../../services/api";
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
    if (!relatorioProp) {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.access_token) {
        setLoading(false);
        return;
      }
      const apiCall =
        tipo === "detalhado"
          ? relatoriosAPI.getRelatorioFinanceiroDetalhado
          : relatoriosAPI.getRelatorioFinanceiroResumido;
      apiCall(mes, ano, user.access_token)
        .then((data) => setRelatorio(data))
        .finally(() => setLoading(false));
    }
  }, [mes, ano, tipo, relatorioProp]);

  if (loading || !relatorio) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        Carregando relatório...
      </div>
    );
  }

  // Estilos reutilizáveis para controle de quebra de página
  const noBreakInside = {
    pageBreakInside: "avoid",
    breakInside: "avoid",
  };

  // keepWithNext agora é menos necessário se estivermos agrupando títulos com tabelas em um div,
  // mas ainda útil para elementos como o Saldo do Mês que devem ficar com o conteúdo seguinte.
  const keepWithNext = {
    pageBreakAfter: "avoid",
    breakAfter: "avoid",
  };

  // ...existing code...
  return (
    <div
      style={{
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: "#fff",
        color: "#222",
        maxWidth: 800,
        margin: "0 auto",
        borderRadius: 16,
        boxShadow: "0 6px 30px #0002",
        padding: 32,
        border: "1.5px solid #e0e7ef",
      }}
    >
      {/* FINANCEIRO */}
      <h2
        style={{
          color: "#1B3917",
          fontWeight: 700,
          fontSize: "2rem",
          marginBottom: 8,
          ...keepWithNext, // Título principal deve ficar com o resumo
        }}
      >
        Relatório Financeiro - {mesNome}/{ano}
      </h2>
      <div style={{ marginBottom: 24, ...keepWithNext }}>
        {" "}
        {/* Saldo do Mês deve ficar com o resumo */}
        <span style={{ fontWeight: 600, color: "#FD6B08", fontSize: "1.2rem" }}>
          Saldo do Mês:{" "}
          {saldoMesFinanceiro?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>

      {/* Bloco de resumo financeiro - Evitar quebra de página no meio dele */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          ...noBreakInside,
          ...keepWithNext,
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Total Entradas:</strong>
          <br />
          {relatorio.total_entradas?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Total Saídas:</strong>
          <br />
          {relatorio.total_saidas?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Saldo Final:</strong>
          <br />
          {relatorio.saldo_atual_financeiro?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      </div>

      {/* Tabela de Entradas Financeiras - Agrupada com o título para evitar quebras */}
      <div style={{ marginBottom: 24, ...noBreakInside }}>
        <h3 style={{ color: "#1B3917", marginTop: 24 }}>
          Entradas Financeiras
        </h3>
        {tipo === "detalhado" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1B3917", color: "#fff" }}>
                <th style={{ padding: 8 }}>Valor</th>
                <th style={{ padding: 8 }}>Tipo</th>
                <th style={{ padding: 8 }}>Descrição</th>
                <th style={{ padding: 8 }}>Data</th>
                <th style={{ padding: 8 }}>Membro</th>
              </tr>
            </thead>
            <tbody>
              {(relatorio.entradas || []).map((e, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                    ...noBreakInside,
                  }}
                >
                  <td style={{ padding: 8 }}>
                    {e.valor?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td style={{ padding: 8 }}>{e.tipo}</td>
                  <td style={{ padding: 8 }}>{e.descricao}</td>
                  <td style={{ padding: 8 }}>
                    {new Date(e.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td style={{ padding: 8 }}>{e.membro_nome || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1B3917", color: "#fff" }}>
                <th style={{ padding: 8 }}>Tipo</th>
                <th style={{ padding: 8 }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.entradas_por_tipo &&
              typeof relatorio.entradas_por_tipo === "object" &&
              Object.values(relatorio.entradas_por_tipo).some(
                (v) => v !== undefined && v !== null
              ) ? (
                Object.entries(relatorio.entradas_por_tipo).map(
                  ([tipo, valor], idx) => (
                    <tr
                      key={tipo}
                      style={{
                        background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                        ...noBreakInside,
                      }}
                    >
                      <td style={{ padding: 8 }}>{tipo}</td>
                      <td style={{ padding: 8 }}>
                        {valor?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    style={{ padding: 8, textAlign: "center", color: "#888" }}
                  >
                    Nenhuma entrada por tipo encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Tabela de Saídas Financeiras - Agrupada com o título para evitar quebras */}
      <div style={{ marginBottom: 24, ...noBreakInside }}>
        <h3 style={{ color: "#1B3917", marginTop: 24 }}>Saídas Financeiras</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FD6B08", color: "#fff" }}>
              <th style={{ padding: 8 }}>Descrição</th>
              <th style={{ padding: 8 }}>Tipo</th>
              <th style={{ padding: 8 }}>Data</th>
              <th style={{ padding: 8 }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {(relatorio.saidas || []).map((s, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                  ...noBreakInside,
                }}
              >
                <td style={{ padding: 8 }}>{s.descricao}</td>
                <td style={{ padding: 8 }}>{s.tipo}</td>
                <td style={{ padding: 8 }}>
                  {new Date(s.data).toLocaleDateString("pt-BR")}
                </td>
                <td style={{ padding: 8 }}>
                  {s.valor?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MISSIONÁRIO */}
      <h2
        style={{
          color: "#1B3917",
          fontWeight: 700,
          fontSize: "1.7rem",
          marginTop: 40,
          marginBottom: 8,
          pageBreakBefore: "always", // Força quebra de página
          breakBefore: "page", // Para navegadores modernos
        }}
      >
        Relatório Missionário
      </h2>
      {/* Bloco de resumo missionário - Evitar quebra de página no meio dele */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          ...noBreakInside,
          ...keepWithNext,
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Saldo Anterior:</strong>
          <br />
          {relatorio.saldo_anterior_missoes?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Total Entradas:</strong>
          <br />
          {relatorio.total_entradas_missoes?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Total Saídas:</strong>
          <br />
          {relatorio.total_saidas_missoes?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Saldo Final:</strong>
          <br />
          {relatorio.saldo_atual_missoes?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      </div>

      {/* Tabela de Entradas Missões - Agrupada com o título para evitar quebras */}
      <div style={{ marginBottom: 24, ...noBreakInside }}>
        <h3 style={{ color: "#1B3917", marginTop: 24 }}>Entradas de Missões</h3>
        {tipo === "detalhado" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1B3917", color: "#fff" }}>
                <th style={{ padding: 8 }}>Valor</th>
                <th style={{ padding: 8 }}>Tipo</th>
                <th style={{ padding: 8 }}>Descrição</th>
                <th style={{ padding: 8 }}>Data</th>
                <th style={{ padding: 8 }}>Membro</th>
              </tr>
            </thead>
            <tbody>
              {(relatorio.entradas_missoes || []).map((e, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                    ...noBreakInside,
                  }}
                >
                  <td style={{ padding: 8 }}>
                    {e.valor?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td style={{ padding: 8 }}>{e.tipo}</td>
                  <td style={{ padding: 8 }}>{e.descricao}</td>
                  <td style={{ padding: 8 }}>
                    {new Date(e.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td style={{ padding: 8 }}>{e.membro_nome || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1B3917", color: "#fff" }}>
                <th style={{ padding: 8 }}>Tipo</th>
                <th style={{ padding: 8 }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.entradas_missoes_por_tipo &&
              typeof relatorio.entradas_missoes_por_tipo === "object" &&
              Object.values(relatorio.entradas_missoes_por_tipo).some(
                (v) => v !== undefined && v !== null
              ) ? (
                Object.entries(relatorio.entradas_missoes_por_tipo).map(
                  ([tipo, valor], idx) => (
                    <tr
                      key={tipo}
                      style={{
                        background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                        ...noBreakInside,
                      }}
                    >
                      <td style={{ padding: 8 }}>{tipo}</td>
                      <td style={{ padding: 8 }}>
                        {valor?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    style={{ padding: 8, textAlign: "center", color: "#888" }}
                  >
                    Nenhuma entrada por tipo encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Tabela de Saídas Missões - Agrupada com o título para evitar quebras */}
      <div style={{ marginBottom: 24, ...noBreakInside }}>
        <h3 style={{ color: "#1B3917", marginTop: 24 }}>Saídas de Missões</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FD6B08", color: "#fff" }}>
              <th style={{ padding: 8 }}>Descrição</th>
              <th style={{ padding: 8 }}>Tipo</th>
              <th style={{ padding: 8 }}>Data</th>
              <th style={{ padding: 8 }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {(relatorio.saidas_missoes || []).map((s, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                  ...noBreakInside,
                }}
              >
                <td style={{ padding: 8 }}>{s.descricao}</td>
                <td style={{ padding: 8 }}>{s.tipo}</td>
                <td style={{ padding: 8 }}>
                  {new Date(s.data).toLocaleDateString("pt-BR")}
                </td>
                <td style={{ padding: 8 }}>
                  {s.valor?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PROJETOS */}
      <h2
        style={{
          color: "#1B3917",
          fontWeight: 700,
          fontSize: "1.7rem",
          marginTop: 40,
          marginBottom: 8,
          pageBreakBefore: "always",
          breakBefore: "page",
        }}
      >
        Relatório de Projetos
      </h2>
      {/* Bloco de resumo de projetos - Evitar quebra de página no meio dele */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          ...noBreakInside,
          ...keepWithNext,
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Saldo Anterior:</strong>
          <br />
          {relatorio.saldo_anterior_projetos?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Total Entradas:</strong>
          <br />
          {relatorio.total_entradas_projetos?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Total Saídas:</strong>
          <br />
          {relatorio.total_saidas_projetos?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f4f8fb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <strong>Saldo Final:</strong>
          <br />
          {relatorio.saldo_atual_projetos?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      </div>

      {/* Tabela de Entradas Projetos - Agrupada com o título para evitar quebras */}
      <div style={{ marginBottom: 24, ...noBreakInside }}>
        <h3 style={{ color: "#1B3917", marginTop: 24 }}>
          Entradas de Projetos
        </h3>
        {tipo === "detalhado" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1B3917", color: "#fff" }}>
                <th style={{ padding: 8 }}>Valor</th>
                <th style={{ padding: 8 }}>Tipo</th>
                <th style={{ padding: 8 }}>Descrição</th>
                <th style={{ padding: 8 }}>Data</th>
                <th style={{ padding: 8 }}>Membro</th>
              </tr>
            </thead>
            <tbody>
              {(relatorio.entradas_projetos || []).map((e, idx) => (
                <tr
                  key={idx}
                  style={{
                    background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                    ...noBreakInside,
                  }}
                >
                  <td style={{ padding: 8 }}>
                    {e.valor?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td style={{ padding: 8 }}>{e.tipo}</td>
                  <td style={{ padding: 8 }}>{e.descricao}</td>
                  <td style={{ padding: 8 }}>
                    {new Date(e.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td style={{ padding: 8 }}>{e.membro_nome || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1B3917", color: "#fff" }}>
                <th style={{ padding: 8 }}>Tipo</th>
                <th style={{ padding: 8 }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.entradas_projetos_por_tipo &&
              typeof relatorio.entradas_projetos_por_tipo === "object" &&
              Object.values(relatorio.entradas_projetos_por_tipo).some(
                (v) => v !== undefined && v !== null
              ) ? (
                Object.entries(relatorio.entradas_projetos_por_tipo).map(
                  ([tipo, valor], idx) => (
                    <tr
                      key={tipo}
                      style={{
                        background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                        ...noBreakInside,
                      }}
                    >
                      <td style={{ padding: 8 }}>{tipo}</td>
                      <td style={{ padding: 8 }}>
                        {valor?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    style={{ padding: 8, textAlign: "center", color: "#888" }}
                  >
                    Nenhuma entrada por tipo encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Tabela de Saídas Projetos - Agrupada com o título para evitar quebras */}
      <div style={{ marginBottom: 24, ...noBreakInside }}>
        <h3 style={{ color: "#1B3917", marginTop: 24 }}>Saídas de Projetos</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FD6B08", color: "#fff" }}>
              <th style={{ padding: 8 }}>Descrição</th>
              <th style={{ padding: 8 }}>Tipo</th>
              <th style={{ padding: 8 }}>Data</th>
              <th style={{ padding: 8 }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {(relatorio.saidas_projetos || []).map((s, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                  ...noBreakInside,
                }}
              >
                <td style={{ padding: 8 }}>{s.descricao}</td>
                <td style={{ padding: 8 }}>{s.tipo}</td>
                <td style={{ padding: 8 }}>
                  {new Date(s.data).toLocaleDateString("pt-BR")}
                </td>
                <td style={{ padding: 8 }}>
                  {s.valor?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Observações ou outros dados */}
      {relatorio.observacoes && (
        <div
          style={{
            marginTop: 32,
            background: "#f1f5f9",
            padding: 18,
            borderRadius: 10,
            color: "#1B3917",
            fontSize: "1.1rem",
            borderLeft: "5px solid #FD6B08",
            lineHeight: 1.6,
            ...noBreakInside, // Evitar que a caixa de observações se divida
          }}
        >
          <strong>Observações:</strong> {relatorio.observacoes}
        </div>
      )}
      <div
        style={{
          marginTop: 45,
          textAlign: "center",
          color: "#1B3917",
          fontSize: "1.15rem",
          fontWeight: 600,
          letterSpacing: 1,
          paddingTop: 20,
          borderTop: "1px solid #eee",
        }}
      >
        Relatório gerado por Igreja Cristã Evangélica Siqueira
      </div>
    </div>
  );
}
