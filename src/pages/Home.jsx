export default function Home({ user }) {
  // Pega o primeiro nome
  const primeiroNome = user?.nome_membro?.split(" ")[0] || "";
  // Pega o cargo (se houver)
  const cargo = user?.cargos && user.cargos.length > 0 ? user.cargos[0] : "";

  return (
    <div className="container-principal">
      <h2>Bem-vindo, {primeiroNome || "usuário"}!</h2>
      {cargo && (
        <div
          style={{ fontSize: "small", color: "#666", marginBottom: "0.5rem" }}
        >
          {cargo}
        </div>
      )}
      <p>Seu CPF: {user?.sub}</p>
      <p>
        Token válido até:{" "}
        {user?.exp ? new Date(user.exp * 1000).toLocaleString() : "-"}
      </p>
    </div>
  );
}
