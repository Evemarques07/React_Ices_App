import { useState } from "react";
import { login } from "../services/api";
import logo from "../assets/logo.png"; // Importe a logo
import { maskCPF } from "../utils/format";

export default function Login({ onLogin }) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Remove pontos e traços do CPF antes de enviar
      const cpfLimpo = cpf.replace(/\D/g, "");
      const data = await login({ username: cpfLimpo, password: senha });
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Estilos inline
  const styles = {
    root: {
      minWidth: "100vw",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f3f4f6",
      padding: "1rem",
    },
    card: {
      maxWidth: 400,
      width: "100%",
      background: "#fff",
      padding: "2rem",
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 151, 216, 0.15)",
    },
    logoBox: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1.5rem",
    },
    logo: {
      height: 96,
      objectFit: "contain",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: 800,
      textAlign: "center",
      color: "#222",
      marginBottom: "2rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
    },
    label: {
      display: "block",
      fontSize: "0.95rem",
      fontWeight: 600,
      color: "#4a5568",
      marginBottom: "0.3rem",
    },
    input: {
      width: "100%",
      padding: "0.8rem 1rem",
      border: "1px solid #cbd5e0",
      borderRadius: "8px",
      background: "#f8f9fa",
      fontSize: "1rem",
      color: "#2d3748",
      boxSizing: "border-box",
      transition: "border-color 0.3s",
    },
    button: {
      width: "100%",
      padding: "0.9rem 1.5rem",
      borderRadius: "8px",
      border: "none",
      fontWeight: "bold",
      fontSize: "1rem",
      color: "#fff",
      background: "linear-gradient(90deg, #0077b6, #0097d8)",
      boxShadow: "0 2px 8px #0097d822",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.6 : 1,
      marginTop: "0.5rem",
      transition: "opacity 0.3s",
    },
    error: {
      marginTop: "1rem",
      color: "#c53030",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "0.95rem",
    },
    forgot: {
      marginTop: "2rem",
      textAlign: "center",
    },
    forgotLink: {
      fontSize: "0.95rem",
      color: "#0097d8",
      textDecoration: "none",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h2 style={styles.title}>Acessar</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label htmlFor="cpf" style={styles.label}>
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              value={cpf.length > 3 ? maskCPF(cpf) : cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
              placeholder="Digite seu CPF (apenas números)"
              required
              minLength={11}
              style={styles.input}
            />
          </div>
          <div>
            <label htmlFor="senha" style={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {error && <div style={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
