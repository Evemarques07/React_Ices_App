import { useState } from "react";
import { cargosAPI } from "../../services/api";

function CriarCargo({ token, onCriado }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);
    try {
      await cargosAPI.criarCargo({ nome, descricao, ativo }, token);
      setTimeout(() => {
        setSucesso("Cargo criado com sucesso!");
        setNome("");
        setDescricao("");
        setAtivo(true);
        setLoading(false);
        if (onCriado) onCriado();
      }, 800);
    } catch (error) {
      setErro("Erro ao criar cargo. Tente novamente.");
      setLoading(false);
    }
  };

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
        Criar Cargo
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
      <label style={{ fontWeight: 600 }}>Nome do Cargo *</label>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        style={{
          padding: "0.7rem",
          borderRadius: 8,
          border: "1px solid #ced4da",
        }}
        placeholder="Nome do cargo"
      />
      <button
        type="submit"
        disabled={loading}
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
        {loading ? "Salvando..." : "Salvar Cargo"}
      </button>
    </form>
  );
}

export default CriarCargo;
