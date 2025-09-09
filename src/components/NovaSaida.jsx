import React, { useState } from "react";
import { saidasAPI } from "../services/api";

const tiposPorCaixa = {
  financeiro: ["SAÍDA FIXA", "SAÍDA VARIÁVEL"],
  missionario: ["SAÍDA MISSÕES"],
  projetos: ["SAÍDA NOSSA CASA"],
};

const caixaLabels = {
  financeiro: "Financeiro",
  missionario: "Missionário",
  projetos: "Projetos",
};

export default function NovaSaida({ token, onSuccess }) {
  const [caixa, setCaixa] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [membroBusca, setMembroBusca] = useState("");
  const [membros, setMembros] = useState([]);
  const [membroId, setMembroId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Busca membros conforme digitação
  const handleBuscaChange = async (e) => {
    const termo = e.target.value;
    setMembroBusca(termo);
    setMembroId(null);
    setMembros([]);
    if (termo.length > 2 && tokenSalvo) {
      try {
        const { membrosAPI } = await import("../services/api");
        const lista = await membrosAPI.filtrarMembros(termo, tokenSalvo);
        setMembros(lista);
      } catch (err) {
        setError("Erro ao buscar membros");
      }
    }
  };

  let tokenSalvo = token;
  if (!tokenSalvo) {
    try {
      tokenSalvo = JSON.parse(localStorage.getItem("user"))?.access_token;
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (!caixa || !tipo || !valor || !data) {
        setError("Preencha todos os campos obrigatórios.");
        setLoading(false);
        return;
      }
      if (
        !membroId &&
        !window.confirm("Nenhum membro selecionado. Deseja continuar?")
      ) {
        setLoading(false);
        return;
      }
      const saida = {
        tipo,
        valor: Number(valor),
        data,
        descricao,
        membro_id: membroId || null,
      };
      let fn;
      if (caixa === "financeiro") fn = saidasAPI.criarSaidaFinanceira;
      else if (caixa === "missionario") fn = saidasAPI.criarSaidaMissionaria;
      else if (caixa === "projetos") fn = saidasAPI.criarSaidaProjetos;
      if (!fn) throw new Error("Função de saída não encontrada.");
      await fn(saida, tokenSalvo);
      setSuccess("Saída registrada com sucesso!");
      setCaixa("");
      setTipo("");
      setValor("");
      setData("");
      setDescricao("");
      setMembroBusca("");
      setMembros([]);
      setMembroId(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Erro ao registrar saída.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: "2rem",
        background: "#f8f9fa",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
      }}
    >
      <h2 style={{ color: "#005691", fontWeight: 700, fontSize: "1.3rem" }}>
        Registrar Saída
      </h2>
      {error && (
        <div
          style={{
            color: "#c53030",
            background: "#fff5f5",
            borderRadius: 8,
            padding: "0.7rem",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            color: "#28a745",
            background: "#e6ffed",
            borderRadius: 8,
            padding: "0.7rem",
          }}
        >
          {success}
        </div>
      )}
      <label style={{ fontWeight: 600 }}>Tipo de Caixa *</label>
      <select
        value={caixa}
        onChange={(e) => {
          setCaixa(e.target.value);
          setTipo("");
        }}
        style={{
          padding: "0.7rem",
          borderRadius: 8,
          border: "1px solid #ced4da",
        }}
      >
        <option value="">Selecione...</option>
        {Object.keys(caixaLabels).map((key) => (
          <option key={key} value={key}>
            {caixaLabels[key]}
          </option>
        ))}
      </select>
      <label style={{ fontWeight: 600 }}>Tipo de Saída *</label>
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        style={{
          padding: "0.7rem",
          borderRadius: 8,
          border: "1px solid #ced4da",
        }}
        disabled={!caixa}
      >
        <option value="">Selecione...</option>
        {caixa &&
          tiposPorCaixa[caixa].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
      </select>
      <label style={{ fontWeight: 600 }}>Valor *</label>
      <input
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        style={{
          padding: "0.7rem",
          borderRadius: 8,
          border: "1px solid #ced4da",
        }}
        min="0"
        step="0.01"
      />
      <label style={{ fontWeight: 600 }}>Data *</label>
      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        style={{
          padding: "0.7rem",
          borderRadius: 8,
          border: "1px solid #ced4da",
        }}
      />
      <label style={{ fontWeight: 600 }}>Descrição</label>
      <input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        style={{
          padding: "0.7rem",
          borderRadius: 8,
          border: "1px solid #ced4da",
        }}
        placeholder="Opcional"
      />
      <label style={{ fontWeight: 600 }}>Membro (Opcional)</label>
      <input
        type="text"
        value={membroBusca}
        onChange={handleBuscaChange}
        style={{
          padding: "0.7rem",
          borderRadius: 8,
          border: "1px solid #ced4da",
        }}
        placeholder="Digite para buscar..."
      />
      {membros.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: "0.5rem 0 0 0",
            padding: 0,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
            maxHeight: 160,
            overflowY: "auto",
            zIndex: 1,
            position: "relative",
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
                setMembroBusca(m.nome);
                setMembros([]);
              }}
            >
              {m.nome}
            </li>
          ))}
        </ul>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.9rem 1.5rem",
          borderRadius: 8,
          border: "none",
          background: "linear-gradient(90deg, #007bff, #0056b3)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 10px rgba(0,123,255,0.13)",
          marginTop: "1rem",
        }}
      >
        {loading ? "Registrando..." : "Registrar Saída"}
      </button>
    </form>
  );
}
