import React, { useState } from "react";
import { membrosAPI } from "../../services/api";
import { maskCPF, maskPhone } from "../../utils/format";

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
    sexo: "",
    nome_pai: "",
    nome_mae: "",
    estado_civil: "",
    data_casamento: "",
    nome_conjuge: "",
    data_nascimento_conjuge: "",
    data_batismo: "",
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
        sexo: "",
        nome_pai: "",
        nome_mae: "",
        estado_civil: "",
        data_casamento: "",
        nome_conjuge: "",
        data_nascimento_conjuge: "",
        data_batismo: "",
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
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflowY: "auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "750px",
          margin: "0 auto",
          padding: "1rem",
          // borderRadius: "8px",
          // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          backgroundColor: "#fff",
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            form {
              padding: 1.5rem;
            }
            .responsive-grid {
              flex-direction: column;
            }
          }
        `}</style>
        <h3
          style={{
            color: "#343a40",
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Novo Membro / Contribuinte
        </h3>

        {/* Campos Principais */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
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

          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: "1", minWidth: "200px" }}>
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
                  width: "100%",
                }}
              />
            </div>
            <div style={{ flex: "1", minWidth: "200px" }}>
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
                  width: "100%",
                }}
              />
            </div>
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
        </div>

        {/* Seção de Contato */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <h4
            style={{
              color: "#555",
              borderBottom: "1px solid #eee",
              paddingBottom: "0.5rem",
            }}
          >
            Informações de Contato
          </h4>
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
        </div>

        {/* Seção de Informações Adicionais */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <h4
            style={{
              color: "#555",
              borderBottom: "1px solid #eee",
              paddingBottom: "0.5rem",
            }}
          >
            Informações Adicionais
          </h4>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
              }}
            >
              <option value="">Sexo (Opcional)</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label
                htmlFor="data_batismo"
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#495057",
                  fontSize: "0.95rem",
                }}
              >
                Data do Batismo
              </label>
              <input
                id="data_batismo"
                name="data_batismo"
                type="date"
                value={form.data_batismo}
                onChange={handleChange}
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  fontSize: "1rem",
                  width: "100%",
                }}
              />
            </div>
            <input
              name="nome_pai"
              value={form.nome_pai}
              onChange={handleChange}
              placeholder="Nome do Pai (Opcional)"
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
                flex: "1",
                minWidth: "150px",
              }}
            />
            <input
              name="nome_mae"
              value={form.nome_mae}
              onChange={handleChange}
              placeholder="Nome da Mãe (Opcional)"
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
                flex: "1",
                minWidth: "150px",
              }}
            />
          </div>

          <select
            name="estado_civil"
            value={form.estado_civil}
            onChange={handleChange}
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ced4da",
              fontSize: "1rem",
            }}
          >
            <option value="">Estado Civil (Opcional)</option>
            <option value="solteiro">Solteiro</option>
            <option value="casado">Casado</option>
            <option value="divorciado">Divorciado</option>
            <option value="viuvo">Viúvo</option>
          </select>

          {form.estado_civil === "casado" && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <label
                    htmlFor="data_casamento"
                    style={{
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      color: "#495057",
                      fontSize: "0.95rem",
                    }}
                  >
                    Data do Casamento
                  </label>
                  <input
                    id="data_casamento"
                    name="data_casamento"
                    type="date"
                    value={form.data_casamento}
                    onChange={handleChange}
                    style={{
                      padding: "0.8rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid #ced4da",
                      fontSize: "1rem",
                      width: "100%",
                    }}
                  />
                </div>
                
              </div>
              <input
                name="nome_conjuge"
                value={form.nome_conjuge}
                onChange={handleChange}
                placeholder="Nome do Cônjuge"
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                  fontSize: "1rem",
                }}
              />
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label
                  htmlFor="data_nascimento_conjuge"
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#495057",
                    fontSize: "0.95rem",
                  }}
                >
                  Nascimento do Cônjuge
                </label>
                <input
                  id="data_nascimento_conjuge"
                  name="data_nascimento_conjuge"
                  type="date"
                  value={form.data_nascimento_conjuge}
                  onChange={handleChange}
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #ced4da",
                    fontSize: "1rem",
                    width: "100%",
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Tipo e Usuário */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1rem",
              }}
            >
              <option value="membro">Membro</option>
              <option value="contribuinte">Contribuinte</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
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
        </div>

        {/* Botão de Envio e Mensagens de Feedback */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
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
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1.05rem",
              boxShadow: loading
                ? "none"
                : "0 4px 14px 0 rgba(0, 118, 255, 0.39)",
            }}
          >
            {loading ? "Salvando..." : "Cadastrar Membro"}
          </button>
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
        </div>
      </form>
    </div>
  );
}
