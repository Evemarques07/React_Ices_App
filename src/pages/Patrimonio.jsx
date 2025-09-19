import React, { useEffect, useState } from "react";
import { patrimonioAPI } from "../services/api";
import ScrollToTopButton from "../components/utils/ScrollToTopButton";

// Definindo as opções fora do componente para evitar recriação
const tiposDePatrimonio = [
  "Máquinas e Equipamentos",
  "Móveis e Utensílios",
  "Computadores e Periféricos",
];

export default function Patrimonio() {
  const [token, setToken] = useState("");
  const [patrimonios, setPatrimonios] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal criar
  const [showModalCriar, setShowModalCriar] = useState(false);
  const [novoPatrimonio, setNovoPatrimonio] = useState({
    nome_item: "",
    tipo: "",
    preco_aquisicao: "",
    data_aquisicao: "",
    observacoes: "",
  });
  const [criarLoading, setCriarLoading] = useState(false);
  const [criarError, setCriarError] = useState("");
  const [criarSuccess, setCriarSuccess] = useState("");

  // Modal editar
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [editPatrimonio, setEditPatrimonio] = useState(null);
  const [editarLoading, setEditarLoading] = useState(false);
  const [editarError, setEditarError] = useState("");
  const [editarSuccess, setEditarSuccess] = useState("");

  // Modal Depreciação (NOVO)
  const [showModalDepreciacao, setShowModalDepreciacao] = useState(false);
  const [selectedPatrimonio, setSelectedPatrimonio] = useState(null);
  const [vidaUtil, setVidaUtil] = useState("");
  const [valorResidual, setValorResidual] = useState("");
  const [resultadoDepreciacao, setResultadoDepreciacao] = useState(null);

  // Busca
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaLoading, setBuscaLoading] = useState(false);
  const [buscaError, setBuscaError] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setToken(JSON.parse(user).access_token);
  }, []);

  const fetchPatrimonios = () => {
    if (!token) return;
    setLoading(true);
    setError("");
    let isMounted = true;
    patrimonioAPI
      .listarPatrimonios(token, (page - 1) * limit, limit)
      .then((res) => {
        if (isMounted) {
          setPatrimonios(res.items || res.patrimonios || res);
          setTotal(res.total || (res.items ? res.items.length : res.length));
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Erro ao buscar patrimônios");
          setPatrimonios([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    if (!searchActive) fetchPatrimonios();
  }, [token, page, limit, criarSuccess, editarSuccess, searchActive]);

  useEffect(() => {
    if (criarSuccess || criarError) {
      const timer = setTimeout(() => {
        setCriarSuccess("");
        setCriarError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [criarSuccess, criarError]);

  useEffect(() => {
    if (editarSuccess || editarError) {
      const timer = setTimeout(() => {
        setEditarSuccess("");
        setEditarError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [editarSuccess, editarError]);

  async function handleCriarPatrimonio(e) {
    e.preventDefault();
    setCriarLoading(true);
    setCriarError("");
    setCriarSuccess("");
    try {
      await patrimonioAPI.criarPatrimonio(
        {
          ...novoPatrimonio,
          preco_aquisicao: Number(novoPatrimonio.preco_aquisicao),
        },
        token
      );
      setCriarSuccess("Patrimônio criado com sucesso!");
      setTimeout(() => {
        setShowModalCriar(false);
        setNovoPatrimonio({
          nome_item: "",
          tipo: "",
          preco_aquisicao: "",
          data_aquisicao: "",
          observacoes: "",
        });
      }, 1500);
    } catch (err) {
      setCriarError(err.message || "Erro ao criar patrimônio");
    } finally {
      setCriarLoading(false);
    }
  }

  async function handleEditarPatrimonio(e) {
    e.preventDefault();
    setEditarLoading(true);
    setEditarError("");
    setEditarSuccess("");
    try {
      await patrimonioAPI.editarPatrimonio(
        editPatrimonio.id,
        {
          ...editPatrimonio,
          preco_aquisicao: Number(editPatrimonio.preco_aquisicao),
        },
        token
      );
      setEditarSuccess("Patrimônio editado com sucesso!");
      setTimeout(() => {
        setShowModalEditar(false);
        setEditPatrimonio(null);
      }, 1500);
    } catch (err) {
      setEditarError(err.message || "Erro ao editar patrimônio");
    } finally {
      setEditarLoading(false);
    }
  }

  async function handleDeletarPatrimonio(id) {
    if (!window.confirm("Tem certeza que deseja deletar este patrimônio?"))
      return;
    setLoading(true);
    try {
      await patrimonioAPI.deletarPatrimonio(id, token);
      fetchPatrimonios();
    } catch (err) {
      setError(err.message || "Erro ao deletar patrimônio");
    } finally {
      setLoading(false);
    }
  }

  async function handleBuscar(e) {
    e.preventDefault();
    if (!buscaNome) return;
    setBuscaLoading(true);
    setBuscaError("");
    try {
      const res = await patrimonioAPI.buscarPatrimonioPorNome(buscaNome, token);
      setPatrimonios(res);
      setSearchActive(true);
      if (res.length === 0)
        setBuscaError("Nenhum patrimônio encontrado com esse nome.");
    } catch (err) {
      setBuscaError(err.message || "Não encontrado");
      setPatrimonios([]);
    } finally {
      setBuscaLoading(false);
    }
  }

  function handleClearSearch() {
    setBuscaNome("");
    setSearchActive(false);
    setBuscaError("");
    if (page !== 1) setPage(1);
  }

  // Função para abrir modal de depreciação
  function openDepreciationModal(patrimonio) {
    setSelectedPatrimonio(patrimonio);
    setShowModalDepreciacao(true);
    // Limpa os campos do cálculo anterior
    setVidaUtil("");
    setValorResidual("");
    setResultadoDepreciacao(null);
  }

  // Função para calcular a depreciação
  function handleCalcularDepreciacao(e) {
    e.preventDefault();

    const valorAquisicao = Number(selectedPatrimonio.preco_aquisicao);
    const resValue = Number(valorResidual);
    const lifeYears = Number(vidaUtil);

    if (lifeYears <= 0) {
      alert("A vida útil deve ser um número positivo.");
      return;
    }
    if (resValue < 0 || resValue >= valorAquisicao) {
      alert(
        "O valor residual deve ser positivo e menor que o valor de aquisição."
      );
      return;
    }

    const valorDepreciavel = valorAquisicao - resValue;
    const depreciacaoAnual = valorDepreciavel / lifeYears;
    const depreciacaoMensal = depreciacaoAnual / 12;

    const dataAquisicao = new Date(selectedPatrimonio.data_aquisicao);
    // Adiciona um dia para corrigir problemas de fuso horário que podem fazer a data "voltar" um dia.
    dataAquisicao.setDate(dataAquisicao.getDate() + 1);
    const dataAtual = new Date();

    if (dataAquisicao > dataAtual) {
      setResultadoDepreciacao({
        depreciacaoAnual: depreciacaoAnual,
        depreciacaoAcumulada: 0,
        valorContabilAtual: valorAquisicao,
      });
      return;
    }

    let mesesPassados =
      (dataAtual.getFullYear() - dataAquisicao.getFullYear()) * 12;
    mesesPassados -= dataAquisicao.getMonth();
    mesesPassados += dataAtual.getMonth();
    mesesPassados = mesesPassados <= 0 ? 0 : mesesPassados;

    let depreciacaoAcumulada = depreciacaoMensal * mesesPassados;
    // Garante que a depreciação não ultrapasse o valor depreciável
    depreciacaoAcumulada = Math.min(depreciacaoAcumulada, valorDepreciavel);

    const valorContabilAtual = valorAquisicao - depreciacaoAcumulada;

    setResultadoDepreciacao({
      depreciacaoAnual,
      depreciacaoAcumulada,
      valorContabilAtual,
    });
  }

  const formatCurrency = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "96%",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{ textAlign: "center", color: "#111827", fontSize: "2.25rem" }}
        >
          Gestão de Patrimônio
        </h1>
      </header>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1.5rem",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
          marginBottom: "2rem",
        }}
      >
        <button
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            color: "#ffffff",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "transform 0.2s",
          }}
          onClick={() => setShowModalCriar(true)}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Novo Patrimônio
        </button>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={handleBuscar}
            style={{ display: "flex", gap: "0.5rem" }}
            className="form-busca"
          >
            <input
              type="text"
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
              placeholder="Buscar por nome do item"
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                minWidth: "220px",
              }}
            />
            <button
              type="submit"
              disabled={buscaLoading}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "8px",
                background: "#1f2937",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {buscaLoading ? "..." : "Buscar"}
            </button>
          </form>
          {searchActive && (
            <button
              onClick={handleClearSearch}
              style={{
                background: "none",
                border: "1px solid #d1d5db",
                color: "#4b5563",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Limpar Busca
            </button>
          )}
        </div>
      </div>

      {buscaError && (
        <div
          style={{
            color: "#ef4444",
            backgroundColor: "#fee2e2",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          {buscaError}
        </div>
      )}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            fontSize: "1.2rem",
            color: "#4b5563",
          }}
        >
          Carregando patrimônios...
        </div>
      )}
      {error && !buscaError && (
        <div
          style={{
            color: "#ef4444",
            backgroundColor: "#fee2e2",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {!loading && (
        <div>
          <div className="patrimonios-tabela" style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <thead style={{ background: "#f3f4f6", color: "#374151" }}>
                <tr>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderRadius: "8px 0 0 8px",
                    }}
                  >
                    Nome
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Tipo</th>
                  <th style={{ padding: "1rem", textAlign: "right" }}>
                    Preço Aquisição
                  </th>
                  <th style={{ padding: "1rem", textAlign: "center" }}>
                    Data Aquisição
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {patrimonios.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      borderRadius: "8px",
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem",
                        fontWeight: "600",
                        color: "#111827",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                      }}
                    >
                      {p.nome_item}
                    </td>
                    <td style={{ padding: "1rem" }}>{p.tipo}</td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      {formatCurrency(p.preco_aquisicao)}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {p.data_aquisicao
                        ? new Date(p.data_aquisicao).toLocaleDateString(
                            "pt-BR",
                            { timeZone: "UTC" }
                          )
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                      }}
                    >
                      <button
                        style={{
                          background: "#e5e7eb",
                          color: "#374151",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() => openDepreciationModal(p)}
                      >
                        Depreciação
                      </button>
                      <button
                        style={{
                          background: "#dbeafe",
                          color: "#2563eb",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setEditPatrimonio(p);
                          setShowModalEditar(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeletarPatrimonio(p.id)}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="patrimonios-cards"
            style={{ display: "none", flexDirection: "column", gap: "1.5rem" }}
          >
            {patrimonios.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "#1e3a8a",
                      fontSize: "1.25rem",
                      margin: 0,
                    }}
                  >
                    {p.nome_item}
                  </h3>
                  <span
                    style={{
                      color: "#6b7280",
                      fontSize: "0.9rem",
                      backgroundColor: "#eef2ff",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "12px",
                    }}
                  >
                    ID: {p.id}
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <strong>Tipo:</strong> {p.tipo}
                  </div>
                  <div>
                    <strong>Preço:</strong> {formatCurrency(p.preco_aquisicao)}
                  </div>
                  <div>
                    <strong>Data:</strong>{" "}
                    {p.data_aquisicao
                      ? new Date(p.data_aquisicao).toLocaleDateString("pt-BR", {
                          timeZone: "UTC",
                        })
                      : "-"}
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <strong>Obs:</strong> {p.observacoes || "-"}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "1.5rem",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    style={{
                      background: "#10b981",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.6rem 1.2rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: 1,
                    }}
                    onClick={() => openDepreciationModal(p)}
                  >
                    Calcular Depreciação
                  </button>
                  <button
                    style={{
                      background: "#3b82f6",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.6rem 1.2rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: 1,
                    }}
                    onClick={() => {
                      setEditPatrimonio(p);
                      setShowModalEditar(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    style={{
                      background: "#ef4444",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.6rem 1.2rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: 1,
                    }}
                    onClick={() => handleDeletarPatrimonio(p.id)}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1020px) { .patrimonios-tabela { display: none !important; } .patrimonios-cards { display: flex !important; } }
        @media (min-width: 1021px) { .patrimonios-tabela { display: block !important; } .patrimonios-cards { display: none !important; } }
        @media (max-width: 400px) { .form-busca { flex-direction: column !important; width: 100% !important; } }
      `}</style>

      {!searchActive && patrimonios.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              background: page === 1 ? "#e5e7eb" : "#ffffff",
              color: page === 1 ? "#9ca3af" : "#3b82f6",
              border: `1px solid ${page === 1 ? "#d1d5db" : "#3b82f6"}`,
              fontWeight: 600,
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            Anterior
          </button>
          <span style={{ color: "#4b5563" }}>Página {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={patrimonios.length < limit}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              background: patrimonios.length < limit ? "#e5e7eb" : "#ffffff",
              color: patrimonios.length < limit ? "#9ca3af" : "#3b82f6",
              border: `1px solid ${
                patrimonios.length < limit ? "#d1d5db" : "#3b82f6"
              }`,
              fontWeight: 600,
              cursor: patrimonios.length < limit ? "not-allowed" : "pointer",
            }}
          >
            Próxima
          </button>
        </div>
      )}

      {/* MODAL DEPRECIACAO (NOVO) */}
      {showModalDepreciacao && selectedPatrimonio && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(17, 24, 39, 0.6)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
          }}
          onClick={() => setShowModalDepreciacao(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCalcularDepreciacao}
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              padding: "2rem",
              maxWidth: 500,
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              type="button"
              onClick={() => setShowModalDepreciacao(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.75rem",
                color: "#9ca3af",
                cursor: "pointer",
                lineHeight: 1,
              }}
              title="Fechar"
            >
              &times;
            </button>
            <h3
              style={{
                color: "#111827",
                fontWeight: 700,
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
              }}
            >
              Calcular Depreciação
            </h3>
            <div
              style={{
                backgroundColor: "#f3f4f6",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h4 style={{ margin: 0, color: "#1e3a8a" }}>
                {selectedPatrimonio.nome_item}
              </h4>
              <div>
                <strong>Valor de Aquisição:</strong>{" "}
                {formatCurrency(selectedPatrimonio.preco_aquisicao)}
              </div>
              <div>
                <strong>Data de Aquisição:</strong>{" "}
                {new Date(selectedPatrimonio.data_aquisicao).toLocaleDateString(
                  "pt-BR",
                  { timeZone: "UTC" }
                )}
              </div>
            </div>

            <input
              type="number"
              step="1"
              min="1"
              value={vidaUtil}
              onChange={(e) => setVidaUtil(e.target.value)}
              placeholder="Vida Útil (em anos)"
              required
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={valorResidual}
              onChange={(e) => setValorResidual(e.target.value)}
              placeholder="Valor Residual (R$)"
              required
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />

            <button
              type="submit"
              style={{
                background: "#10b981",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "0.8rem 1.2rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Calcular
            </button>

            {resultadoDepreciacao && (
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <h4 style={{ margin: 0, color: "#111827", fontSize: "1.1rem" }}>
                  Resultados do Cálculo:
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                  }}
                >
                  <span>Depreciação Anual:</span>{" "}
                  <strong>
                    {formatCurrency(resultadoDepreciacao.depreciacaoAnual)}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                  }}
                >
                  <span>Depreciação Acumulada:</span>{" "}
                  <strong>
                    {formatCurrency(resultadoDepreciacao.depreciacaoAcumulada)}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem",
                    backgroundColor: "#e0f2fe",
                    borderRadius: "6px",
                    fontSize: "1.1rem",
                  }}
                >
                  <span>Valor Contábil Atual:</span>{" "}
                  <strong style={{ color: "#1e3a8a" }}>
                    {formatCurrency(resultadoDepreciacao.valorContabilAtual)}
                  </strong>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {(showModalCriar || (showModalEditar && editPatrimonio)) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(17, 24, 39, 0.6)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
          }}
          onClick={() => {
            setShowModalCriar(false);
            setShowModalEditar(false);
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={
              showModalCriar ? handleCriarPatrimonio : handleEditarPatrimonio
            }
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              padding: "2rem",
              maxWidth: 450,
              width: "90%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowModalCriar(false);
                setShowModalEditar(false);
              }}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.75rem",
                color: "#9ca3af",
                cursor: "pointer",
                lineHeight: 1,
              }}
              title="Fechar"
            >
              &times;
            </button>
            <h3
              style={{
                color: "#111827",
                fontWeight: 700,
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
              }}
            >
              {showModalCriar ? "Novo Patrimônio" : "Editar Patrimônio"}
            </h3>
            <input
              value={
                showModalCriar
                  ? novoPatrimonio.nome_item
                  : editPatrimonio.nome_item
              }
              onChange={(e) =>
                showModalCriar
                  ? setNovoPatrimonio((f) => ({
                      ...f,
                      nome_item: e.target.value,
                    }))
                  : setEditPatrimonio((f) => ({
                      ...f,
                      nome_item: e.target.value,
                    }))
              }
              placeholder="Nome do item"
              required
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
            <select
              value={showModalCriar ? novoPatrimonio.tipo : editPatrimonio.tipo}
              onChange={(e) =>
                showModalCriar
                  ? setNovoPatrimonio((f) => ({ ...f, tipo: e.target.value }))
                  : setEditPatrimonio((f) => ({ ...f, tipo: e.target.value }))
              }
              required
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: "#fff",
                color: (
                  showModalCriar ? novoPatrimonio.tipo : editPatrimonio.tipo
                )
                  ? "#111827"
                  : "#6b7280",
              }}
            >
              <option value="" disabled>
                Selecione um tipo
              </option>
              {tiposDePatrimonio.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              value={
                showModalCriar
                  ? novoPatrimonio.preco_aquisicao
                  : editPatrimonio.preco_aquisicao
              }
              onChange={(e) =>
                showModalCriar
                  ? setNovoPatrimonio((f) => ({
                      ...f,
                      preco_aquisicao: e.target.value,
                    }))
                  : setEditPatrimonio((f) => ({
                      ...f,
                      preco_aquisicao: e.target.value,
                    }))
              }
              placeholder="Preço de aquisição"
              required
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
            <input
              type="date"
              value={
                showModalCriar
                  ? novoPatrimonio.data_aquisicao
                  : editPatrimonio.data_aquisicao
                  ? editPatrimonio.data_aquisicao.split("T")[0]
                  : ""
              }
              onChange={(e) =>
                showModalCriar
                  ? setNovoPatrimonio((f) => ({
                      ...f,
                      data_aquisicao: e.target.value,
                    }))
                  : setEditPatrimonio((f) => ({
                      ...f,
                      data_aquisicao: e.target.value,
                    }))
              }
              required
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                color: "#4b5563",
              }}
            />
            <textarea
              value={
                showModalCriar
                  ? novoPatrimonio.observacoes
                  : editPatrimonio.observacoes
              }
              onChange={(e) =>
                showModalCriar
                  ? setNovoPatrimonio((f) => ({
                      ...f,
                      observacoes: e.target.value,
                    }))
                  : setEditPatrimonio((f) => ({
                      ...f,
                      observacoes: e.target.value,
                    }))
              }
              placeholder="Observações"
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                minHeight: "80px",
              }}
            />
            {(criarError || editarError) && (
              <div
                style={{
                  color: "#ef4444",
                  backgroundColor: "#fee2e2",
                  padding: "0.75rem",
                  borderRadius: "8px",
                }}
              >
                {criarError || editarError}
              </div>
            )}
            {(criarSuccess || editarSuccess) && (
              <div
                style={{
                  color: "#16a34a",
                  backgroundColor: "#dcfce7",
                  padding: "0.75rem",
                  borderRadius: "8px",
                }}
              >
                {criarSuccess || editarSuccess}
              </div>
            )}
            <button
              type="submit"
              disabled={criarLoading || editarLoading}
              style={{
                background:
                  criarLoading || editarLoading ? "#9ca3af" : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "0.8rem 1.2rem",
                fontWeight: 600,
                cursor:
                  criarLoading || editarLoading ? "not-allowed" : "pointer",
                marginTop: "0.5rem",
              }}
            >
              {criarLoading || editarLoading ? "Salvando..." : "Salvar"}
            </button>
          </form>
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
}