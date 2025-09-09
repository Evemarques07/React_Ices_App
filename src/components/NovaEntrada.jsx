import React, { useState } from "react";
import { entradasAPI, membrosAPI } from "../services/api";

const tiposPorCaixa = {
  financeiro: ["DÍZIMO", "OFERTA COMUM", "ENTRADA MEAN"],
  missionario: ["COMPROMISSO DE FÉ", "OFERTA MISSÕES"],
  projetos: ["NOSSA CASA"],
};

const caixaLabels = {
  financeiro: "Financeiro",
  missionario: "Missionário",
  projetos: "Projetos",
};

export default function NovaEntrada({ token, onSuccess }) {
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

  let tokenSalvo = token;
  if (!tokenSalvo) {
    try {
      tokenSalvo = JSON.parse(localStorage.getItem("user"))?.access_token;
    } catch {}
  }

  const handleBuscaChange = async (e) => {
    const termo = e.target.value;
    setMembroBusca(termo);
    setMembroId(null);
    setMembros([]);
    if (termo.length > 2 && tokenSalvo) {
      try {
        const lista = await membrosAPI.filtrarMembros(termo, tokenSalvo);
        setMembros(lista);
      } catch (err) {
        setError("Erro ao buscar membros");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!caixa || !tipo || !data || !valor || valor <= 0) {
        setError("Preencha todos os campos obrigatórios com valores válidos.");
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
      const entrada = {
        tipo,
        valor: Number(valor),
        data,
        descricao,
        membro_id: membroId || null,
      };
      let fn;
      if (caixa === "financeiro") fn = entradasAPI.criarEntrada;
      else if (caixa === "missionario")
        fn = entradasAPI.criarEntradaMissionaria;
      else if (caixa === "projetos") fn = entradasAPI.criarEntradaProjetos;
      if (!fn) throw new Error("Função de entrada não encontrada.");
      await fn(entrada, tokenSalvo);
      setSuccess("Entrada registrada com sucesso!");
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
      setError(err.message || "Erro ao registrar entrada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 420,
        margin: "2rem auto",
        background: "#f7fafc",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 123, 182, 0.1)",
        padding: "2.5rem",
        border: "1px solid #e2e8f0",
        maxHeight: "85vh",
        overflowY: "auto",
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
        Nova Entrada
      </h3>
      {error && (
        <div
          style={{
            background: "#fff5f5",
            color: "#9b2c2c",
            border: "1px solid #fed7d7",
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
            background: "#e6fffa",
            color: "#2c7a7b",
            border: "1px solid #b2f5ea",
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
      <label style={{ fontWeight: 600 }}>Tipo de Entrada *</label>
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
        {loading ? "Salvando..." : "Salvar Entrada"}
      </button>
    </form>
  );
}
