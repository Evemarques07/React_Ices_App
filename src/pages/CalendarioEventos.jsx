import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt-br";
import { eventosAPI, escalasAPI } from "../services/api";
import "../css/CalendarioEventos.css"; // Importar o arquivo CSS

export default function CalendarioEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalEvento, setModalEvento] = useState(null);

  async function fetchEventosEscalas() {
    setLoading(true);
    try {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      const token = user?.access_token;
      const membroId = user?.membro_id;

      // Eventos
      const resEventos = await eventosAPI.listarEventosAtivos(token);
      const listaEventos = resEventos.items || resEventos;
      const eventosFormatados = listaEventos.map((ev) => ({
        id: "evento-" + ev.id,
        title: ev.titulo,
        start: ev.data_inicio,
        end: ev.data_final,
        classNames: ["evento-geral"], // Classe para eventos gerais
        extendedProps: {
          descricao: ev.descricao,
          ativo: ev.ativo,
          tipo: "evento",
        },
      }));

      // Escalas agrupadas por data
      const resEscalas = await escalasAPI.listarEscalas(token);
      const listaEscalas = Array.isArray(resEscalas) ? resEscalas : [];
      // Agrupar por data (YYYY-MM-DD)
      const grupos = {};
      listaEscalas.forEach((esc) => {
        const data = esc.data_escala.slice(0, 10); // Pega só a data
        if (!grupos[data]) grupos[data] = [];
        grupos[data].push(esc);
      });

      const escalasAgrupadas = Object.entries(grupos).map(([data, escalas]) => {
        // Se o usuário tem escala nesse dia, destaca
        const usuarioTemEscala = escalas.some(
          (esc) => esc.membro_id === membroId
        );
        return {
          id: `escalas-dia-${data}`,
          title:
            `Escalas do dia (${escalas.length})` +
            (usuarioTemEscala ? " - Você está escalado" : ""),
          start: data,
          end: data,
          classNames: [
            "escala",
            usuarioTemEscala ? "escala-usuario" : "escala-outros",
          ],
          extendedProps: {
            tipo: "escalas-dia",
            escalas,
            usuarioTemEscala,
          },
        };
      });

      setEventos([...eventosFormatados, ...escalasAgrupadas]);
    } catch (err) {
      console.error("Erro ao buscar eventos/escalas:", err);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEventosEscalas();
  }, []);

  const formatarData = (data) => {
    if (!data) return "-";
    const d = new Date(data);
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <div className="calendario-container">
      <h2 className="calendario-titulo">Calendário de Eventos e Escalas</h2>

      {loading && <p className="loading-message">Carregando eventos...</p>}

      <div className="fullcalendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptLocale}
          events={eventos}
          height="auto" // Ajusta a altura automaticamente
          // Opções para responsividade
          // aspectRatio={1.8}
          // handleWindowResize={true}
          // windowResizeDelay={100}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
          eventClick={(info) => {
            const { title, extendedProps, start, end } = info.event;
            if (extendedProps.tipo === "escalas-dia") {
              setModalEvento({
                title,
                escalas: extendedProps.escalas,
                usuarioTemEscala: extendedProps.usuarioTemEscala,
                start,
                end,
                tipo: "escalas-dia",
              });
            } else if (extendedProps.tipo === "escala") {
              setModalEvento({
                title,
                descricao: `Escala de ${extendedProps.escala_tipo}`,
                nome_membro: extendedProps.nome_membro,
                ativo: extendedProps.ativo,
                start,
                end,
                tipo: "escala",
              });
            } else {
              setModalEvento({
                title,
                descricao: extendedProps.descricao,
                ativo: extendedProps.ativo,
                start,
                end,
                tipo: "evento",
              });
            }
          }}
          // dateClick={(info) => {
          //   alert(`Você clicou na data: ${formatarData(info.date)}`);
          // }}
        />
      </div>

      {modalEvento && (
        <div className="modal-backdrop" onClick={() => setModalEvento(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-button"
              onClick={() => setModalEvento(null)}
            >
              &times;
            </button>
            <h3
              className={`modal-title ${
                modalEvento.tipo === "escalas-dia"
                  ? "modal-title-escala"
                  : modalEvento.tipo === "escala"
                  ? "modal-title-escala"
                  : "modal-title-evento"
              }`}
            >
              {modalEvento.title}
            </h3>
            {modalEvento.tipo === "escalas-dia" ? (
              <div className="modal-item">
                <b>Escalas do dia:</b>
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18 }}>
                  {modalEvento.escalas.map((esc) => (
                    <li
                      key={esc.id}
                      style={{
                        fontWeight:
                          esc.membro_id ===
                          JSON.parse(localStorage.getItem("user") || "{}")
                            .membro_id
                            ? "bold"
                            : "normal",
                        color:
                          esc.membro_id ===
                          JSON.parse(localStorage.getItem("user") || "{}")
                            .membro_id
                            ? "#1976d2"
                            : "#333",
                        marginBottom: 4,
                      }}
                    >
                      {esc.tipo} - {esc.nome_membro}
                      {esc.membro_id ===
                      JSON.parse(localStorage.getItem("user") || "{}").membro_id
                        ? " (Você)"
                        : ""}
                      <span style={{ marginLeft: 8, fontSize: "0.95em" }}>
                        {esc.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <div className="modal-item">
                  <b>Descrição:</b>{" "}
                  {modalEvento.descricao || "Nenhuma descrição."}
                </div>
                {modalEvento.tipo === "escala" && (
                  <div className="modal-item">
                    <b>Membro:</b> {modalEvento.nome_membro}
                  </div>
                )}
                <div className="modal-item">
                  <b>Início:</b> {formatarData(modalEvento.start)}
                </div>
                {modalEvento.tipo !== "escala" && (
                  <div className="modal-item">
                    <b>Fim:</b> {formatarData(modalEvento.end)}
                  </div>
                )}
                <div className="modal-item">
                  <b>Status:</b>{" "}
                  <span
                    className={`status-badge ${
                      modalEvento.ativo ? "status-ativo" : "status-inativo"
                    }`}
                  >
                    {modalEvento.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
