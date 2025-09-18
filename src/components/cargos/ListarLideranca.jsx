import React, { useEffect, useState } from "react";
import { cargosAPI } from "../../services/api";
import { maskCPF } from "../../utils/format";

const cargoMap = {
  Diacono: "Diácono",
  Diretor_Patrimonio: "Diretor de Patrimônio",
  Pastor: "Pastor",
  Presbitero: "Presbítero",
  primeiro_usuario: "Primeiro Usuário",
  Secretario: "Secretário",
  Segundo_Secretario: "Segundo Secretário",
  Segundo_Tesoureiro: "Segundo Tesoureiro",
  Tesoureiro: "Tesoureiro",
};
const ListarLideranca = ({ token }) => {
  const [lideranca, setLideranca] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [desvinculando, setDesvinculando] = useState(null);

  useEffect(() => {
    async function fetchLideranca() {
      setLoading(true);
      try {
        const tokenLocal = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).access_token
          : token;
        const lista = await cargosAPI.listarMembrosComCargos(tokenLocal);
        setLideranca(lista);
      } catch (err) {
        setMensagem("Erro ao listar liderança");
      } finally {
        setLoading(false);
      }
    }
    fetchLideranca();
  }, [token]);

  const handleDesvincular = async (membro_id, cargo_id) => {
    setDesvinculando(`${membro_id}_${cargo_id}`);
    setMensagem("");
    try {
      const tokenLocal = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : token;
      await cargosAPI.desvincularMembroCargo(membro_id, cargo_id, tokenLocal);
      setMensagem("Desvinculado com sucesso!");
      setLideranca((prev) =>
        prev.filter(
          (item) =>
            !(item.membro.id === membro_id && item.cargo.id === cargo_id)
        )
      );
    } catch (err) {
      setMensagem("Erro ao desvincular membro do cargo");
    } finally {
      setDesvinculando(null);
    }
  };

  return (
    <div>
      <h2>Liderança ({lideranca.length})</h2>
      {loading && <p>Carregando...</p>}
      {mensagem && (
        <p style={{ color: mensagem.includes("sucesso") ? "green" : "red" }}>
          {mensagem}
        </p>
      )}
      <div>
        <style>{`
          @media (max-width: 200px) {
            .lideranca-lista {
              display: block !important;
              max-width: 100vw !important;
              margin: 0 !important;
              padding: 0 0 0 0 !important;
            }
            .lideranca-card {
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
          className="lideranca-lista"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "center",
            margin: "24px auto",
            maxWidth: "1200px",
          }}
        >
          {lideranca.map((item, idx) => (
            <div
              key={item.membro.id + "_" + item.cargo.id + "_" + idx}
              className="lideranca-card"
              style={{
                flex: "1 1 220px",
                minWidth: "220px",
                maxWidth: "320px",
                background: "#fafafa",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                border: "1px solid #e0e0e0",
                color: "#333",
                fontWeight: "500",
                fontSize: "1.08rem",
                letterSpacing: "0.5px",
                marginBottom: "0",
                padding: "28px 20px 20px 20px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  marginBottom: 6,
                }}
              >
                {item.membro.nome}
              </span>
              <span
                style={{ color: "#1976d2", fontWeight: "500", marginBottom: 8 }}
              >
                {cargoMap[item.cargo.nome] ||
                  item.cargo.nome.replace(/_/g, " ")}
              </span>
              <span
                style={{ fontSize: "0.7rem", color: "#666", marginBottom: 8 }}
              >
                {item.membro.email || "Sem e-mail"}
              </span>
              <span
                style={{ fontSize: "0.95rem", color: "#666", marginBottom: 8 }}
              >
                {item.membro.cpf ? `CPF: ${maskCPF(item.membro.cpf)}` : ""}
              </span>
              <button
                onClick={() => handleDesvincular(item.membro.id, item.cargo.id)}
                disabled={
                  desvinculando === `${item.membro.id}_${item.cargo.id}`
                }
                style={{
                  marginTop: 10,
                  padding: "8px 16px",
                  background: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(211,47,47,0.08)",
                  transition: "background 0.2s",
                }}
              >
                {desvinculando === `${item.membro.id}_${item.cargo.id}`
                  ? "Removendo..."
                  : "Desvincular"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListarLideranca;
