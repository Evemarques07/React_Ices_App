import React, { useEffect, useState } from "react";
import { membrosAPI } from "../../services/api";
import { maskCPF, maskPhone } from "../../utils/format";
function unmaskCPF(cpf) {
  return cpf.replace(/\D/g, "");
}

function unmaskPhone(phone) {
  return phone.replace(/\D/g, "");
}

export default function ListaTodosNomes() {
  const [membros, setMembros] = useState([]);
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
    nome: "",
    data_nascimento: "",
    telefone: "",
    email: "",
    endereco: "",
    data_entrada: "",
    ativo: true,
    cpf: "",
    tipo: "membro",
  });
  const limit = 20;

  useEffect(() => {
    async function fetchMembros() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).access_token
          : null;
        const skip = (page - 1) * limit;
        const res = await membrosAPI.listarTodosNomes(token, skip, limit);
        setMembros(res.items || res);
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
        setError(err.message || "Erro ao buscar membros");
        setMembros([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMembros();
  }, [page]);

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
      const dados = await membrosAPI.getMembroById(id, token);
      setEditForm({
        nome: dados.nome || "",
        data_nascimento: dados.data_nascimento || "",
        telefone: dados.telefone || "",
        email: dados.email || "",
        endereco: dados.endereco || "",
        data_entrada: dados.data_entrada || "",
        ativo: !!dados.ativo,
        cpf: dados.cpf || "",
        tipo: dados.tipo || "membro",
      });
    } catch (err) {
      setEditError("Erro ao carregar dados do membro.");
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
      const {
        nome,
        data_nascimento,
        telefone,
        email,
        endereco,
        data_entrada,
        ativo,
        cpf,
        tipo,
      } = editForm;
      const dadosParaPatch = {
        nome,
        data_nascimento,
        telefone: telefone ? unmaskPhone(telefone) : null,
        email: email ? email : null,
        endereco: endereco ? endereco : null,
        data_entrada,
        ativo: !!ativo,
        cpf: unmaskCPF(cpf),
        tipo,
      };
      console.log("Enviando para editar:", dadosParaPatch);
      await membrosAPI.editarMembro(editId, dadosParaPatch, token);
      setEditSuccess("Membro atualizado com sucesso!");
      setPage(1);
      setTimeout(() => {
        setEditSuccess("");
        setEditModal(false);
        setEditId(null);
        setEditForm({
          nome: "",
          data_nascimento: "",
          telefone: "",
          email: "",
          endereco: "",
          data_entrada: "",
          ativo: true,
          cpf: "",
          tipo: "membro",
        });
      }, 1200);
    } catch (err) {
      setEditError(err.message || "Erro ao atualizar membro.");
    } finally {
      setEditLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Campos para mostrar
  const campos = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome" },
    { key: "cpf", label: "CPF" },
    { key: "data_nascimento", label: "Data Nasc." },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "Email" },
    { key: "endereco", label: "Endereço" },
    { key: "data_entrada", label: "Data Entrada" },
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
        Lista de Membros
      </h3>
      {loading && <div>Carregando membros...</div>}
      {error && <div style={{ color: "#c53030", marginTop: 12 }}>{error}</div>}
      {/* Tabela para telas maiores */}
      <div className="membros-tabela" style={{ display: "none" }}>
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
            </tr>
          </thead>
          <tbody>
            {membros.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #e9ecef" }}>
                {campos.map((c) => (
                  <td key={c.key} style={{ padding: "8px" }}>
                    {c.key === "data_nascimento" || c.key === "data_entrada"
                      ? m[c.key]
                        ? new Date(m[c.key]).toLocaleDateString()
                        : "-"
                      : c.key === "ativo"
                      ? m.ativo
                        ? "Sim"
                        : "Não"
                      : m[c.key] || "-"}
                  </td>
                ))}
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => handleEdit(m.id)}
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.4rem 1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.95rem",
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cards para telas menores */}
      <div className="membros-cards" style={{ display: "block" }}>
        {membros.map((m) => (
          <div
            key={m.id}
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
                {m.nome}
              </div>
              <div style={{ color: "#333" }}>
                <b>ID:</b> {m.id}
              </div>
              <div style={{ color: "#333" }}>
                <b>CPF:</b> {m.cpf || "-"}
              </div>
              <button
                onClick={() => handleEdit(m.id)}
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
                }}
              >
                Editar
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.2rem",
                marginTop: 6,
              }}
            >
              <div style={{ color: "#333" }}>
                <b>Telefone:</b> {m.telefone || "-"}
              </div>
              <div style={{ color: "#333" }}>
                <b>Email:</b> {m.email || "-"}
              </div>
              <div style={{ color: "#333" }}>
                <b>Endereço:</b> {m.endereco || "-"}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.2rem",
                marginTop: 6,
              }}
            >
              <div style={{ color: "#333" }}>
                <b>Data Nasc.:</b>{" "}
                {m.data_nascimento
                  ? new Date(m.data_nascimento).toLocaleDateString()
                  : "-"}
              </div>
              <div style={{ color: "#333" }}>
                <b>Data Entrada:</b>{" "}
                {m.data_entrada
                  ? new Date(m.data_entrada).toLocaleDateString()
                  : "-"}
              </div>
              <div style={{ color: m.ativo ? "#28a745" : "#c53030" }}>
                <b>Status:</b> {m.ativo ? "Ativo" : "Inativo"}
              </div>
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
              Editar Membro
            </h3>
            <input
              name="nome"
              value={editForm.nome}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, nome: e.target.value }))
              }
              placeholder="Nome*"
              required
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="data_nascimento"
              type="date"
              value={editForm.data_nascimento}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, data_nascimento: e.target.value }))
              }
              required
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="telefone"
              value={editForm.telefone}
              onChange={(e) =>
                setEditForm((f) => ({
                  ...f,
                  telefone: maskPhone(e.target.value),
                }))
              }
              placeholder="Telefone"
              maxLength={15}
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="Email"
              type="email"
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="endereco"
              value={editForm.endereco}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, endereco: e.target.value }))
              }
              placeholder="Endereço"
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="data_entrada"
              type="date"
              value={editForm.data_entrada}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, data_entrada: e.target.value }))
              }
              required
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <input
              name="cpf"
              value={editForm.cpf}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, cpf: maskCPF(e.target.value) }))
              }
              placeholder="CPF*"
              required
              maxLength={14}
              style={{
                padding: "0.7rem",
                borderRadius: 6,
                border: "1px solid #ced4da",
              }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <label style={{ fontWeight: 500 }}>Tipo:</label>
              <select
                name="tipo"
                value={editForm.tipo}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, tipo: e.target.value }))
                }
                style={{
                  padding: "0.7rem",
                  borderRadius: 6,
                  border: "1px solid #ced4da",
                }}
              >
                <option value="membro">Membro</option>
                <option value="contribuinte">Contribuinte</option>
              </select>
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
                id="editAtivo"
              />
              <label htmlFor="editAtivo">Ativo</label>
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
          .membros-tabela { display: block !important; }
          .membros-cards { display: none !important; }
        }
        @media (max-width: 1079px) {
          .membros-tabela { display: none !important; }
          .membros-cards { display: block !important; }
        }
      `}</style>
    </div>
  );
}
