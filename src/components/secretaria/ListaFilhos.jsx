import React, { useEffect, useState } from "react";
import { membrosAPI } from "../../services/api";
import { formatDate } from "../../utils/format";

const ListaFilhos = ({ token }) => {
  const [filhos, setFilhos] = useState([]);
  const [pais, setPais] = useState([]);
  const [maes, setMaes] = useState([]);
  const [showFilhos, setShowFilhos] = useState(false);
  const [showMaes, setShowMaes] = useState(false);
  const [showPais, setShowPais] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [novoFilho, setNovoFilho] = useState({
    nome: "",
    data_nascimento: "",
    batizado: false,
    membro_id: "",
    mae: "",
    pai: "",
  });
  const [buscaMembro, setBuscaMembro] = useState("");
  const [buscaMae, setBuscaMae] = useState("");
  const [buscaPai, setBuscaPai] = useState("");
  const [membros, setMembros] = useState([]);
  const [maesBusca, setMaesBusca] = useState([]);
  const [paisBusca, setPaisBusca] = useState([]);
  const [cadastrando, setCadastrando] = useState(false);

  useEffect(() => {
    async function fetchFilhos() {
      setLoading(true);
      try {
        const tokenLocal = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).access_token
          : token;
        const lista = await membrosAPI.listarNomesFilhos(tokenLocal);
        setFilhos(lista);
        const maesList = await membrosAPI.listarPaisOuMaes("F", tokenLocal);
        setMaes(maesList);
        const paisList = await membrosAPI.listarPaisOuMaes("M", tokenLocal);
        setPais(paisList);
      } catch (err) {
        setMensagem("Erro ao buscar filhos/pais/maes");
      } finally {
        setLoading(false);
      }
    }
    fetchFilhos();
  }, [token]);

  const abrirModal = () => {
    setModalOpen(true);
    setNovoFilho({
      nome: "",
      data_nascimento: "",
      batizado: false,
      membro_id: "",
      mae: "",
      pai: "",
    });
    setBuscaMembro("");
    setBuscaMae("");
    setBuscaPai("");
    setMembros([]);
    setMaesBusca([]);
    setPaisBusca([]);
    setMensagem("");
  };

  const fecharModal = () => {
    setModalOpen(false);
    setMensagem("");
  };

  const buscarMembro = async () => {
    if (!buscaMembro.trim()) return;
    setLoading(true);
    try {
      const tokenLocal = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : token;
      const lista = await membrosAPI.filtrarApenasMembros(
        buscaMembro,
        tokenLocal
      );
      setMembros(Array.isArray(lista) ? lista : [lista]);
    } catch (err) {
      setMensagem("Erro ao buscar membro");
    } finally {
      setLoading(false);
    }
  };

  const buscarMae = async () => {
    if (!buscaMae.trim()) return;
    setLoading(true);
    try {
      const tokenLocal = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : token;
      const lista = await membrosAPI.filtrarApenasMembros(buscaMae, tokenLocal);
      setMaesBusca(Array.isArray(lista) ? lista : [lista]);
    } catch (err) {
      setMensagem("Erro ao buscar mãe");
    } finally {
      setLoading(false);
    }
  };

  const buscarPai = async () => {
    if (!buscaPai.trim()) return;
    setLoading(true);
    try {
      const tokenLocal = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : token;
      const lista = await membrosAPI.filtrarApenasMembros(buscaPai, tokenLocal);
      setPaisBusca(Array.isArray(lista) ? lista : [lista]);
    } catch (err) {
      setMensagem("Erro ao buscar pai");
    } finally {
      setLoading(false);
    }
  };

  const cadastrarFilho = async () => {
    setCadastrando(true);
    setMensagem("");
    try {
      const tokenLocal = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : token;
      const body = {
        nome: novoFilho.nome,
        data_nascimento: novoFilho.data_nascimento,
        batizado: novoFilho.batizado,
        membro_id: novoFilho.membro_id || null,
        mae: novoFilho.mae || null,
        pai: novoFilho.pai || null,
      };
      await membrosAPI.criarFilho(body, tokenLocal);
      setMensagem("Filho cadastrado com sucesso!");
      setTimeout(() => fecharModal(), 1200);
    } catch (err) {
      setMensagem("Erro ao cadastrar filho");
    } finally {
      setCadastrando(false);
    }
  };

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {mensagem && (
        <p style={{ color: mensagem.includes("sucesso") ? "green" : "red" }}>
          {mensagem}
        </p>
      )}
      <button
        onClick={abrirModal}
        style={{
          marginBottom: 16,
          padding: "8px 16px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Cadastrar Filho
      </button>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setShowFilhos((v) => !v)}
          style={{
            background: showFilhos ? "#1976d2" : "#eee",
            color: showFilhos ? "#fff" : "#333",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
            padding: "8px 16px",
            marginBottom: 8,
          }}
        >
          {showFilhos ? "Ocultar" : "Mostrar"} Lista de Filhos ({filhos.length})
        </button>
        {showFilhos && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filhos.map((filho) => (
              <li
                key={filho.id}
                style={{
                  marginBottom: 16,
                  background: "#fafafa",
                  borderRadius: 8,
                  boxShadow: "0 1px 4px rgba(33,150,243,0.08)",
                  padding: 16,
                }}
              >
                <strong>{filho.nome}</strong>{" "}
                <span style={{ color: "#1976d2" }}>
                  {filho.batizado ? "(Batizado)" : ""}
                </span>
                <br />
                <span>
                  Data de nascimento: {formatDate(filho.data_nascimento)}
                </span>
                <br />
                <span>Mãe: {filho.mae}</span>
                <br />
                <span>Pai: {filho.pai}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setShowMaes((v) => !v)}
          style={{
            background: showMaes ? "#1976d2" : "#eee",
            color: showMaes ? "#fff" : "#333",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
            padding: "8px 16px",
            marginBottom: 8,
          }}
        >
          {showMaes ? "Ocultar" : "Mostrar"} Lista de Mães ({maes.length})
        </button>
        {showMaes && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {maes.map((mae) => (
              <li
                key={mae.membro_id}
                style={{
                  marginBottom: 12,
                  background: "#f5f5f5",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <strong>{mae.nome_membro}</strong>
                <br />
                <span>Filhos: {mae.filhos.map((f) => f.nome).join(", ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setShowPais((v) => !v)}
          style={{
            background: showPais ? "#1976d2" : "#eee",
            color: showPais ? "#fff" : "#333",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
            padding: "8px 16px",
            marginBottom: 8,
          }}
        >
          {showPais ? "Ocultar" : "Mostrar"} Lista de Pais ({pais.length})
        </button>
        {showPais && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pais.map((pai) => (
              <li
                key={pai.membro_id}
                style={{
                  marginBottom: 12,
                  background: "#f5f5f5",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <strong>{pai.nome_membro}</strong>
                <br />
                <span>Filhos: {pai.filhos.map((f) => f.nome).join(", ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 320,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Cadastrar Filho</h3>
            <input
              type="text"
              placeholder="Nome do filho"
              value={novoFilho.nome}
              onChange={(e) =>
                setNovoFilho({ ...novoFilho, nome: e.target.value })
              }
              style={{ width: "100%", marginBottom: 8, padding: 6 }}
            />
            <input
              type="date"
              placeholder="Data de nascimento"
              value={novoFilho.data_nascimento}
              onChange={(e) =>
                setNovoFilho({ ...novoFilho, data_nascimento: e.target.value })
              }
              style={{ width: "100%", marginBottom: 8, padding: 6 }}
            />
            <label style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={novoFilho.batizado}
                onChange={(e) =>
                  setNovoFilho({ ...novoFilho, batizado: e.target.checked })
                }
              />{" "}
              Batizado
            </label>
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Buscar membro"
                value={buscaMembro}
                onChange={(e) => setBuscaMembro(e.target.value)}
                style={{ width: "70%", marginRight: 8, padding: 6 }}
              />
              <button
                onClick={buscarMembro}
                disabled={loading || !buscaMembro.trim()}
              >
                Buscar
              </button>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  maxHeight: 100,
                  overflowY: "auto",
                }}
              >
                {membros.map((m) => (
                  <li
                    key={m.id}
                    style={{
                      padding: "4px 0",
                      cursor: "pointer",
                      background:
                        novoFilho.membro_id === m.id ? "#e0f7fa" : "#fff",
                    }}
                    onClick={() =>
                      setNovoFilho({ ...novoFilho, membro_id: m.id })
                    }
                  >
                    {m.nome}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Buscar mãe"
                value={buscaMae}
                onChange={(e) => setBuscaMae(e.target.value)}
                style={{ width: "70%", marginRight: 8, padding: 6 }}
              />
              <button
                onClick={buscarMae}
                disabled={loading || !buscaMae.trim()}
              >
                Buscar
              </button>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  maxHeight: 100,
                  overflowY: "auto",
                }}
              >
                {maesBusca.map((m) => (
                  <li
                    key={m.id}
                    style={{
                      padding: "4px 0",
                      cursor: "pointer",
                      background: novoFilho.mae === m.id ? "#e0f7fa" : "#fff",
                    }}
                    onClick={() => setNovoFilho({ ...novoFilho, mae: m.id })}
                  >
                    {m.nome}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Buscar pai"
                value={buscaPai}
                onChange={(e) => setBuscaPai(e.target.value)}
                style={{ width: "70%", marginRight: 8, padding: 6 }}
              />
              <button
                onClick={buscarPai}
                disabled={loading || !buscaPai.trim()}
              >
                Buscar
              </button>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  maxHeight: 100,
                  overflowY: "auto",
                }}
              >
                {paisBusca.map((m) => (
                  <li
                    key={m.id}
                    style={{
                      padding: "4px 0",
                      cursor: "pointer",
                      background: novoFilho.pai === m.id ? "#e0f7fa" : "#fff",
                    }}
                    onClick={() => setNovoFilho({ ...novoFilho, pai: m.id })}
                  >
                    {m.nome}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={cadastrarFilho}
              disabled={cadastrando}
              style={{
                marginTop: 12,
                padding: "8px 16px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cadastrar
            </button>
            <button onClick={fecharModal} style={{ marginLeft: 8 }}>
              Cancelar
            </button>
            {mensagem && (
              <p
                style={{
                  color: mensagem.includes("sucesso") ? "green" : "red",
                }}
              >
                {mensagem}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaFilhos;
