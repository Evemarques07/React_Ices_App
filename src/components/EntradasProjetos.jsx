import React, { useState, useEffect, useCallback } from "react";
import { entradasAPI } from "../services/api";
import { formatDate, formatCurrency } from "../utils/format";

// --- NOVOS ESTILOS PARA O FORMULÁRIO DE EDIÇÃO ---
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

export default function EntradasMissionarias({ token }) {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [colapsado, setColapsado] = useState(true);

  // --- NOVOS ESTADOS PARA GERENCIAR A EDIÇÃO ---
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const PAGE_SIZE = 5;
  let tokenSalvo = token;
  if (!tokenSalvo) {
    try {
      tokenSalvo = JSON.parse(localStorage.getItem("user"))?.access_token;
    } catch {}
  }

  const fetchEntradas = useCallback(() => {
    setLoading(true);
    entradasAPI
      .listarEntradasProjetos(tokenSalvo, (page - 1) * PAGE_SIZE, PAGE_SIZE)
      .then((res) => {
        setEntradas(res.items || res);
        setTotal(res.total || res.length || 0);
        setError("");
      })
      .catch((err) => setError(err.message || "Erro ao buscar entradas"))
      .finally(() => setLoading(false));
  }, [tokenSalvo, page]);

  useEffect(() => {
    fetchEntradas();
  }, [fetchEntradas]);

  const toggleColapsado = useCallback(() => setColapsado((c) => !c), []);

  const handleEditClick = async (id) => {
    setEditingEntryId(id);
    setEditError("");
    setEditLoading(true);
    try {
      const entrada = await entradasAPI.getEntradaProjetoById(id, tokenSalvo);
      setEditFormData({
        tipo: entrada.tipo || "",
        valor: entrada.valor || 0,
        data: entrada.data || "",
        descricao: entrada.descricao || "",
        membro_id: entrada.membro_id || null,
      });
    } catch (err) {
      setEditError("Erro ao carregar dados para edição.");
      setEditingEntryId(null); // Fecha a edição em caso de erro
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEditFormData({});
  };

  const handleUpdateSubmit = async () => {
    if (!editingEntryId) return;
    setEditLoading(true);
    setEditError("");
    try {
      await entradasAPI.editarEntradaProjetos(
        editingEntryId,
        {
          ...editFormData,
          valor: Number(editFormData.valor),
        },
        tokenSalvo
      );
      // Atualiza a lista localmente para refletir a mudança imediatamente
      setEntradas((prev) =>
        prev.map((item) =>
          item.id === editingEntryId
            ? { ...item, ...editFormData, valor: Number(editFormData.valor) }
            : item
        )
      );
      setEditingEntryId(null); // Fecha o formulário
    } catch (err) {
      setEditError(err.message || "Erro ao salvar alterações.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar esta entrada?")) return;
    try {
      setLoading(true);
      await entradasAPI.deletarEntradaProjetos(id, tokenSalvo);
      // Remove da lista local ou busca novamente
      setEntradas((prev) => prev.filter((item) => item.id !== id));
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao deletar entrada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: 8,
        boxShadow: "0 4px 12px #0097d822",
      }}
    >
      <button
        onClick={toggleColapsado}
        style={{
          width: "100%",
          padding: "1rem",
          fontWeight: "bold",
          background: "#fff",
          color: "#0077b6",
          border: "none",
          borderBottom: "1px solid #e0e0e0",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={!colapsado}
      >
        Entradas Projetos
        <span
          style={{
            float: "right",
            transform: colapsado ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s",
          }}
        >
          ▼
        </span>
      </button>
      <div
        style={{
          maxHeight: colapsado ? 0 : 600,
          overflow: colapsado ? "hidden" : "auto",
          transition: "max-height 0.4s ease-in-out",
        }}
      >
        {loading && <div style={{ padding: 16 }}>Carregando...</div>}
        {error && <div style={{ color: "#c53030", padding: 16 }}>{error}</div>}
        {!loading && !error && entradas.length === 0 && (
          <div style={{ padding: 16 }}>Nenhuma entrada encontrada.</div>
        )}
        {!loading && !error && entradas.length > 0 && (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {entradas.map((e) => (
              <li
                key={e.id}
                style={{ padding: "1rem", borderBottom: "1px solid #e0e0e0" }}
              >
                {editingEntryId === e.id ? (
                  // --- RENDERIZA O FORMULÁRIO DE EDIÇÃO ---
                  <div style={editStyles.formContainer}>
                    {editLoading && <div>Carregando edição...</div>}
                    {editError && (
                      <div style={{ color: "#c53030" }}>{editError}</div>
                    )}
                    {!editLoading && !editError && (
                      <div>
                        <div style={editStyles.formGroup}>
                          <label style={editStyles.label}>Tipo</label>
                          <input
                            style={editStyles.input}
                            value={editFormData.tipo}
                            onChange={(ev) =>
                              setEditFormData({
                                ...editFormData,
                                tipo: ev.target.value,
                              })
                            }
                          />
                        </div>
                        <div style={editStyles.formGroup}>
                          <label style={editStyles.label}>Valor</label>
                          <input
                            style={editStyles.input}
                            type="number"
                            value={editFormData.valor}
                            onChange={(ev) =>
                              setEditFormData({
                                ...editFormData,
                                valor: ev.target.value,
                              })
                            }
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
                  // --- RENDERIZA A VISUALIZAÇÃO NORMAL DO ITEM ---
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>{e.tipo}</span>
                      <span style={{ color: "#0077b6", fontWeight: "bold" }}>
                        {formatCurrency(e.valor)}
                      </span>
                      <span style={{ color: "#555" }}>
                        {formatDate(e.data)}
                      </span>
                    </div>
                    {e.descricao && (
                      <div
                        style={{
                          color: "#555",
                          fontSize: "0.95rem",
                          margin: "4px 0",
                        }}
                      >
                        {e.descricao}
                      </div>
                    )}
                    {e.nome_membro && (
                      <div
                        style={{
                          color: "#0097d8",
                          fontStyle: "italic",
                          fontSize: "0.9rem",
                        }}
                      >
                        Membro: {e.nome_membro}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        disabled={!!editingEntryId}
                        onClick={() => handleEditClick(e.id)}
                        style={{
                          padding: "0.3rem 0.8rem",
                          borderRadius: 4,
                          border: "1px solid #0077b6",
                          background: "#e6f7fa",
                          color: "#0077b6",
                          cursor: editingEntryId ? "not-allowed" : "pointer",
                          fontWeight: "bold",
                          opacity: editingEntryId ? 0.5 : 1,
                        }}
                      >
                        Editar
                      </button>
                      <button
                        disabled={!!editingEntryId}
                        onClick={() => handleDelete(e.id)}
                        style={{
                          padding: "0.3rem 0.8rem",
                          borderRadius: 4,
                          border: "1px solid #c53030",
                          background: "#fff5f5",
                          color: "#c53030",
                          cursor: editingEntryId ? "not-allowed" : "pointer",
                          fontWeight: "bold",
                          opacity: editingEntryId ? 0.5 : 1,
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
        )}
        <div
          style={{
            display: colapsado ? "none" : "flex",
            justifyContent: "center",
            gap: 8,
            padding: 16,
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 4,
              border: "1px solid #0097d8",
              background: page === 1 ? "#eee" : "#fff",
              color: "#0077b6",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            Anterior
          </button>
          <span
            style={{
              padding: "0 8px",
              fontWeight: "bold",
              color: "#0077b6",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            Página {page}
          </span>
          <button
            disabled={entradas.length < PAGE_SIZE}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 4,
              border: "1px solid #0097d8",
              background: entradas.length < PAGE_SIZE ? "#eee" : "#fff",
              color: "#0077b6",
              cursor: entradas.length < PAGE_SIZE ? "not-allowed" : "pointer",
            }}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
