import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt-br";
import { eventosAPI, escalasAPI } from "../services/api";
import "../css/CalendarioEventos.css"; 

import { useRef } from "react";

export default function CalendarioEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalEvento, setModalEvento] = useState(null);

  const [busca, setBusca] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const calendarRef = useRef();

  async function fetchEventosEscalas() {
    setLoading(true);
    try {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      const token = user?.access_token;
      const membroId = user?.membro_id;

      const resEventos = await eventosAPI.listarEventosAtivos(token);
      const listaEventos = resEventos.items || resEventos;
      const eventosFormatados = listaEventos.map((ev) => ({
        id: "evento-" + ev.id,
        title: ev.titulo,
        start: ev.data_inicio,
        end: ev.data_final,
        classNames: ["evento-geral"],
        extendedProps: {
          descricao: ev.descricao,
          ativo: ev.ativo,
          tipo: "evento",
        },
      }));

      const resEscalas = await escalasAPI.listarEscalas(token);
      const listaEscalas = Array.isArray(resEscalas) ? resEscalas : [];
      const grupos = {};
      listaEscalas.forEach((esc) => {
        const data = esc.data_escala.slice(0, 10); 
        if (!grupos[data]) grupos[data] = [];
        grupos[data].push(esc);
      });

      const escalasAgrupadas = Object.entries(grupos).map(([data, escalas]) => {
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

  async function buscarEventosPorTitulo(titulo) {
    if (!titulo || titulo.trim().length < 3) {
      setSugestoes([]);
      setBuscando(false);
      return;
    }
    setBuscando(true);
    try {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      const token = user?.access_token;
      const res = await eventosAPI.buscarEventosPeloTitulo(titulo, token);
      setSugestoes(Array.isArray(res) ? res : []);
    } catch (err) {
      setSugestoes([]);
    } finally {
      setBuscando(false);
    }
  }

  async function selecionarEventoBusca(eventoId) {
    try {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      const token = user?.access_token;
      const evento = await eventosAPI.getEventoById(eventoId, token);
      const eventoCalendario = eventos.find((ev) => {
        return ev.id === "evento-" + evento.id;
      });
      if (eventoCalendario && calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(eventoCalendario.start);
        setModalEvento({
          title: eventoCalendario.title,
          descricao: eventoCalendario.extendedProps.descricao,
          ativo: eventoCalendario.extendedProps.ativo,
          start: eventoCalendario.start,
          end: eventoCalendario.end,
          tipo: "evento",
        });
      }
      setBusca("");
      setSugestoes([]);
    } catch (err) {
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

  const [intervaloMes, setIntervaloMes] = useState({ start: null, end: null });
  const eventosDoMes = eventos.filter((ev) => {
    const inicio = new Date(ev.start);
    if (!intervaloMes.start || !intervaloMes.end) return false;
    return inicio >= intervaloMes.start && inicio < intervaloMes.end;
  });


  function capitalizarMesTitulo(titulo) {
    if (!titulo) return "";
    return titulo.replace(/^(\w)/, (l) => l.toUpperCase());
  }

  const [tituloCalendario, setTituloCalendario] = useState("");

  const handleDatesSet = (info) => {
    if (info.view && info.view.title) {
      setTituloCalendario(capitalizarMesTitulo(info.view.title));
    }
    const dataCentral = info.start;
    const ano = dataCentral.getFullYear();
    const mes = dataCentral.getMonth() + 1;
    let inicioMes, fimMes;
    if (info.view && info.view.currentStart && info.view.currentEnd) {
      inicioMes = new Date(info.view.currentStart);
      fimMes = new Date(info.view.currentEnd);
    } else {
      inicioMes = new Date(ano, mes - 1, 1, 0, 0, 0);
      fimMes = new Date(ano, mes, 1, 0, 0, 0);
    }
    setIntervaloMes({ start: inicioMes, end: fimMes });
  };

  return (
    <div className="calendario-container">
      <h2 className="calendario-titulo">
        {tituloCalendario || "Calendário de Eventos e Escalas"}
      </h2>

      <div style={{ marginBottom: 16, maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Buscar evento pelo título..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            buscarEventosPorTitulo(e.target.value);
          }}
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #1976d2",
          }}
        />
        {buscando && (
          <div style={{ fontSize: 13, color: "#1976d2" }}>Buscando...</div>
        )}
        {sugestoes.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              background: "#fff",
              border: "1px solid #1976d2",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              position: "absolute",
              zIndex: 10,
              width: "100%",
            }}
          >
            {sugestoes.map((ev) => (
              <li
                key={ev.id}
                style={{ padding: "8px 12px", cursor: "pointer" }}
                onClick={() => selecionarEventoBusca(ev.id)}
              >
                <b>{ev.titulo}</b>
                <div style={{ fontSize: 13, color: "#555" }}>
                  {ev.descricao}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {formatarData(ev.data_inicio)} - {formatarData(ev.data_final)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="loading-message">Carregando eventos...</p>}

      <div className="fullcalendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptLocale}
          events={eventos}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "",
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
          datesSet={handleDatesSet}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: "#1976d2", fontSize: "1.3rem", marginBottom: 12 }}>
          Eventos e Escalas do Mês
        </h3>
        {eventosDoMes.length === 0 ? (
          <div style={{ color: "#888", fontSize: 15 }}>Nenhum evento ou escala neste mês.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {eventosDoMes.map((ev) => (
              <li
                key={ev.id}
                style={{
                  background: "#f3f4f6",
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: "10px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span style={{ fontWeight: 600, color: "#1976d2" }}>{ev.title}</span>
                <span style={{ fontSize: 14, color: "#555" }}>
                  Início: {formatarData(ev.start)}
                  {ev.end && (
                    <>
                      {" | "}Fim: {formatarData(ev.end)}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
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
