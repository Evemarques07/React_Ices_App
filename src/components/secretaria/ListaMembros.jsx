import React, { useEffect, useState } from "react";
import { membrosAPI } from "../../services/api";
import { maskCPF, maskPhone } from "../../utils/format";

export default function ListaMembros() {
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState(false);
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
    sexo: "",
    nome_pai: "",
    nome_mae: "",
    estado_civil: "",
    data_casamento: "",
    nome_conjuge: "",
    data_nascimento_conjuge: "",
    data_batismo: "",
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
        let res;
        if (filtroNome.trim() !== "") {
          res = await membrosAPI.filtrarApenasMembros(filtroNome.trim(), token);
          setFiltroAtivo(true);
        } else {
          res = await membrosAPI.getMembros(token, skip, limit);
          setFiltroAtivo(false);
        }
        if (res.membros && typeof res.total === "number") {
          setMembros(res.membros);
          setTotal(res.total);
        } else if (res.items && typeof res.total === "number") {
          setMembros(res.items);
          setTotal(res.total);
        } else if (Array.isArray(res)) {
          setMembros(res);
          setTotal(skip + res.length + (res.length === limit ? limit : 0));
        } else {
          setMembros([]);
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
  }, [page, filtroNome]);
  function handleFiltroSubmit(e) {
    e.preventDefault();
    setPage(1);
  }

  function handleLimparFiltro() {
    setFiltroNome("");
    setPage(1);
  }

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
        sexo: dados.sexo || "",
        nome_pai: dados.nome_pai || "",
        nome_mae: dados.nome_mae || "",
        estado_civil: dados.estado_civil || "",
        data_casamento: dados.data_casamento || "",
        nome_conjuge: dados.nome_conjuge || "",
        data_nascimento_conjuge: dados.data_nascimento_conjuge || "",
        data_batismo: dados.data_batismo || "",
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
        sexo,
        nome_pai,
        nome_mae,
        estado_civil,
        data_casamento,
        nome_conjuge,
        data_nascimento_conjuge,
        data_batismo,
      } = editForm;
      const dadosParaPatch = {
        nome,
        data_nascimento,
        telefone: telefone ? maskPhone(telefone) : null,
        email: email ? email : null,
        endereco: endereco ? endereco : null,
        data_entrada,
        ativo: !!ativo,
        cpf: maskCPF(cpf),
        tipo,
        sexo: sexo === "" ? null : sexo,
        nome_pai: nome_pai === "" ? null : nome_pai,
        nome_mae: nome_mae === "" ? null : nome_mae,
        estado_civil: estado_civil === "" ? null : estado_civil,
        data_casamento: data_casamento === "" ? null : data_casamento,
        nome_conjuge: nome_conjuge === "" ? null : nome_conjuge,
        data_nascimento_conjuge:
          data_nascimento_conjuge === "" ? null : data_nascimento_conjuge,
        data_batismo: data_batismo === "" ? null : data_batismo,
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
    { key: "tipo", label: "Tipo" },
    { key: "sexo", label: "Sexo" },
    { key: "data_batismo", label: "Data Batismo" },
    { key: "nome_pai", label: "Nome do Pai" },
    { key: "nome_mae", label: "Nome da Mãe" },
    { key: "estado_civil", label: "Estado Civil" },
    { key: "data_casamento", label: "Data Casamento" },
    { key: "nome_conjuge", label: "Nome do Cônjuge" },
    { key: "data_nascimento_conjuge", label: "Data Nasc. do Cônjuge" },
  ];

  return (
    <div style={{ padding: "2rem 0", position: "relative" }}>
      {/* Filtro por nome */}
      <h2>Lista de Membros ({total})</h2>
      <form
        onSubmit={handleFiltroSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: 24,
        }}
      >
        <input
          type="text"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          placeholder="Filtrar por nome..."
          style={{
            padding: "0.7rem",
            borderRadius: 6,
            border: "1px solid #ced4da",
            fontSize: "1rem",
            minWidth: 220,
          }}
        />
        <button
          type="submit"
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.6rem 1.2rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Filtrar
        </button>
        {filtroAtivo && (
          <button
            type="button"
            onClick={handleLimparFiltro}
            style={{
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.6rem 1.2rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Limpar filtro
          </button>
        )}
      </form>
      {/* <h3
        style={{
          color: "#007bff",
          fontWeight: 600,
          fontSize: "1.3rem",
          marginBottom: 24,
        }}
      >
        Lista de Membros
      </h3> */}
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {membros.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #e9ecef" }}>
                {campos.map((c) => (
                  <td key={c.key} style={{ padding: "8px" }}>
                    {c.key === "data_nascimento" ||
                    c.key === "data_entrada" ||
                    c.key === "data_batismo" ||
                    c.key === "data_casamento" ||
                    c.key === "data_nascimento_conjuge"
                      ? m[c.key]
                        ? new Date(m[c.key]).toLocaleDateString("pt-BR")
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
      <div className="membros-cards">
        {membros.map((m) => (
          <div
            key={m.id}
            style={{
              background: "#ffffff",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Header do Card com Nome, ID e Status */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e9ecef",
                paddingBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.8rem",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "#005691",
                    fontSize: "1.4rem",
                  }}
                >
                  {m.nome}
                </div>
                <span style={{ color: "#777", fontSize: "0.9rem" }}>
                  ID: {m.id}
                </span>
              </div>
              <div
                style={{
                  color: m.ativo ? "#28a745" : "#c53030",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  background: m.ativo ? "#e9f7ef" : "#fbe9eb",
                  padding: "0.4rem 0.8rem",
                  borderRadius: 20,
                }}
              >
                {m.ativo ? "Ativo" : "Inativo"}
              </div>
            </div>

            {/* Conteúdo do Card - Agrupado em seções */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.2rem",
              }}
            >
              {/* Seção 1: Informações Pessoais */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                <h4
                  style={{
                    color: "#005691",
                    marginBottom: "0.4rem",
                    fontSize: "1rem",
                  }}
                >
                  Dados Pessoais
                </h4>
                <div style={{ color: "#333" }}>
                  <b>CPF:</b> {m.cpf || "-"}
                </div>
                <div style={{ color: "#333" }}>
                  <b>Data Nasc.:</b>{" "}
                  {m.data_nascimento
                    ? new Date(m.data_nascimento).toLocaleDateString()
                    : "-"}
                </div>
                <div style={{ color: "#333" }}>
                  <b>Sexo:</b> {m.sexo || "-"}
                </div>
                <div style={{ color: "#333" }}>
                  <b>Estado Civil:</b> {m.estado_civil || "-"}
                </div>
              </div>

              {/* Seção 2: Contato e Endereço */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                <h4
                  style={{
                    color: "#005691",
                    marginBottom: "0.4rem",
                    fontSize: "1rem",
                  }}
                >
                  Contato
                </h4>
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

              {/* Seção 3: Filiação e Outros Dados */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                <h4
                  style={{
                    color: "#005691",
                    marginBottom: "0.4rem",
                    fontSize: "1rem",
                  }}
                >
                  Filiação e Batismo
                </h4>
                <div style={{ color: "#333" }}>
                  <b>Nome do Pai:</b> {m.nome_pai || "-"}
                </div>
                <div style={{ color: "#333" }}>
                  <b>Nome da Mãe:</b> {m.nome_mae || "-"}
                </div>
                <div style={{ color: "#333" }}>
                  <b>Data Batismo:</b>{" "}
                  {m.data_batismo
                    ? new Date(m.data_batismo).toLocaleDateString()
                    : "-"}
                </div>
                <div style={{ color: "#333" }}>
                  <b>Data Entrada:</b>{" "}
                  {m.data_entrada
                    ? new Date(m.data_entrada).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              {/* Seção 4: Dados do Cônjuge (visível apenas se for casado) */}
              {m.estado_civil === "casado" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                  }}
                >
                  <h4
                    style={{
                      color: "#005691",
                      marginBottom: "0.4rem",
                      fontSize: "1rem",
                    }}
                  >
                    Dados do Cônjuge
                  </h4>
                  <div style={{ color: "#333" }}>
                    <b>Nome:</b> {m.nome_conjuge || "-"}
                  </div>
                  <div style={{ color: "#333" }}>
                    <b>Data Nasc.:</b>{" "}
                    {m.data_nascimento_conjuge
                      ? new Date(m.data_nascimento_conjuge).toLocaleDateString()
                      : "-"}
                  </div>
                  <div style={{ color: "#333" }}>
                    <b>Data Casamento:</b>{" "}
                    {m.data_casamento
                      ? new Date(m.data_casamento).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              )}
            </div>

            {/* Botão de Edição */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={() => handleEdit(m.id)}
                style={{
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.6rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background-color 0.2s ease-in-out",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0056b3")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Botões de navegação */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "2rem",
          padding: "1rem",
          background: "#f8f9fa",
          borderRadius: 8,
        }}
      >
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          style={{
            padding: "0.6rem 1.2rem",
            border: "1px solid #007bff",
            borderRadius: 6,
            background: page === 1 ? "#e9ecef" : "#fff",
            color: page === 1 ? "#6c757d" : "#007bff",
            cursor: page === 1 ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={membros.length < limit}
          style={{
            padding: "0.6rem 1.2rem",
            border: "1px solid #007bff",
            borderRadius: 6,
            background: membros.length < limit ? "#e9ecef" : "#fff",
            color: membros.length < limit ? "#6c757d" : "#007bff",
            cursor: membros.length < limit ? "not-allowed" : "pointer",
            fontWeight: 600,
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
            background: "rgba(0,0,0,0.6)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            padding: "2rem",
          }}
          onClick={() => setEditModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleEditSubmit}
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              padding: "2rem",
              maxWidth: 700,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              position: "relative",
              maxHeight: "95vh",
              overflowY: "auto",
            }}
          >
            {/* --- CABEÇALHO --- */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e9ecef",
                paddingBottom: "1rem",
              }}
            >
              <h3
                style={{
                  color: "#007bff",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  margin: 0,
                }}
              >
                Editar Membro
              </h3>
              <button
                type="button"
                onClick={() => setEditModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "2rem",
                  color: "#888",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            {/* --- SEÇÃO: DADOS PESSOAIS --- */}
            <fieldset
              style={{
                border: "1px solid #dee2e6",
                borderRadius: 8,
                padding: "1rem",
              }}
            >
              <legend
                style={{
                  fontWeight: 600,
                  color: "#005691",
                  padding: "0 0.5rem",
                }}
              >
                Dados Pessoais
              </legend>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="nome">Nome Completo*</label>
                  <input
                    id="nome"
                    name="nome"
                    value={editForm.nome}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, nome: e.target.value }))
                    }
                    placeholder="Nome Completo do Membro"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cpf">CPF*</label>
                  <input
                    id="cpf"
                    name="cpf"
                    value={editForm.cpf}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        cpf: maskCPF(e.target.value),
                      }))
                    }
                    placeholder="000.000.000-00"
                    required
                    maxLength={14}
                  />
                </div>
                <div>
                  <label htmlFor="data_nascimento">Data de Nascimento*</label>
                  <input
                    id="data_nascimento"
                    name="data_nascimento"
                    type="date"
                    value={editForm.data_nascimento}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        data_nascimento: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="sexo">Sexo</label>
                  <select
                    id="sexo"
                    name="sexo"
                    value={editForm.sexo}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, sexo: e.target.value }))
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="estado_civil">Estado Civil</label>
                  <select
                    id="estado_civil"
                    name="estado_civil"
                    value={editForm.estado_civil}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        estado_civil: e.target.value,
                      }))
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* --- SEÇÃO: CONTATO --- */}
            <fieldset
              style={{
                border: "1px solid #dee2e6",
                borderRadius: 8,
                padding: "1rem",
              }}
            >
              <legend
                style={{
                  fontWeight: 600,
                  color: "#005691",
                  padding: "0 0.5rem",
                }}
              >
                Contato
              </legend>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    id="telefone"
                    name="telefone"
                    value={editForm.telefone}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        telefone: maskPhone(e.target.value),
                      }))
                    }
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="exemplo@email.com"
                    type="email"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    id="endereco"
                    name="endereco"
                    value={editForm.endereco}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, endereco: e.target.value }))
                    }
                    placeholder="Rua, Número, Bairro, Cidade - Estado"
                  />
                </div>
              </div>
            </fieldset>

            {/* --- SEÇÃO: FILIAÇÃO --- */}
            <fieldset
              style={{
                border: "1px solid #dee2e6",
                borderRadius: 8,
                padding: "1rem",
              }}
            >
              <legend
                style={{
                  fontWeight: 600,
                  color: "#005691",
                  padding: "0 0.5rem",
                }}
              >
                Filiação
              </legend>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label htmlFor="nome_pai">Nome do Pai</label>
                  <input
                    id="nome_pai"
                    name="nome_pai"
                    value={editForm.nome_pai}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, nome_pai: e.target.value }))
                    }
                    placeholder="Nome completo do pai"
                  />
                </div>
                <div>
                  <label htmlFor="nome_mae">Nome da Mãe</label>
                  <input
                    id="nome_mae"
                    name="nome_mae"
                    value={editForm.nome_mae}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, nome_mae: e.target.value }))
                    }
                    placeholder="Nome completo da mãe"
                  />
                </div>
              </div>
            </fieldset>

            {/* --- SEÇÃO CONDICIONAL: DADOS DO CÔNJUGE --- */}
            {editForm.estado_civil === "casado" && (
              <fieldset
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: 8,
                  padding: "1rem",
                }}
              >
                <legend
                  style={{
                    fontWeight: 600,
                    color: "#005691",
                    padding: "0 0.5rem",
                  }}
                >
                  Dados do Cônjuge
                </legend>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="nome_conjuge">Nome do Cônjuge</label>
                    <input
                      id="nome_conjuge"
                      name="nome_conjuge"
                      value={editForm.nome_conjuge}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          nome_conjuge: e.target.value,
                        }))
                      }
                      placeholder="Nome completo do cônjuge"
                    />
                  </div>
                  <div>
                    <label htmlFor="data_casamento">Data do Casamento</label>
                    <input
                      id="data_casamento"
                      name="data_casamento"
                      type="date"
                      value={editForm.data_casamento}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          data_casamento: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="data_nascimento_conjuge">
                      Nascimento do Cônjuge
                    </label>
                    <input
                      id="data_nascimento_conjuge"
                      name="data_nascimento_conjuge"
                      type="date"
                      value={editForm.data_nascimento_conjuge}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          data_nascimento_conjuge: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </fieldset>
            )}

            {/* --- SEÇÃO: INFORMAÇÕES DA IGREJA --- */}
            <fieldset
              style={{
                border: "1px solid #dee2e6",
                borderRadius: 8,
                padding: "1rem",
              }}
            >
              <legend
                style={{
                  fontWeight: 600,
                  color: "#005691",
                  padding: "0 0.5rem",
                }}
              >
                Informações da Igreja
              </legend>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label htmlFor="data_entrada">Data de Entrada*</label>
                  <input
                    id="data_entrada"
                    name="data_entrada"
                    type="date"
                    value={editForm.data_entrada}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        data_entrada: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="data_batismo">Data do Batismo</label>
                  <input
                    id="data_batismo"
                    name="data_batismo"
                    type="date"
                    value={editForm.data_batismo}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        data_batismo: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="tipo">Tipo de Cadastro</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={editForm.tipo}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, tipo: e.target.value }))
                    }
                  >
                    <option value="membro">Membro</option>
                    <option value="contribuinte">Contribuinte</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifySelf: "start",
                    marginTop: "1.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    id="editAtivo"
                    checked={editForm.ativo}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, ativo: e.target.checked }))
                    }
                    style={{ width: "auto", marginRight: "0.5rem" }}
                  />
                  <label htmlFor="editAtivo" style={{ marginBottom: 0 }}>
                    Membro Ativo
                  </label>
                </div>
              </div>
            </fieldset>

            {/* --- BOTÕES E MENSAGENS --- */}
            <div style={{ marginTop: "1rem" }}>
              <button
                type="submit"
                disabled={editLoading}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  borderRadius: 8,
                  border: "none",
                  background: editLoading ? "#6c757d" : "#007bff",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  cursor: editLoading ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                {editLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
              {editError && (
                <div
                  style={{
                    color: "#c53030",
                    marginTop: "1rem",
                    textAlign: "center",
                  }}
                >
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div
                  style={{
                    color: "#28a745",
                    marginTop: "1rem",
                    textAlign: "center",
                  }}
                >
                  {editSuccess}
                </div>
              )}
            </div>
          </form>

          {/* --- ESTILOS CSS GLOBAIS PARA O FORMULÁRIO --- */}
          <style>{`
      form label {
        display: block;
        margin-bottom: 0.4rem;
        font-weight: 500;
        color: #495057;
        font-size: 0.9rem;
      }
      form input,
      form select {
        width: 100%;
        padding: 0.8rem;
        border-radius: 6px;
        border: 1px solid #ced4da;
        font-size: 1rem;
        box-sizing: border-box; /* Garante que padding não afete a largura total */
      }
      form input:focus,
      form select:focus {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
      }
    `}</style>
        </div>
      )}
    </div>
  );
}
