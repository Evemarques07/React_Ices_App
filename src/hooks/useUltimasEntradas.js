import { useState, useEffect } from "react";
import { entradasAPI } from "../services/api";

export default function useUltimasEntradas(token) {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let tokenSalvo = token;
  if (!tokenSalvo) {
    try {
      tokenSalvo = JSON.parse(localStorage.getItem("user"))?.access_token ?? null;
    } catch {
      console.error("Falha ao parsear 'user' do localStorage.");
      tokenSalvo = null;
    }
  }

  useEffect(() => {
    (async () => {
      if (!tokenSalvo) {
        console.warn("Token não informado para UltimasEntradas, busca não realizada.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError("");
      try {
        const lista = await entradasAPI.getUltimasEntradas(tokenSalvo);
        setEntradas(lista);
      } catch (err) {
        console.error("Erro ao buscar últimas entradas:", err);
        setError("Não foi possível carregar as últimas entradas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    })();
  }, [tokenSalvo]);

  return { entradas, loading, error };
}