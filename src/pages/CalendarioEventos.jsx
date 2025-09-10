import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { eventosAPI } from "../services/api";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function CalendarioEventos() {
  const [eventos, setEventos] = useState([]);
  const [modal, setModal] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    ativo: true,
  });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calPage, setCalPage] = useState({ date: new Date(), view: "month" });

  // Buscar eventos do backend ao carregar ou ao navegar
  async function fetchEventos(date = new Date(), view = "month") {
    setLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      // Pode usar skip/limit se quiser paginação, aqui busca todos
      const res = await eventosAPI.listarEventos(token, 0, 100);
      // Adapta para o formato do calendário
      const eventosFormatados = (res.items || res).map((ev) => ({
        title: ev.titulo,
        start: new Date(ev.data_inicio),
        end: new Date(ev.data_fim),
        descricao: ev.descricao,
      }));
      setEventos(eventosFormatados);
    } catch (err) {
      // Se der erro, mantém eventos vazios
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }

  // Carrega eventos ao montar e ao mudar página do calendário
  useEffect(() => {
    fetchEventos(calPage.date, calPage.view);
  }, [calPage]);

  function handleSelectSlot(slotInfo) {
    setSelectedSlot(slotInfo);
    setNovoEvento({
      ...novoEvento,
      data_inicio: slotInfo.start.toISOString().slice(0, 16),
      data_fim: slotInfo.end.toISOString().slice(0, 16),
    });
    setModal(true);
  }

  // Atualiza página do calendário ao navegar
  function handleNavigate(date) {
    setCalPage((p) => ({ ...p, date }));
  }
  function handleView(view) {
    setCalPage((p) => ({ ...p, view }));
  }

  async function handleCriarEvento(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).access_token
        : null;
      const eventoCriado = await eventosAPI.criarEvento(novoEvento, token);
      // Atualiza eventos do backend após criar
      fetchEventos(calPage.date, calPage.view);
      setModal(false);
      setNovoEvento({
        titulo: "",
        descricao: "",
        data_inicio: "",
        data_fim: "",
        ativo: true,
      });
    } catch (err) {
      alert("Erro ao criar evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Calendário de Eventos</h2>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onNavigate={handleNavigate}
        onView={handleView}
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
        }}
      />
      {loading && (
        <div style={{ marginTop: 16, color: "#007bff" }}>
          Carregando eventos...
        </div>
      )}
      {modal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCriarEvento}
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 12,
              minWidth: 320,
              maxWidth: 400,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h3 style={{ marginBottom: 8 }}>Novo Evento</h3>
            <label>Título*</label>
            <input
              type="text"
              required
              value={novoEvento.titulo}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, titulo: e.target.value })
              }
              style={{
                padding: "0.7rem",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <label>Descrição</label>
            <textarea
              value={novoEvento.descricao}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, descricao: e.target.value })
              }
              style={{
                padding: "0.7rem",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <label>Início*</label>
            <input
              type="datetime-local"
              required
              value={novoEvento.data_inicio}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, data_inicio: e.target.value })
              }
              style={{
                padding: "0.7rem",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <label>Fim*</label>
            <input
              type="datetime-local"
              required
              value={novoEvento.data_fim}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, data_fim: e.target.value })
              }
              style={{
                padding: "0.7rem",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#0077b6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.8rem 1.2rem",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "1rem",
              }}
            >
              {loading ? "Salvando..." : "Criar Evento"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
