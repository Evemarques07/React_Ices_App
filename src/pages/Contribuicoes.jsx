import { useEffect, useState } from "react";
import { Calendar, FileText } from "lucide-react";
import { entradasAPI } from "../services/api";
import "../css/Contribuicoes.css"; // Certifique-se de que este arquivo existe e está linkado
import { formatDate, formatCurrency } from "../utils/format";
import ScrollToTopButton from "../components/utils/ScrollToTopButton";

export default function Contribuicoes() {
  const [entradas, setEntradas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.membro_id || !user.access_token) {
      setError("Usuário não encontrado ou não autenticado.");
      setLoading(false);
      return;
    }

    entradasAPI
      .getEntradasPorMembro(user.membro_id, user.access_token)
      .then(setEntradas)
      .catch(() => setError("Erro ao buscar contribuições."))
      .finally(() => setLoading(false));
  }, []);

  // Função ATUALIZADA para gerar classes CSS
  const getCssClassFromType = (tipo) => {
    const tipoNormalizado = tipo.toUpperCase();
    if (tipoNormalizado === "DÍZIMO") return "dizimo";
    if (tipoNormalizado === "OFERTA COMUM") return "oferta-comum";
    if (tipoNormalizado === "COMPROMISSO DE FÉ") return "compromisso-fe";
    if (tipoNormalizado === "NOSSA CASA") return "nossa-casa";
    // Cor padrão para outros tipos
    return "oferta-especial";
  };

  return (
    <div className="contribuicoes-container">
      <h2 className="main-title">Minhas Contribuições</h2>

      {loading && <p className="loading-message">Carregando...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div>
          {Object.keys(entradas).length === 0 ? (
            <div className="no-data-message">
              Nenhuma contribuição encontrada.
            </div>
          ) : (
            <>
              {/* Filtros de tipo */}
              <div className="filter-buttons-container">
                {Object.entries(entradas).map(([key]) => {
                  const tipo = key.split("_").slice(1).join(" ");
                  return (
                    <button
                      key={tipo}
                      onClick={() =>
                        setTipoFiltro(tipoFiltro === tipo ? null : tipo)
                      }
                      className={`filter-button ${
                        tipoFiltro === tipo ? "active" : ""
                      }`}
                    >
                      {tipo}
                    </button>
                  );
                })}
                {tipoFiltro && (
                  <button
                    onClick={() => setTipoFiltro(null)}
                    className="clear-filter-button"
                  >
                    Mostrar todos
                  </button>
                )}
              </div>
              {/* Cards filtrados */}
              {Object.entries(entradas)
                .filter(([key]) => {
                  const tipo = key.split("_").slice(1).join(" ");
                  return !tipoFiltro || tipoFiltro === tipo;
                })
                .map(([key, lista]) => {
                  const tipo = key.split("_").slice(1).join(" ");
                  return (
                    <div key={key} className="contribution-category">
                      <h3
                        className={`category-title ${getCssClassFromType(
                          tipo
                        )}`}
                      >
                        {tipo}
                      </h3>
                      <div className="card-grid">
                        {lista.map((e) => (
                          <div
                            key={e.id}
                            className={`card ${getCssClassFromType(e.tipo)}`}
                          >
                            <div className="card-header">
                              <span className="card-value">
                                {formatCurrency(e.valor)}
                              </span>
                            </div>
                            <div className="card-body">
                              <div className="meta-item">
                                <Calendar size={14} className="meta-icon" />
                                <span>{formatDate(e.data)}</span>
                              </div>
                              <div className="meta-item">
                                <FileText size={14} className="meta-icon" />
                                <span>{e.descricao || "Sem descrição"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      )}
      <ScrollToTopButton size={60}/>
    </div>
    
  );
}
