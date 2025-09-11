import { useEffect, useState } from "react";
import { usuariosAPI } from "../../services/api";
import { maskCPF } from "../../utils/format";

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).access_token
          : null;
        const res = await usuariosAPI.listarUsuarios(token);
        setUsuarios(res.items || res);
      } catch (err) {
        setError(err.message || "Erro ao buscar usuários");
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, [success]);

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      await usuariosAPI.deletarUsuario(id, token);
      setUsuarios(usuarios.filter((u) => u.id !== id));
      setSuccess("Usuário excluído com sucesso!");
      setTimeout(() => setSuccess(""), 1200);
    } catch (err) {
      alert("Erro ao excluir usuário: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }

  // Campos para mostrar
  const campos = [
    { key: "nome", label: "Nome" },
    { key: "cpf", label: "CPF" },
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
        Lista de Usuários
      </h3>
      {loading && <div>Carregando usuários...</div>}
      {error && <div style={{ color: "#c53030", marginTop: 12 }}>{error}</div>}
      {success && (
        <div style={{ color: "#28a745", marginTop: 12 }}>{success}</div>
      )}
      {/* Tabela para telas maiores */}
      <div className="usuarios-tabela" style={{ display: "none" }}>
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
            {usuarios.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #e9ecef" }}>
                {campos.map((c) => (
                  <td key={c.key} style={{ padding: "8px" }}>
                    {c.key === "ativo"
                      ? u.ativo
                        ? "Sim"
                        : "Não"
                      : c.key === "cpf"
                      ? maskCPF(u.cpf)
                      : u[c.key] || "-"}
                  </td>
                ))}
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => handleDelete(u.id)}
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
      <div className="usuarios-cards" style={{ display: "block" }}>
        {usuarios.map((u) => (
          <div
            key={u.id}
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
                {u.nome || "-"}
              </div>
              <div style={{ color: "#333" }}>
                <b>CPF:</b> {maskCPF(u.cpf) || "-"}
              </div>
              <div style={{ color: u.ativo ? "#28a745" : "#c53030" }}>
                <b>Status:</b> {u.ativo ? "Ativo" : "Inativo"}
              </div>
              <button
                onClick={() => handleDelete(u.id)}
                style={{
                  marginLeft: "auto",
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
          </div>
        ))}
      </div>
      <style>{`
        @media (min-width: 1080px) {
          .usuarios-tabela { display: block !important; }
          .usuarios-cards { display: none !important; }
        }
        @media (max-width: 1079px) {
          .usuarios-tabela { display: none !important; }
          .usuarios-cards { display: block !important; }
        }
      `}</style>
    </div>
  );
}
