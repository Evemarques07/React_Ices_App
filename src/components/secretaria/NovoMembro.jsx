import React, { useState } from "react";
import { membrosAPI } from "../../services/api"; // Assuming this path is correct
import { maskCPF, maskPhone } from "../../utils/format"; // Assuming these paths are correct

export default function NovoMembro() {
  const [form, setForm] = useState({
    nome: "",
    data_nascimento: "",
    telefone: "",
    email: "",
    endereco: "",
    data_entrada: "",
    ativo: true,
    cpf: "",
    tipo: "membro",
    senha: "",
  });
  const [criarUsuario, setCriarUsuario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "cpf") {
      maskedValue = maskCPF(value);
    }
    if (name === "telefone") {
      maskedValue = maskPhone(value);
    }
    setForm((prev) => ({ ...prev, [name]: maskedValue }));
    // Atualiza ativo conforme tipo
    if (name === "tipo") {
      setForm((prev) => ({ ...prev, ativo: value === "membro" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      const body = {
        ...form,
        telefone: form.telefone ? form.telefone : null,
        email: form.email ? form.email : null,
        endereco: form.endereco ? form.endereco : null,
        ativo: form.tipo === "membro",
        tipo: form.tipo,
      };
      if (
        !body.nome ||
        !body.data_nascimento ||
        !body.data_entrada ||
        !body.cpf
      ) {
        setError("Preencha todos os campos obrigatórios, incluindo CPF.");
        setLoading(false);
        return;
      }
      if (criarUsuario) {
        if (!body.cpf) {
          setError("Informe o CPF para criar usuário.");
          setLoading(false);
          return;
        }
        if (!body.senha) {
          setError("Informe a senha para criar usuário.");
          setLoading(false);
          return;
        }
      } else {
        body.senha = "";
      }
      await membrosAPI.criarMembro(body, token);
      setSuccess("Membro cadastrado com sucesso!");
      setForm({
        nome: "",
        data_nascimento: "",
        telefone: "",
        email: "",
        endereco: "",
        data_entrada: "",
        ativo: true,
        cpf: "",
        tipo: "membro",
        senha: "",
      });
      setCriarUsuario(false);
    } catch (err) {
      setError(err.message || "Erro ao cadastrar membro.");
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
      <style>{`
        @media (max-width: 600px) {
          form {
            max-width: 98vw !important;
            padding: 0.2rem !important;
          }
        }
      `}</style>
      <h3
        style={{
          color: "#343a40",
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      >
        Novo Membro / Contribuinte
      </h3>
      {/* ...inputs e campos do formulário, mantendo estilos dos inputs... */}
      <input
        name="nome"
        value={form.nome}
        onChange={handleChange}
        placeholder="Nome Completo*"
        required
        style={{
          padding: "0.8rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ced4da",
          fontSize: "1rem",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label
          htmlFor="data_nascimento"
          style={{
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "#495057",
            fontSize: "0.95rem",
          }}
        >
          Data de Nascimento*
        </label>
        <input
          id="data_nascimento"
          name="data_nascimento"
          type="date"
          value={form.data_nascimento}
          onChange={handleChange}
          required
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ced4da",
            fontSize: "1rem",
          }}
        />
      </div>
      <input
        name="telefone"
        value={form.telefone}
        onChange={handleChange}
        placeholder="Telefone (Opcional)"
        maxLength={15}
        style={{
          padding: "0.8rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ced4da",
          fontSize: "1rem",
        }}
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email (Opcional)"
        type="email"
        style={{
          padding: "0.8rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ced4da",
          fontSize: "1rem",
        }}
      />
      <input
        name="endereco"
        value={form.endereco}
        onChange={handleChange}
        placeholder="Endereço (Opcional)"
        style={{
          padding: "0.8rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ced4da",
          fontSize: "1rem",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label
          htmlFor="data_entrada"
          style={{
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "#495057",
            fontSize: "0.95rem",
          }}
        >
          Data de Entrada*
        </label>
        <input
          id="data_entrada"
          name="data_entrada"
          type="date"
          value={form.data_entrada}
          onChange={handleChange}
          required
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ced4da",
            fontSize: "1rem",
          }}
        />
      </div>
      <input
        name="cpf"
        value={form.cpf}
        onChange={handleChange}
        placeholder="CPF*"
        maxLength={14}
        required
        style={{
          padding: "0.8rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ced4da",
          fontSize: "1rem",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginTop: "0.5rem",
        }}
      >
        <label
          htmlFor="tipo"
          style={{ fontWeight: 600, color: "#495057", fontSize: "0.95rem" }}
        >
          Tipo:
        </label>
        <select
          id="tipo"
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          style={{
            padding: "0.7rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ced4da",
            fontSize: "1rem",
            backgroundColor: "#fff",
            cursor: "pointer",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "16px 12px",
          }}
        >
          <option value="membro">Membro</option>
          <option value="contribuinte">Contribuinte</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          marginTop: "0.5rem",
        }}
      >
        <input
          type="checkbox"
          checked={criarUsuario}
          onChange={(e) => setCriarUsuario(e.target.checked)}
          id="criarUsuario"
          style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
        />
        <label
          htmlFor="criarUsuario"
          style={{
            fontWeight: 500,
            color: "#495057",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Criar usuário para este membro
        </label>
      </div>
      {criarUsuario && (
        <input
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          placeholder="Senha para login*"
          required
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ced4da",
            fontSize: "1rem",
          }}
        />
      )}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            maxWidth: "260px",
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
            boxShadow: loading
              ? "none"
              : "0 4px 14px 0 rgba(0, 118, 255, 0.39)",
          }}
        >
          {loading ? "Salvando..." : "Cadastrar Membro"}
        </button>
      </div>
      {error && (
        <div
          style={{
            color: "#dc3545",
            marginTop: "1rem",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            color: "#28a745",
            marginTop: "1rem",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {success}
        </div>
      )}
    </form>
  );
}
