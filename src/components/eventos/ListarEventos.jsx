import { useEffect, useState } from "react";
import { eventosAPI } from "../../services/api";

function formatarData(data) {
  if (!data) return "-";
  const d = new Date(data);
  return d.toLocaleString();
}

export default function ListarEventos() {
  const [eventos, setEventos] = useState([]);
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
    titulo: "",
    descricao: "",
    data_inicio: "",
    data_final: "",
    ativo: true,
  });
  const limit = 20;

  useEffect(() => {
    async function fetchEventos() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).access_token
          : null;
        const skip = (page - 1) * limit;
        const res = await eventosAPI.listarEventos(token, skip, limit);
        setEventos(res.items || res);
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
        setError(err.message || "Erro ao buscar eventos");
        setEventos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEventos();
  }, [page, editSuccess]);

  async function handleEdit(id) {
    setEditModal(true);
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    setEditId(id);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      const dados = await eventosAPI.getEventoById(id, token);
      setEditForm({
        titulo: dados.titulo || "",
        descricao: dados.descricao || "",
        data_inicio: dados.data_inicio ? dados.data_inicio.slice(0, 16) : "",
        data_final: dados.data_final ? dados.data_final.slice(0, 16) : "",
        ativo: !!dados.ativo,
      });
    } catch (err) {
      setEditError("Erro ao carregar dados do evento.");
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
      const { titulo, descricao, data_inicio, data_final, ativo } = editForm;
      await eventosAPI.editarEvento(
        editId,
        { titulo, descricao, data_inicio, data_final, ativo },
        token
      );
      setEditSuccess("Evento atualizado com sucesso!");
      setTimeout(() => {
        setEditSuccess("");
        setEditModal(false);
        setEditId(null);
        setEditForm({
          titulo: "",
          descricao: "",
          data_inicio: "",
          data_final: "",
          ativo: true,
        });
      }, 1200);
    } catch (err) {
      setEditError(err.message || "Erro ao atualizar evento.");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este evento?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      await eventosAPI.deletarEvento(id, token);
      setEventos(eventos.filter((e) => e.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert("Erro ao excluir evento: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Campos para mostrar
  const campos = [
    { key: "titulo", label: "Título" },
    { key: "descricao", label: "Descrição" },
    { key: "data_inicio", label: "Início" },
    { key: "data_final", label: "Fim" },
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
        Lista de Eventos
      </h3>
      {loading && <div>Carregando eventos...</div>}
      {error && <div style={{ color: "#c53030", marginTop: 12 }}>{error}</div>}
      {/* Tabela para telas maiores */}
      <div className="eventos-tabela" style={{ display: "none" }}>
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
            {eventos.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #e9ecef" }}>
                {campos.map((c) => (
                  <td key={c.key} style={{ padding: "8px" }}>
                    {c.key === "data_inicio" || c.key === "data_final"
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
      <div className="eventos-cards" style={{ display: "block" }}>
        {eventos.map((e) => (
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
                {e.titulo || "-"}
              </div>
              <div style={{ color: "#333" }}>
                <b>Descrição:</b> {e.descricao || "-"}
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
              <b>Início:</b> {formatarData(e.data_inicio)}
            </div>
            <div style={{ color: "#333", marginTop: 6 }}>
              <b>Fim:</b> {formatarData(e.data_final)}
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
              Editar Evento
            </h3>
            <input
              name="titulo"
              value={editForm.titulo}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, titulo: e.target.value }))
              }
              placeholder="Título*"
              required
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <textarea
              name="descricao"
              value={editForm.descricao}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, descricao: e.target.value }))
              }
              placeholder="Descrição"
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="data_inicio"
              type="datetime-local"
              value={editForm.data_inicio}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, data_inicio: e.target.value }))
              }
              required
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="data_final"
              type="datetime-local"
              value={editForm.data_final}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, data_final: e.target.value }))
              }
              required
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
            >
              <input
                type="checkbox"
                checked={editForm.ativo}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, ativo: e.target.checked }))
                }
                id="editAtivoEvento"
              />
              <label htmlFor="editAtivoEvento">Ativo</label>
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
          .eventos-tabela { display: block !important; }
          .eventos-cards { display: none !important; }
        }
        @media (max-width: 1079px) {
          .eventos-tabela { display: none !important; }
          .eventos-cards { display: block !important; }
        }
      `}</style>
    </div>
  );
}
