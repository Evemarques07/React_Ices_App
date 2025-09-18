import { useEffect, useState } from "react";
import { eventosAPI } from "../../services/api";
import { formatarData } from "../../utils/format";

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

  const primaryColor = "#2c3e50"; 
  const accentColor = "#3498db"; 
  const successColor = "#2ecc71";
  const errorColor = "#e74c3c"; 
  const borderColor = "#ecf0f1";
  const textColor = "#34495e";
  const lightBg = "#fdfdfe";
  const grayText = "#7f8c8d";
  const whiteBg = "#ffffff";

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
        setError(err.message || "Erro ao buscar eventos.");
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
        data_inicio: dados.data_inicio
          ? new Date(dados.data_inicio).toISOString().slice(0, 16)
          : "",
        data_final: dados.data_final
          ? new Date(dados.data_final).toISOString().slice(0, 16)
          : "",
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
      }, 2000); 
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

  const campos = [
    { key: "titulo", label: "Título" },
    { key: "descricao", label: "Descrição" },
    { key: "data_inicio", label: "Início" },
    { key: "data_final", label: "Fim" },
    { key: "ativo", label: "Status" },
  ];

  return (
    <div
      style={{
        paddingTop: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >

      {loading && (
        <div
          style={{
            textAlign: "center",
            color: grayText,
            fontSize: "1.1rem",
            padding: "20px 0",
          }}
        >
          Carregando eventos...
        </div>
      )}
      {error && (
        <div
          style={{
            color: errorColor,
            marginTop: 12,
            padding: "10px",
            background: "#ffe9e8",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <div className="eventos-tabela-container" style={{ display: "none" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 10px",
          }}
        >
          <thead>
            <tr style={{ background: lightBg }}>
              {campos.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: "left",
                    padding: "12px 15px",
                    borderBottom: `2px solid ${borderColor}`,
                    color: primaryColor,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {c.label}
                </th>
              ))}
              <th
                style={{
                  textAlign: "center",
                  padding: "12px 15px",
                  borderBottom: `2px solid ${borderColor}`,
                  color: primaryColor,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((e) => (
              <tr
                key={e.id}
                style={{
                  background: lightBg,
                  borderRadius: 8,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease-in-out",
                }}
                onMouseEnter={(el) => (el.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={(el) => (el.currentTarget.style.transform = "translateY(0)")}
              >
                {campos.map((c) => (
                  <td
                    key={c.key}
                    style={{
                      padding: "12px 15px",
                      color: textColor,
                      fontSize: "0.95rem",
                    }}
                  >
                    {c.key === "data_inicio" || c.key === "data_final"
                      ? formatarData(e[c.key])
                      : c.key === "ativo"
                      ? e.ativo
                        ? <span style={{ color: successColor, fontWeight: 600 }}>Ativo</span>
                        : <span style={{ color: errorColor, fontWeight: 600 }}>Inativo</span>
                      : e[c.key] || "-"}
                  </td>
                ))}
                <td style={{ padding: "12px 15px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(e.id)}
                    style={{
                      background: accentColor,
                      color: whiteBg,
                      border: "none",
                      borderRadius: 6,
                      padding: "0.6rem 1.2rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      marginRight: 8,
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(el) => (el.currentTarget.style.backgroundColor = "#2980b9")}
                    onMouseLeave={(el) => (el.currentTarget.style.backgroundColor = accentColor)}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    style={{
                      background: errorColor,
                      color: whiteBg,
                      border: "none",
                      borderRadius: 6,
                      padding: "0.6rem 1.2rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(el) => (el.currentTarget.style.backgroundColor = "#c0392b")}
                    onMouseLeave={(el) => (el.currentTarget.style.backgroundColor = errorColor)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="eventos-cards-container" style={{ display: "block" }}>
        {eventos.map((e) => (
          <div
            key={e.id}
            style={{
              background: lightBg,
              borderRadius: 10,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              border: `1px solid ${borderColor}`,
              position: "relative",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(el) => (el.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(el) => (el.currentTarget.style.transform = "translateY(0)")}
          >
            <div
              style={{
                fontWeight: 700,
                color: primaryColor,
                fontSize: "1.3rem",
                marginBottom: "0.8rem",
              }}
            >
              {e.titulo || "-"}
            </div>
            <div style={{ color: textColor, fontSize: "1rem", marginBottom: "0.4rem" }}>
              <b style={{ color: grayText }}>Descrição:</b> {e.descricao || "-"}
            </div>
            <div style={{ color: textColor, fontSize: "1rem", marginBottom: "0.4rem" }}>
              <b style={{ color: grayText }}>Início:</b> {formatarData(e.data_inicio)}
            </div>
            <div style={{ color: textColor, fontSize: "1rem", marginBottom: "0.8rem" }}>
              <b style={{ color: grayText }}>Fim:</b> {formatarData(e.data_final)}
            </div>
            <div
              style={{ color: e.ativo ? successColor : errorColor, fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}
            >
              <b style={{ color: grayText }}>Status:</b> {e.ativo ? "Ativo" : "Inativo"}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.8rem",
                justifyContent: "flex-end", 
              }}
            >
              <button
                onClick={() => handleEdit(e.id)}
                style={{
                  background: accentColor,
                  color: whiteBg,
                  border: "none",
                  borderRadius: 6,
                  padding: "0.6rem 1.2rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(el) => (el.currentTarget.style.backgroundColor = "#2980b9")}
                onMouseLeave={(el) => (el.currentTarget.style.backgroundColor = accentColor)}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                style={{
                  background: errorColor,
                  color: whiteBg,
                  border: "none",
                  borderRadius: 6,
                  padding: "0.6rem 1.2rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(el) => (el.currentTarget.style.backgroundColor = "#c0392b")}
                onMouseLeave={(el) => (el.currentTarget.style.backgroundColor = errorColor)}
              >
                Excluir
              </button>
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
          marginTop: "2rem",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          style={{
            padding: "0.7rem 1.5rem",
            borderRadius: 8,
            border: `1px solid ${accentColor}`,
            background: page === 1 ? borderColor : whiteBg,
            color: accentColor,
            fontWeight: 600,
            cursor: page === 1 ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(el) => { if (page !== 1) el.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(el) => { if (page !== 1) el.currentTarget.style.transform = "translateY(0)"; }}
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
          style={{
            padding: "0.7rem 1.5rem",
            borderRadius: 8,
            border: `1px solid ${accentColor}`,
            background: page === totalPages ? borderColor : whiteBg,
            color: accentColor,
            fontWeight: 600,
            cursor: page === totalPages ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(el) => { if (page !== totalPages) el.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(el) => { if (page !== totalPages) el.currentTarget.style.transform = "translateY(0)"; }}
        >
          Próxima
        </button>
      </div>

      {editModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)", 
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            padding: "1rem",
          }}
          onClick={() => setEditModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleEditSubmit}
            style={{
              background: whiteBg,
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              padding: "2.5rem 2rem",
              maxWidth: 480, 
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
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
                top: 15,
                right: 20,
                background: "none",
                border: "none",
                fontSize: "2rem", 
                color: grayText,
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(el) => (el.currentTarget.style.color = primaryColor)}
              onMouseLeave={(el) => (el.currentTarget.style.color = grayText)}
            >
              &times;
            </button>
            <h3
              style={{
                color: primaryColor,
                fontWeight: 700,
                fontSize: "1.5rem", 
                marginBottom: 10,
                borderBottom: `1px solid ${borderColor}`,
                paddingBottom: 8,
              }}
            >
              Editar Evento
            </h3>

            {editError && (
              <div
                style={{
                  color: errorColor,
                  background: "#ffe9e8",
                  padding: "10px",
                  borderRadius: 8,
                }}
              >
                {editError}
              </div>
            )}
            {editSuccess && (
              <div
                style={{
                  color: successColor,
                  background: "#e8fff2",
                  padding: "10px",
                  borderRadius: 8,
                }}
              >
                {editSuccess}
              </div>
            )}

            <input
              name="titulo"
              value={editForm.titulo}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, titulo: e.target.value }))
              }
              placeholder="Título*"
              required
              style={{
                padding: "0.8rem",
                borderRadius: 8,
                border: `1px solid ${borderColor}`,
                fontSize: "1rem",
                color: textColor,
                outlineColor: accentColor,
              }}
            />
            <textarea
              name="descricao"
              value={editForm.descricao}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, descricao: e.target.value }))
              }
              placeholder="Descrição"
              rows="4" 
              style={{
                padding: "0.8rem",
                borderRadius: 8,
                border: `1px solid ${borderColor}`,
                fontSize: "1rem",
                color: textColor,
                outlineColor: accentColor,
                resize: "vertical", 
              }}
            />
            <label style={{ color: grayText, fontSize: "0.9rem" }}>Data de Início:</label>
            <input
              name="data_inicio"
              type="datetime-local"
              value={editForm.data_inicio}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, data_inicio: e.target.value }))
              }
              required
              style={{
                padding: "0.8rem",
                borderRadius: 8,
                border: `1px solid ${borderColor}`,
                fontSize: "1rem",
                color: textColor,
                outlineColor: accentColor,
              }}
            />
            <label style={{ color: grayText, fontSize: "0.9rem" }}>Data Final:</label>
            <input
              name="data_final"
              type="datetime-local"
              value={editForm.data_final}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, data_final: e.target.value }))
              }
              required
              style={{
                padding: "0.8rem",
                borderRadius: 8,
                border: `1px solid ${borderColor}`,
                fontSize: "1rem",
                color: textColor,
                outlineColor: accentColor,
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
                style={{ transform: "scale(1.2)" }} 
              />
              <label htmlFor="editAtivoEvento" style={{ color: textColor, fontSize: "1rem" }}>
                Evento Ativo
              </label>
            </div>
            <button
              type="submit"
              disabled={editLoading}
              style={{
                padding: "0.9rem",
                borderRadius: 8,
                border: "none",
                background: accentColor,
                color: whiteBg,
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: editLoading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s ease, transform 0.2s ease",
                marginTop: "1rem",
              }}
              onMouseEnter={(el) => { if (!editLoading) el.currentTarget.style.backgroundColor = "#2980b9"; el.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(el) => { if (!editLoading) el.currentTarget.style.backgroundColor = accentColor; el.currentTarget.style.transform = "translateY(0)"; }}
            >
              {editLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </div>
      )}
      <style>{`
        @media (min-width: 1080px) {
          .eventos-tabela-container { display: block !important; }
          .eventos-cards-container { display: none !important; }
        }
        @media (max-width: 1079px) {
          .eventos-tabela-container { display: none !important; }
          .eventos-cards-container { display: block !important; }
        }
      `}</style>
    </div>
  );
}