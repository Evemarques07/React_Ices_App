import { useState } from "react";
import { usuariosAPI, membrosAPI } from "../../services/api";

export default function CriarUsuario({ token, onCriado }) {
  const [nomeBusca, setNomeBusca] = useState("");
  const [membros, setMembros] = useState([]);
  const [membroId, setMembroId] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function buscarMembros(e) {
    setNomeBusca(e.target.value);
    setMembroId(""); // Limpa seleção ao digitar
    if (e.target.value.length < 2) {
      setMembros([]);
      return;
    }
    try {
      const res = await membrosAPI.filtrarMembros(e.target.value, token);
      setMembros(res.items || res);
    } catch {
      setMembros([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);
    try {
      await usuariosAPI.criarUsuario({ membro_id: membroId }, token);
      setSucesso("Usuário criado com sucesso!");
      setNomeBusca("");
      setMembroId("");
      setMembros([]);
      if (onCriado) onCriado();
    } catch (err) {
      setErro(err.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        borderRadius: 0,
        boxShadow: "none",
        padding: "0.5rem",
        border: "none",
        minHeight: "auto",
        maxHeight: "none",
        overflowY: "visible",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
      }}
    >
      <h3
        style={{
          color: "#005a8c",
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      >
        Criar Usuário
      </h3>
      {erro && (
        <div
          style={{
            background: "#fff5f5",
            color: "#9b2c2c",
            border: "1px solid #fed7d7",
            borderRadius: 8,
            padding: "0.7rem",
          }}
        >
          {erro}
        </div>
      )}
      {sucesso && (
        <div
          style={{
            background: "#e6fffa",
            color: "#2c7a7b",
            border: "1px solid #b2f5ea",
            borderRadius: 8,
            padding: "0.7rem",
          }}
        >
          {sucesso}
        </div>
      )}
      <label style={{ fontWeight: 600 }}>Buscar Membro *</label>
      <input
        value={nomeBusca}
        onChange={buscarMembros}
        placeholder="Digite o nome..."
        style={{
          padding: "0.7rem",
          borderRadius: 8,
          border: "1px solid #ced4da",
        }}
        readOnly={!!membroId}
      />
      <div style={{ position: "relative" }}>
        {membros.length > 0 && !membroId && (
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
                  color: membroId === m.id ? "#0077b6" : "#2d3748",
                  background: membroId === m.id ? "#ebf8ff" : "#fff",
                  fontWeight: membroId === m.id ? "bold" : "normal",
                  borderBottom:
                    idx === membros.length - 1 ? "none" : "1px solid #f1f5f9",
                }}
                onClick={() => {
                  setMembroId(m.id);
                  setNomeBusca(m.nome);
                  setMembros([]);
                }}
              >
                {m.nome} {m.id === membroId ? "✓" : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !membroId}
        style={{
          width: "100%",
          background: loading
            ? "#a0aec0"
            : "linear-gradient(45deg, #0077b6, #0097d8)",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: 8,
          padding: "1rem 1.5rem",
          marginTop: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1.05rem",
          boxShadow: loading ? "none" : "0 4px 14px 0 rgba(0, 118, 255, 0.39)",
          transition: "transform 0.2s ease, box-shadow 0.3s ease",
        }}
      >
        {loading ? "Salvando..." : "Criar Usuário"}
      </button>
    </form>
  );
}
