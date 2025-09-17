import React, { useEffect, useState } from "react";
import { cargosAPI, membrosAPI } from "../../services/api";

const ListarCargos = ({ token }) => {
  const [cargos, setCargos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cargoSelecionado, setCargoSelecionado] = useState(null);
  const [buscaMembro, setBuscaMembro] = useState("");
  const [membros, setMembros] = useState([]);
  const [membroSelecionado, setMembroSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vinculando, setVinculando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function fetchCargos() {
      setLoading(true);
      try {
        const token = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).access_token
          : null;
        const lista = await cargosAPI.listarCargos(token);
        setCargos(lista);
      } catch (err) {
        setMensagem("Erro ao listar cargos");
      } finally {
        setLoading(false);
      }
    }
    fetchCargos();
  }, [token]);

  const abrirModal = (cargo) => {
    setCargoSelecionado(cargo);
    setModalOpen(true);
    setBuscaMembro("");
    setMembros([]);
    setMembroSelecionado(null);
    setMensagem("");
  };

  const fecharModal = () => {
    setModalOpen(false);
    setCargoSelecionado(null);
    setBuscaMembro("");
    setMembros([]);
    setMembroSelecionado(null);
    setMensagem("");
  };

  const buscarMembros = async () => {
    if (!buscaMembro.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      const lista = await membrosAPI.filtrarApenasMembros(buscaMembro, token);
      setMembros(Array.isArray(lista) ? lista : [lista]);
    } catch (err) {
      setMensagem("Erro ao buscar membros");
    } finally {
      setLoading(false);
    }
  };

  const vincularCargo = async () => {
    if (!membroSelecionado || !cargoSelecionado) return;
    setVinculando(true);
    setMensagem("");
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      await cargosAPI.vincularMembroCargo(
        membroSelecionado.id,
        cargoSelecionado.id,
        token
      );
      setMensagem("Cargo vinculado com sucesso!");
      setTimeout(() => fecharModal(), 1200);
    } catch (err) {
      setMensagem("Erro ao vincular cargo");
    } finally {
      setVinculando(false);
    }
  };

  return (
    <div>
        {/* mostrar a quantidade de cargos */}
      <h2>Lista de Cargos ({cargos.length})</h2>
      {loading && <p>Carregando...</p>}
      {mensagem && <p style={{ color: "red" }}>{mensagem}</p>}
      <div>
        <style>{`
          @media (max-width: 468px) {
            .cargos-lista {
              display: block !important;
              max-width: 100vw !important;
              margin: 0 !important;
              padding: 0 0 0 0 !important;
            }
            .cargo-card {
              display: block !important;
              min-width: 0 !important;
              max-width: 100vw !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              border: none !important;
              background: #fff !important;
              color: #333 !important;
              font-size: 1rem !important;
              padding: 14px 12px !important;
              margin: 0 !important;
              align-items: flex-start !important;
            }
            .cargo-inicial {
              display: none !important;
            }
          }
        `}</style>
        <div
          className="cargos-lista"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "center",
            margin: "24px auto",
            maxWidth: "1200px",
          }}
        >
          {cargos.map((cargo) => (
            <div
              key={cargo.id}
              className="cargo-card"
              style={{
                flex: "1 1 220px",
                minWidth: "220px",
                maxWidth: "320px",
                background:
                  cargoSelecionado?.id === cargo.id ? "#e3f2fd" : "#fafafa",
                borderRadius: "16px",
                boxShadow:
                  cargoSelecionado?.id === cargo.id
                    ? "0 4px 16px rgba(33,150,243,0.13)"
                    : "0 2px 8px rgba(0,0,0,0.07)",
                border:
                  cargoSelecionado?.id === cargo.id
                    ? "2px solid #1976d2"
                    : "1px solid #e0e0e0",
                color: cargoSelecionado?.id === cargo.id ? "#1976d2" : "#333",
                fontWeight: "500",
                fontSize: "1.12rem",
                letterSpacing: "0.5px",
                marginBottom: "0",
                padding: "28px 20px 20px 20px",
                cursor: "pointer",
                transition: "background 0.2s, box-shadow 0.2s, border 0.2s",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
              onClick={() => abrirModal(cargo)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5faff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  cargoSelecionado?.id === cargo.id ? "#e3f2fd" : "#fafafa")
              }
            >
              <span
                className="cargo-inicial"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#e3f2fd",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 18,
                  fontWeight: "bold",
                  color: "#1976d2",
                  fontSize: "1.3rem",
                  boxShadow: "0 1px 4px rgba(33,150,243,0.08)",
                  border: "2px solid #bbdefb",
                }}
              >
                {cargo.nome[0]}
              </span>
              <span>{cargo.nome}</span>
            </div>
          ))}
        </div>
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
            <h3>Vincular membro ao cargo: {cargoSelecionado?.nome}</h3>
            <input
              type="text"
              placeholder="Buscar membro pelo nome"
              value={buscaMembro}
              onChange={(e) => setBuscaMembro(e.target.value)}
              style={{ width: "100%", marginBottom: 8, padding: 6 }}
            />
            <button
              onClick={buscarMembros}
              disabled={loading || !buscaMembro.trim()}
            >
              Buscar
            </button>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginTop: 12,
                maxHeight: 200,
                overflowY: "auto",
                border: membros.length ? "1px solid #eee" : "none",
                borderRadius: 4,
              }}
            >
              {membros.map((membro) => (
                <li
                  key={membro.id}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    background:
                      membroSelecionado?.id === membro.id ? "#e0f7fa" : "#fff",
                  }}
                  onClick={() => setMembroSelecionado(membro)}
                >
                  {membro.nome}
                </li>
              ))}
            </ul>
            <button
              onClick={vincularCargo}
              disabled={!membroSelecionado || vinculando}
              style={{ marginTop: 16 }}
            >
              Vincular cargo ao membro
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

export default ListarCargos;
