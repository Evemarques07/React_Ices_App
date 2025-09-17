import { useEffect, useState } from "react";
import { usuariosAPI } from "../../services/api"; // Assumindo que este caminho está correto
import { maskCPF } from "../../utils/format"; // Assumindo que este caminho está correto

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const primaryColor = "#2c3e50"; // Azul escuro para títulos e elementos principais
  const accentColor = "#3498db"; // Azul mais claro para detalhes e hover
  const successColor = "#2ecc71"; // Verde para sucesso
  const errorColor = "#e74c3c"; // Vermelho para erro/exclusão
  const borderColor = "#ecf0f1"; // Cinza claro para bordas
  const textColor = "#34495e"; // Cinza escuro para texto
  const lightBg = "#fdfdfe"; // Fundo leve para cards/tabela
  const grayText = "#7f8c8d"; // Texto cinza para descrições

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
        setError(err.message || "Erro ao buscar usuários.");
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
      setTimeout(() => setSuccess(""), 2000); // Aumentei o tempo para ver a mensagem
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
    { key: "ativo", label: "Status" }, // Renomeado para 'Status'
  ];

  return (
    <div style={{ paddingTop: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      {loading && (
        <div style={{ textAlign: "center", color: grayText, fontSize: "1.1rem", padding: "20px 0" }}>
          Carregando usuários...
        </div>
      )}
      {error && <div style={{ color: errorColor, marginTop: 12, padding: "10px", background: "#ffe9e8", borderRadius: 8 }}>{error}</div>}
      {success && (
        <div style={{ color: successColor, marginTop: 12, padding: "10px", background: "#e8fff2", borderRadius: 8 }}>{success}</div>
      )}

      {/* Tabela para telas maiores */}
      <div className="usuarios-tabela-container" style={{ display: "none" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
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
            {usuarios.map((u) => (
              <tr
                key={u.id}
                style={{
                  background: lightBg,
                  borderRadius: 8,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                {campos.map((c) => (
                  <td key={c.key} style={{ padding: "12px 15px", color: textColor, fontSize: "0.95rem" }}>
                    {c.key === "ativo"
                      ? u.ativo
                        ? <span style={{ color: successColor, fontWeight: 600 }}>Ativo</span>
                        : <span style={{ color: errorColor, fontWeight: 600 }}>Inativo</span>
                      : c.key === "cpf"
                      ? maskCPF(u.cpf)
                      : u[c.key] || "-"}
                  </td>
                ))}
                <td style={{ padding: "12px 15px", textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{
                      background: errorColor,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.6rem 1.2rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = errorColor)}
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
      <div className="usuarios-cards-container" style={{ display: "block" }}>
        {usuarios.map((u) => (
          <div
            key={u.id}
            style={{
              background: lightBg,
              borderRadius: 10,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              padding: "0.8rem",
              marginBottom: "1.5rem",
              border: `1px solid ${borderColor}`,
              position: "relative",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: primaryColor,
                  fontSize: "0.8rem",
                  marginBottom: "0.5rem",
                }}
              >
                {u.nome || "-"}
              </div>
              <div style={{ color: textColor, fontSize: "0.8rem" }}>
                <b style={{ color: grayText }}>CPF:</b> {maskCPF(u.cpf) || "-"}
              </div>
              <div style={{ color: u.ativo ? successColor : errorColor, fontSize: "0.8rem", fontWeight: 600 }}>
                <b style={{ color: grayText }}>Status:</b> {u.ativo ? "Ativo" : "Inativo"}
              </div>
              <button
                onClick={() => handleDelete(u.id)}
                style={{
                  marginTop: "0.8rem",
                  background: errorColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.7rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  alignSelf: "flex-start", // Alinha o botão à esquerda nos cards
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = errorColor)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 1080px) {
          .usuarios-tabela-container { display: block !important; }
          .usuarios-cards-container { display: none !important; }
        }
        @media (max-width: 1079px) {
          .usuarios-tabela-container { display: none !important; }
          .usuarios-cards-container { display: block !important; }
        }
      `}</style>
    </div>
  );
}