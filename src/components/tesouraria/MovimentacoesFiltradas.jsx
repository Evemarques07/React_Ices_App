import React, { useState, useEffect, useRef } from "react";

import { entradasAPI, saidasAPI, membrosAPI } from "../../services/api";
import { formatDate, formatCurrency } from "../../utils/format";
import { maskCurrency } from "../../utils/format"; // Importa a função de máscara

const styles = {
  container: {
    maxWidth: "100%", // Mantido conforme solicitado
    background: "transparent", // Removido fundo branco
    borderRadius: 12,
    boxShadow: "none", // Remove sombra para não duplicar efeito
    // padding: "2.5rem 2rem",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#333333",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2.5rem",
    alignItems: "flex-end",
  },
  group: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#005691", // Tom de azul mais profundo
    marginBottom: 8,
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "0.8rem 1rem",
    borderRadius: 8,
    border: "1px solid #ced4da", // Borda mais visível
    fontSize: "1rem",
    background: "#f8f9fa",
    color: "#495057", // Cor do texto mais escura e legível
    transition: "all 0.3s ease-in-out",
    boxSizing: "border-box", // Garante que padding não estoure o width
  },
  inputFocus: {
    borderColor: "#007bff", // Borda azul ao focar
    boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
  },
  button: {
    padding: "0.8rem 1.5rem",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg, #007bff, #0056b3)", // Gradiente azul moderno
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 123, 255, 0.2)",
    flexShrink: 0, // Prevent shrinking
  },
  buttonHover: {
    background: "linear-gradient(90deg, #0056b3, #003f7f)",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "auto", // Alinha os botões com os outros campos
    flexWrap: "wrap", // Allow buttons to wrap to the next line
    flexDirection: "row",
  },
  secondaryButton: {
    background: "#f8f9fa",
    color: "#007bff",
    boxShadow: "none",
    border: "1px solid #ced4da",
  },
  groupTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#005691",
    margin: "2.5rem 0 1rem 0",
    borderBottom: "3px solid #007bff",
    paddingBottom: "0.6rem",
    letterSpacing: "0.5px",
  },
  subGroupTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#007bff",
    margin: "1.5rem 0 0.8rem 0",
    borderBottom: "1px solid #e9ecef",
    paddingBottom: "0.4rem",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  item: {
    padding: "1.2rem 0",
    borderBottom: "1px solid #e9ecef",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginBottom: "0.5rem",
  },
  tipo: {
    fontWeight: "700",
    color: "#343a40",
    fontSize: "1rem",
  },
  valor: {
    fontWeight: "700",
    color: "#28a745", // Verde para valores positivos (pode ser ajustado para entrada/saída)
    fontSize: "1.1rem",
  },
  data: {
    color: "#6c757d",
    fontSize: "0.85rem",
  },
  descricao: {
    color: "#495057",
    fontSize: "0.95rem",
    margin: "0.4rem 0",
    lineHeight: "1.5",
  },
  membro: {
    color: "#007bff",
    fontStyle: "italic",
    fontSize: "0.85rem",
  },
  error: {
    color: "#dc3545",
    background: "#ffebeb",
    borderRadius: 8,
    padding: "1rem 1.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "500",
    border: "1px solid #dc3545",
  },
  autocompleteList: {
    position: "absolute",
    left: 0,
    right: 0,
    background: "#ffffff",
    border: "1px solid #ced4da",
    borderRadius: 8,
    maxHeight: 200,
    overflowY: "auto",
    marginTop: "4.8rem", // Espaço maior abaixo do input
    zIndex: 100,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    listStyle: "none",
    padding: 0,
  },
  autocompleteItem: {
    padding: "0.8rem 1.2rem",
    cursor: "pointer",
    borderBottom: "1px solid #f1f3f5",
    color: "#343a40",
    fontSize: "0.95rem",
    transition: "background-color 0.2s ease",
  },
  autocompleteItemHover: {
    background: "#e9ecef",
  },
  autocompleteItemSelected: {
    background: "#e0f2fe", // Azul claro para item selecionado
    color: "#005691",
    fontWeight: "600",
  },
  noResults: {
    color: "#6c757d",
    textAlign: "center",
    marginTop: "2rem",
    fontSize: "1.1rem",
    padding: "1rem",
    background: "#f8f9fa",
    borderRadius: 8,
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2rem",
  },
  paginationButton: {
    padding: "0.6rem 1.2rem",
    borderRadius: 8,
    border: "1px solid #007bff",
    background: "#ffffff",
    color: "#007bff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
  },
  paginationButtonHover: {
    background: "#007bff",
    color: "#ffffff",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: "1rem",
    color: "#333333",
    fontWeight: "500",
  },
};

