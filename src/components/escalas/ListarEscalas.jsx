import { useEffect, useState } from "react";
import { escalasAPI, membrosAPI } from "../../services/api";

function formatarData(data) {
  if (!data) return "-";
  const d = new Date(data);
  return d.toLocaleString();
}

export default function ListarEscalas() {
  const [escalas, setEscalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    membro_id: "",
    tipo: "",
    data_escala: "",
    ativo: true,
  });
  const [membroBusca, setMembroBusca] = useState("");
  const [membros, setMembros] = useState([]);
  const limit = 20;

  useEffect(() => {
    async function fetchEscalas() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).access_token
          : null;
        const skip = (page - 1) * limit;
        const res = await escalasAPI.listarEscalas(token, skip, limit);
        setEscalas(res.items || res);
        if (typeof res.total === "number") {
          setTotal(res.total);
        } else if (Array.isArray(res.items)) {
          setTotal(
            skip + res.items.length + (res.items.length === limit ? limit : 0)
          );
        } else if (Array.isArray(res)) {
          setTotal(skip + res.length + (res.length === limit ? limit : 0));
        } else {
          setTotal(0);
        }
      } catch (err) {
        setError(err.message || "Erro ao buscar escalas");
        setEscalas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEscalas();
  }, [page, editSuccess]);

  async function handleEdit(id) {
    setEditModal(true);
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    setEditId(id);
    setMembroBusca("");
    setMembros([]);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      const dados = await escalasAPI.getEscalaById(id, token);
      setEditForm({
        membro_id: dados.membro_id || "",
        tipo: dados.tipo || "",
        data_escala: dados.data_escala ? dados.data_escala.slice(0, 16) : "",
        ativo: !!dados.ativo,
      });
      // Busca nome do membro para autocomplete
      if (dados.nome_membro) setMembroBusca(dados.nome_membro);
    } catch (err) {
      setEditError("Erro ao carregar dados da escala.");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    setEditLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      const { membro_id, tipo, data_escala, ativo } = editForm;
      await escalasAPI.editarEscala(
        editId,
        { membro_id, tipo, data_escala, ativo },
        token
      );
      setEditSuccess("Escala atualizada com sucesso!");
      setTimeout(() => {
        setEditSuccess("");
        setEditModal(false);
        setEditId(null);
        setEditForm({ membro_id: "", tipo: "", data_escala: "", ativo: true });
      }, 1200);
    } catch (err) {
      setEditError(err.message || "Erro ao atualizar escala.");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir esta escala?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      await escalasAPI.deletarEscala(id, token);
      setEscalas(escalas.filter((e) => e.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert("Erro ao excluir escala: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }

  async function buscarMembros(e) {
    setMembroBusca(e.target.value);
    if (e.target.value.length < 2) {
      setMembros([]);
      return;
    }
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      const res = await membrosAPI.filtrarMembros(e.target.value, token);
      setMembros(res.items || res);
    } catch {
      setMembros([]);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Campos para mostrar
  const campos = [
    { key: "nome_membro", label: "Membro" },
    { key: "tipo", label: "Tipo" },
    { key: "data_escala", label: "Data" },
    { key: "ativo", label: "Ativo" },
  ];

  return (
    <div style={{ padding: "2rem 0", position: "relative" }}>
      <h3
        style={{
          color: "#007bff",
          fontWeight: 600,
          fontSize: "1.3rem",
          marginBottom: 24,
        }}
      >
        Lista de Escalas
      </h3>
      {loading && <div>Carregando escalas...</div>}
      {error && <div style={{ color: "#c53030", marginTop: 12 }}>{error}</div>}
      {/* Tabela para telas maiores */}
      <div className="escalas-tabela" style={{ display: "none" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              {campos.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    borderBottom: "2px solid #e9ecef",
                  }}
                >
                  {c.label}
                </th>
              ))}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {escalas.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #e9ecef" }}>
                {campos.map((c) => (
                  <td key={c.key} style={{ padding: "8px" }}>
                    {c.key === "data_escala"
                      ? formatarData(e[c.key])
                      : c.key === "ativo"
                      ? e.ativo
                        ? "Sim"
                        : "Não"
                      : e[c.key] || "-"}
                  </td>
                ))}
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => handleEdit(e.id)}
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.4rem 1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      marginRight: 8,
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    style={{
                      background: "#c53030",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.4rem 1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.95rem",
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards para telas menores */}
      <div className="escalas-cards" style={{ display: "block" }}>
        {escalas.map((e) => (
          <div
            key={e.id}
            style={{
              background: "#f8f9fa",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              padding: "1.2rem 1rem",
              marginBottom: "1.2rem",
              border: "1px solid #e9ecef",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.2rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: "#005691",
                  fontSize: "1.1rem",
                }}
              >
                {e.nome_membro || "-"}
              </div>
              <div style={{ color: "#333" }}>
                <b>Tipo:</b> {e.tipo || "-"}
              </div>
              <button
                onClick={() => handleEdit(e.id)}
                style={{
                  marginLeft: "auto",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.4rem 1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  marginRight: 8,
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                style={{
                  background: "#c53030",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.4rem 1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
              >
                Excluir
              </button>
            </div>
            <div style={{ color: "#333", marginTop: 6 }}>
              <b>Data:</b> {formatarData(e.data_escala)}
            </div>
            <div
              style={{ color: e.ativo ? "#28a745" : "#c53030", marginTop: 6 }}
            >
              <b>Status:</b> {e.ativo ? "Ativo" : "Inativo"}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          style={{
            padding: "0.5rem 1.2rem",
            borderRadius: 6,
            border: "1px solid #007bff",
            background: page === 1 ? "#e9ecef" : "#fff",
            color: "#007bff",
            fontWeight: 600,
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
          style={{
            padding: "0.5rem 1.2rem",
            borderRadius: 6,
            border: "1px solid #007bff",
            background: page === totalPages ? "#e9ecef" : "#fff",
            color: "#007bff",
            fontWeight: 600,
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Próxima
        </button>
      </div>
      {/* Modal de edição */}
      {editModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
          }}
          onClick={() => setEditModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleEditSubmit}
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              padding: "2rem 1.5rem",
              maxWidth: 420,
              width: "100%",
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
              onClick={() => setEditModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: "1.7rem",
                color: "#888",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h3
              style={{
                color: "#007bff",
                fontWeight: 700,
                fontSize: "1.2rem",
                marginBottom: 8,
              }}
            >
              Editar Escala
            </h3>
            <input
              name="tipo"
              value={editForm.tipo}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, tipo: e.target.value }))
              }
              placeholder="Tipo*"
              required
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="data_escala"
              type="datetime-local"
              value={editForm.data_escala}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, data_escala: e.target.value }))
              }
              required
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <div style={{ position: "relative" }}>
              <input
                name="membroBusca"
                value={membroBusca}
                onChange={buscarMembros}
                placeholder="Buscar membro..."
                style={{
                  padding: "0.7rem",
                  borderRadius: 6,
                  border: "1px solid #ced4da",
                  marginBottom: 4,
                }}
              />
              {membros.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "100%",
                    zIndex: 100,
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                    maxHeight: 160,
                    overflowY: "auto",
                  }}
                >
                  {membros.map((m, idx) => (
                    <li
                      key={m.id}
                      style={{
                        padding: "0.85rem 1.2rem",
                        cursor: "pointer",
                        color:
                          editForm.membro_id === m.id ? "#0077b6" : "#2d3748",
                        background:
                          editForm.membro_id === m.id ? "#ebf8ff" : "#fff",
                        fontWeight:
                          editForm.membro_id === m.id ? "bold" : "normal",
                        borderBottom:
                          idx === membros.length - 1
                            ? "none"
                            : "1px solid #f1f5f9",
                      }}
                      onClick={() => {
                        setEditForm((f) => ({ ...f, membro_id: m.id }));
                        setMembroBusca(m.nome);
                        setMembros([]);
                      }}
                    >
                      {m.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
            >
              <input
                type="checkbox"
                checked={editForm.ativo}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, ativo: e.target.checked }))
                }
                id="editAtivoEscala"
              />
              <label htmlFor="editAtivoEscala">Ativo</label>
            </div>
            <button
              type="submit"
              disabled={editLoading}
              style={{
                padding: "0.8rem",
                borderRadius: 6,
                border: "none",
                background: "#007bff",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: editLoading ? "not-allowed" : "pointer",
              }}
            >
              {editLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
            {editError && (
              <div style={{ color: "#c53030", marginTop: 8 }}>{editError}</div>
            )}
            {editSuccess && (
              <div style={{ color: "#28a745", marginTop: 8 }}>
                {editSuccess}
              </div>
            )}
          </form>
        </div>
      )}
      <style>{`
        @media (min-width: 1080px) {
          .escalas-tabela { display: block !important; }
          .escalas-cards { display: none !important; }
        }
        @media (max-width: 1079px) {
          .escalas-tabela { display: none !important; }
          .escalas-cards { display: block !important; }
        }
      `}</style>
    </div>
  );
}