export default function MovimentacoesFiltradas({ token }) {
  const [filtro, setFiltro] = useState({
    descricao: "",
    membro_id: "",
    membro_nome: "",
    data_inicio: "",
    data_fim: "",
    tipo_movimento: "",
    tipo_caixa: "",
  });
  const [membros, setMembros] = useState([]); // <-- movido para cima
  // Ref para input e lista de autocomplete
  const membroInputRef = useRef(null);
  const autocompleteListRef = useRef(null);
  // Fecha autocomplete ao clicar fora
  useEffect(() => {
    if (membros.length === 0) return;
    function handleClickOutside(event) {
      if (
        membroInputRef.current &&
        !membroInputRef.current.contains(event.target) &&
        autocompleteListRef.current &&
        !autocompleteListRef.current.contains(event.target)
      ) {
        setMembros([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [membros]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // You can adjust this
  const [totalItems, setTotalItems] = useState(0);
  // --- ESTILOS PARA O FORMULÁRIO DE EDIÇÃO ---
  const editStyles = {
    formContainer: {
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
    },
    formGroup: {
      marginBottom: "0.75rem",
    },
    label: {
      display: "block",
      fontSize: "0.85rem",
      fontWeight: "bold",
      color: "#4a5568",
      marginBottom: "0.25rem",
    },
    input: {
      width: "100%",
      padding: "0.6rem 0.8rem",
      borderRadius: "4px",
      border: "1px solid #cbd5e0",
      boxSizing: "border-box",
      fontSize: "0.95rem",
    },
    actionsContainer: {
      display: "flex",
      gap: "8px",
      marginTop: "1rem",
      justifyContent: "flex-end",
    },
    saveButton: {
      padding: "0.4rem 1rem",
      borderRadius: 4,
      border: "1px solid #2f855a",
      background: "#f0fff4",
      color: "#2f855a",
      cursor: "pointer",
      fontWeight: "bold",
    },
    cancelButton: {
      padding: "0.4rem 1rem",
      borderRadius: 4,
      border: "1px solid #718096",
      background: "#edf2f7",
      color: "#718096",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };
  // Estados para edição inline
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  // Função para iniciar edição
  const handleEditClick = async (id) => {
    setEditingId(id);
    setEditError("");
    setEditLoading(true);
    try {
      // Busca os dados atuais da movimentação
      const mov = movimentacoes.find((m) => m.id === id);
      setEditFormData({
        tipo: mov.tipo || "",
        valor: mov.valor ? String(Math.round(mov.valor * 100)) : "0",
        data: mov.data || "",
        descricao: mov.descricao || "",
        membro_id: mov.membro_id || null,
      });
    } catch (err) {
      setEditError("Erro ao carregar dados para edição.");
      setEditingId(null);
    } finally {
      setEditLoading(false);
    }
  };

  // Lista de tipos por caixa/movimento
  function getTipos(caixa, movimento) {
    if (caixa === "financeiro" && movimento === "entrada") {
      return ["DÍZIMO", "OFERTA COMUM", "ENTRADA MEAN/MEAR"];
    }
    if (caixa === "financeiro" && movimento === "saida") {
      return ["SAÍDA FIXA", "SAÍDA VARIÁVEL"];
    }
    if (caixa === "missionario" && movimento === "entrada") {
      return ["COMPROMISSO DE FÉ", "OFERTA MISSÕES"];
    }
    if (caixa === "missionario" && movimento === "saida") {
      return ["SAÍDA MISSÕES"];
    }
    if (caixa === "projetos" && movimento === "entrada") {
      return ["NOSSA CASA"];
    }
    if (caixa === "projetos" && movimento === "saida") {
      return ["SAÍDA NOSSA CASA"];
    }
    return [];
  }

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleUpdateSubmit = async () => {
    if (!editingId) return;
    setEditLoading(true);
    setEditError("");
    try {
      const mov = movimentacoes.find((m) => m.id === editingId);
      const dados = {
        ...editFormData,
        tipo: (editFormData.tipo || "").trim(),
        descricao: (editFormData.descricao || "").trim(),
        valor: Number(editFormData.valor),
      };
      let fn;
      if (mov.movimento === "entrada") {
        if (mov.caixa === "financeiro")
          fn = entradasAPI.editarEntradaFinanceira;
        else if (mov.caixa === "missionario")
          fn = entradasAPI.editarEntradaMissionaria;
        else if (mov.caixa === "projetos")
          fn = entradasAPI.editarEntradaProjetos;
      } else if (mov.movimento === "saida") {
        if (mov.caixa === "financeiro") fn = saidasAPI.editarSaidaFinanceira;
        else if (mov.caixa === "missionario")
          fn = saidasAPI.editarSaidaMissionaria;
        else if (mov.caixa === "projetos") fn = saidasAPI.editarSaidaProjetos;
      }
      if (!fn)
        throw new Error("Função de edição não encontrada para este tipo.");
      await fn(editingId, dados, tokenSalvo);
      setMovimentacoes((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...editFormData,
                tipo: dados.tipo,
                descricao: dados.descricao,
                valor: dados.valor,
              }
            : item
        )
      );
      setEditingId(null);
    } catch (err) {
      setEditError(err.message || "Erro ao salvar alterações.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar esta movimentação?"))
      return;
    try {
      setLoading(true);
      const mov = movimentacoes.find((m) => m.id === id);
      let fn;
      if (mov.movimento === "entrada") {
        if (mov.caixa === "financeiro")
          fn = entradasAPI.deletarEntradaFinanceira;
        else if (mov.caixa === "missionario")
          fn = entradasAPI.deletarEntradaMissionaria;
        else if (mov.caixa === "projetos")
          fn = entradasAPI.deletarEntradaProjetos;
      } else if (mov.movimento === "saida") {
        if (mov.caixa === "financeiro") fn = saidasAPI.deletarSaidaFinanceira;
        else if (mov.caixa === "missionario")
          fn = saidasAPI.deletarSaidaMissionaria;
        else if (mov.caixa === "projetos") fn = saidasAPI.deletarSaidaProjetos;
      }
      if (!fn)
        throw new Error("Função de exclusão não encontrada para este tipo.");
      await fn(id, tokenSalvo);
      setMovimentacoes((prev) => prev.filter((item) => item.id !== id));
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao deletar movimentação");
    } finally {
      setLoading(false);
    }
  };

  // Ref to store the latest token
  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  let tokenSalvo = token;
  if (!tokenSalvo) {
    try {
      tokenSalvo = JSON.parse(localStorage.getItem("user"))?.access_token;
    } catch {}
  }

  // Effect to trigger search when page or itemsPerPage changes
  useEffect(() => {
    if (movimentacoes.length > 0 || currentPage > 1) {
      // Only re-fetch if there are results or if it's not the first page load
      handleSubmit(null, currentPage);
    }
  }, [currentPage, itemsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, page = 1) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const skip = (page - 1) * itemsPerPage;
      const res = await entradasAPI.todasMovimentacoesFiltradas(
        filtro,
        tokenSalvo,
        skip,
        itemsPerPage
      );
      // Se vier array direto
      if (Array.isArray(res)) {
        setMovimentacoes(res);
        setTotalItems(res.length); // Não é o total real, mas mostra o que veio
      } else {
        setMovimentacoes(res.items || []);
        setTotalItems(res.total || (res.items ? res.items.length : 0));
      }
      setCurrentPage(page);
    } catch (err) {
      console.error("Erro ao buscar movimentações:", err);
      setError(err.message || "Erro ao buscar movimentações");
      setMovimentacoes([]); // Clear previous results on error
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Agrupamento por tipo_caixa e tipo_movimento
  const agrupadas = {};
  movimentacoes.forEach((mov) => {
    const caixa = mov.caixa || "Geral"; // Mudança de "Outros" para "Geral"
    if (!agrupadas[caixa]) agrupadas[caixa] = {};
    const movimento = mov.movimento || "Não Classificado"; // Mudança de "Outros"
    if (!agrupadas[caixa][movimento]) agrupadas[caixa][movimento] = [];
    agrupadas[caixa][movimento].push(mov);
  });

  return (
    <div
      style={styles.container}
      className="movimentacoes-filtradas-responsive"
    >
      <h2
        style={{
          color: "#005691",
          marginBottom: "2rem",
          fontSize: "1rem",
          fontWeight: "700",
        }}
      >
        Filtrar Movimentações Financeiras
      </h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.group}>
          <label style={styles.label} htmlFor="descricao">
            Descrição
          </label>
          <input
            name="descricao"
            id="descricao"
            value={filtro.descricao}
            onChange={handleChange}
            style={styles.input}
            placeholder="Ex: Doação, Aluguel"
          />
        </div>
        <div style={{ ...styles.group, position: "relative" }}>
          <label style={styles.label} htmlFor="membro_nome">
            Membro
          </label>
          <input
            ref={membroInputRef}
            name="membro_nome"
            id="membro_nome"
            value={filtro.membro_nome || ""}
            onChange={async (e) => {
              const nome = e.target.value;
              setFiltro({ ...filtro, membro_nome: nome, membro_id: "" });
              setMembros([]);
              if (nome.length > 2 && tokenSalvo) {
                try {
                  const lista = await membrosAPI.filtrarMembros(
                    nome,
                    tokenSalvo
                  );
                  setMembros(lista);
                } catch (err) {
                  console.error("Erro ao buscar membros:", err);
                }
              }
            }}
            style={styles.input}
            placeholder="Buscar por nome do membro"
            autoComplete="off"
          />
          {membros.length > 0 && (
            <ul style={styles.autocompleteList} ref={autocompleteListRef}>
              {membros.map((m) => (
                <li
                  key={m.id}
                  style={{
                    ...styles.autocompleteItem,
                    ...(filtro.membro_id === m.id &&
                      styles.autocompleteItemSelected),
                  }}
                  onClick={() => {
                    setFiltro({
                      ...filtro,
                      membro_id: m.id,
                      membro_nome: m.nome,
                    });
                    setMembros([]);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      styles.autocompleteItemHover.background)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      filtro.membro_id === m.id
                        ? styles.autocompleteItemSelected.background
                        : styles.autocompleteItem.background)
                  }
                >
                  {m.nome}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={styles.group}>
          <label style={styles.label} htmlFor="data_inicio">
            Data Início
          </label>
          <input
            name="data_inicio"
            id="data_inicio"
            type="date"
            value={filtro.data_inicio}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label} htmlFor="data_fim">
            Data Fim
          </label>
          <input
            name="data_fim"
            id="data_fim"
            type="date"
            value={filtro.data_fim}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label} htmlFor="tipo_movimento">
            Tipo Movimento
          </label>
          <select
            name="tipo_movimento"
            id="tipo_movimento"
            value={filtro.tipo_movimento}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div style={styles.group}>
          <label style={styles.label} htmlFor="tipo_caixa">
            Tipo Caixa
          </label>
          <select
            name="tipo_caixa"
            id="tipo_caixa"
            value={filtro.tipo_caixa}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Todos</option>
            <option value="financeiro">Financeiro</option>
            <option value="missionario">Missionário</option>
            <option value="projetos">Projetos</option>
          </select>
        </div>
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = styles.buttonHover.background)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = styles.button.background)
            }
          >
            {loading ? "Buscando..." : "Filtrar Movimentações"}
          </button>
          <button
            type="button"
            style={{
              ...styles.button,
              ...styles.secondaryButton,
            }}
            onClick={() => {
              setFiltro({
                descricao: "",
                membro_id: "",
                membro_nome: "",
                data_inicio: "",
                data_fim: "",
                tipo_movimento: "",
                tipo_caixa: "",
              });
              setMembros([]);
              setMovimentacoes([]);
              setError("");
              setCurrentPage(1); // Reset page on clear
              setTotalItems(0);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                styles.autocompleteItemHover.background)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                styles.secondaryButton.background)
            }
          >
            Limpar Filtros
          </button>
        </div>
      </form>
      {error && <div style={styles.error}>{error}</div>}
      {/* Renderização agrupada */}
      {Object.keys(agrupadas).length === 0 && !loading && totalItems === 0 && (
        <div style={styles.noResults}>
          Nenhuma movimentação encontrada com os filtros aplicados.
        </div>
      )}
      {Object.entries(agrupadas).map(([caixa, movimentos]) => (
        <div key={caixa}>
          <div style={styles.groupTitle}>
            {caixa.charAt(0).toUpperCase() + caixa.slice(1)}
          </div>
          {Object.entries(movimentos).map(([movimento, lista]) => (
            <div key={movimento}>
              <div style={styles.subGroupTitle}>
                {movimento.charAt(0).toUpperCase() + movimento.slice(1)}
              </div>
              <ul style={styles.list}>
                {lista.map((e) => (
                  <li key={e.id} style={styles.item}>
                    {editingId === e.id ? (
                      <div style={editStyles.formContainer}>
                        {editLoading && <div>Carregando edição...</div>}
                        {editError && (
                          <div style={{ color: "#c53030" }}>{editError}</div>
                        )}
                        {!editLoading && !editError && (
                          <div>
                            <div style={editStyles.formGroup}>
                              <label style={editStyles.label}>Tipo</label>
                              <select
                                style={editStyles.input}
                                value={editFormData.tipo}
                                onChange={(ev) =>
                                  setEditFormData({
                                    ...editFormData,
                                    tipo: ev.target.value,
                                  })
                                }
                              >
                                <option value="">Selecione...</option>
                                {getTipos(e.caixa, e.movimento).map((tipo) => (
                                  <option key={tipo} value={tipo}>
                                    {tipo}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div style={editStyles.formGroup}>
                              <label style={editStyles.label}>Valor</label>
                              <input
                                style={editStyles.input}
                                type="text"
                                value={maskCurrency(editFormData.valor)}
                                onChange={(ev) =>
                                  setEditFormData({
                                    ...editFormData,
                                    valor: ev.target.value.replace(/\D/g, ""),
                                  })
                                }
                                inputMode="numeric"
                                placeholder="R$ 0,00"
                              />
                            </div>
                            <div style={editStyles.formGroup}>
                              <label style={editStyles.label}>Data</label>
                              <input
                                style={editStyles.input}
                                type="date"
                                value={editFormData.data}
                                onChange={(ev) =>
                                  setEditFormData({
                                    ...editFormData,
                                    data: ev.target.value,
                                  })
                                }
                              />
                            </div>
                            <div style={editStyles.formGroup}>
                              <label style={editStyles.label}>Descrição</label>
                              <input
                                style={editStyles.input}
                                value={editFormData.descricao}
                                onChange={(ev) =>
                                  setEditFormData({
                                    ...editFormData,
                                    descricao: ev.target.value,
                                  })
                                }
                              />
                            </div>
                            <div style={editStyles.actionsContainer}>
                              <button
                                style={editStyles.cancelButton}
                                onClick={handleCancelEdit}
                              >
                                Cancelar
                              </button>
                              <button
                                style={editStyles.saveButton}
                                onClick={handleUpdateSubmit}
                                disabled={editLoading}
                              >
                                {editLoading ? "Salvando..." : "Salvar"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={styles.header}>
                          <span style={styles.tipo}>{e.tipo}</span>
                          <span
                            style={{
                              ...styles.valor,
                              color:
                                e.tipo_movimento === "entrada"
                                  ? "#28a745"
                                  : "#dc3545",
                            }}
                          >
                            {formatCurrency(e.valor)}
                          </span>
                          <span style={styles.data}>{formatDate(e.data)}</span>
                        </div>
                        {e.descricao && (
                          <div style={styles.descricao}>{e.descricao}</div>
                        )}
                        {e.membro_id && (
                          <div style={styles.membro}>
                            Membro: {e.nome_membro}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <button
                            disabled={!!editingId}
                            onClick={() => handleEditClick(e.id)}
                            style={{
                              padding: "0.3rem 0.8rem",
                              borderRadius: 4,
                              border: "1px solid #0077b6",
                              background: "#e6f7fa",
                              color: "#0077b6",
                              cursor: editingId ? "not-allowed" : "pointer",
                              fontWeight: "bold",
                              opacity: editingId ? 0.5 : 1,
                            }}
                          >
                            Editar
                          </button>
                          <button
                            disabled={!!editingId}
                            onClick={() => handleDelete(e.id)}
                            style={{
                              padding: "0.3rem 0.8rem",
                              borderRadius: 4,
                              border: "1px solid #c53030",
                              background: "#fff5f5",
                              color: "#c53030",
                              cursor: editingId ? "not-allowed" : "pointer",
                              fontWeight: "bold",
                              opacity: editingId ? 0.5 : 1,
                            }}
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      {totalItems > 0 && (
        <div style={styles.paginationContainer}>
          <button
            style={{
              ...styles.paginationButton,
              ...(currentPage === 1 && styles.paginationButtonDisabled),
            }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            onMouseEnter={(e) => {
              if (currentPage !== 1 && !loading)
                e.currentTarget.style.backgroundColor =
                  styles.paginationButtonHover.background;
              if (currentPage !== 1 && !loading)
                e.currentTarget.style.color =
                  styles.paginationButtonHover.color;
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1 && !loading)
                e.currentTarget.style.backgroundColor =
                  styles.paginationButton.background;
              if (currentPage !== 1 && !loading)
                e.currentTarget.style.color = styles.paginationButton.color;
            }}
          >
            Anterior
          </button>
          <span style={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            style={{
              ...styles.paginationButton,
              ...(currentPage === totalPages &&
                styles.paginationButtonDisabled),
            }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages && !loading)
                e.currentTarget.style.backgroundColor =
                  styles.paginationButtonHover.background;
              if (currentPage !== totalPages && !loading)
                e.currentTarget.style.color =
                  styles.paginationButtonHover.color;
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages && !loading)
                e.currentTarget.style.backgroundColor =
                  styles.paginationButton.background;
              if (currentPage !== totalPages && !loading)
                e.currentTarget.style.color = styles.paginationButton.color;
            }}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
