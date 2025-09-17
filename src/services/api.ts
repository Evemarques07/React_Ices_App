// Serviço central de requisições à API
export const URL_BASE = "https://icesiqueira.com"; // Produção
// export const URL_BASE = "http://localhost:5000"; // Desenvolvimento

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const body = new URLSearchParams({
    username,
    password,
    grant_type: "password",
  });

  const response = await fetch(`${URL_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Usuário ou senha inválidos");
  }

  return response.json();
}

export const usuariosAPI = {
  async listarUsuarios(token: string) {
    const response = await fetch(`${URL_BASE}/usuarios/listar`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar usuários");
    }
    // console.log("Listar usuários response:", response);

    return response.json();
  },
  async criarUsuario(
    usuario: {
      membro_id: number;
    },
    token: string
  ) {
    // Envia membro_id como query string, sem body
    const url = new URL(`${URL_BASE}/usuarios/`);
    url.searchParams.append("membro_id", usuario.membro_id.toString());
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: null,
    });

    if (!response.ok) {
      // Tenta extrair mensagem detalhada do backend
      let msg = "Erro ao criar usuário";
      try {
        const err = await response.json();
        if (err.detail) msg = err.detail;
      } catch {}
      throw new Error(msg);
    }

    return response.json();
  },
  async alterarSenha(nova_senha: string, token: string) {
    const url = new URL(`${URL_BASE}/usuarios/senha`);
    url.searchParams.append("nova_senha", nova_senha);

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao alterar senha");
    }

    return response.json();
  },
  async deletarUsuario(usuario_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/usuarios/${usuario_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar usuário");
    }

    return response.json();
  },
};

export const membrosAPI = {
  async criarMembro(
    membro: {
      nome: string;
      data_nascimento: string;
      telefone: string;
      email: string;
      endereco: string;
      data_entrada: string;
      ativo: boolean;
      cpf: string;
      foto: string;
      tipo: string;
      sexo: string;
      nome_pai: string;
      nome_mae: string;
      estado_civil: string;
      data_casamento: string;
      nome_conjuge: string;
      data_nascimento_conjuge: string;
      data_batismo: string;
      senha: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/membros/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(membro),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar membro");
    }

    return response.json();
  },
  async getMembros(token: string, skip = 0, limit = 20) {
    const url = new URL(`${URL_BASE}/membros/`);
    url.searchParams.append("skip", skip.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar membros");
    }

    return response.json();
  },
  async listarTodosNomes(token: string, skip = 0, limit = 20) {
    const url = new URL(`${URL_BASE}/membros/todos/listar`);
    url.searchParams.append("skip", skip.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar todos os nomes");
    }

    return response.json();
  },
  async getMembroById(membro_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/membros/${membro_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar membro");
    }

    return response.json();
  },
  async filtrarMembros(termo: string, token: string) {
    const url = new URL(`${URL_BASE}/membros/filtrar`);
    url.searchParams.append("termo", termo);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao filtrar membros");
    }

    return response.json();
  },
  async filtrarApenasMembros(nome: string, token: string) {
    const url = new URL(`${URL_BASE}/membros/filtrar/nome`);
    url.searchParams.append("nome", nome);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao filtrar membros");
    }

    return response.json();
  },
  async editarMembro(
    membro_id: number,
    dadosAtualizados: {
      nome: string;
      data_nascimento: string;
      telefone: string;
      email: string;
      endereco: string;
      data_entrada: string;
      ativo: boolean;
      cpf: string;
      foto: string;
      tipo: string;
      sexo: string;
      nome_pai: string;
      nome_mae: string;
      estado_civil: string;
      data_casamento: string;
      nome_conjuge: string;
      data_nascimento_conjuge: string;
      data_batismo: string;
      senha: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/membros/${membro_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar membro");
    }

    return response.json();
  },
  async criarFilho(
    dados: {
      nome: string;
      data_nascimento: string;
      batizado: boolean;
      membro_id: number;
      mae: number;
      pai: number;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/filhos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar filho");
    }

    return response.json();
  },
  async listarNomesFilhos(token: string) {
    const response = await fetch(`${URL_BASE}/filhos/nomes`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar nomes dos filhos");
    }

    return response.json();
  },
  async listarPaisOuMaes(sexo: string, token: string) {
    const response = await fetch(`${URL_BASE}/filhos/pais?sexo=${sexo}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar pais ou mães");
    }

    return response.json();
  },
};

export const entradasAPI = {
  async getEntradasPorMembro(membro_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/entradas/membro/${membro_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar entradas do membro");
    }

    return response.json();
  },
  async criarEntrada(
    entrada: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
      membro_id: number;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/entradas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entrada),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar entrada");
    }

    return response.json();
  },
  async criarEntradaMissionaria(
    entrada: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
      membro_id: number;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/entradas/missoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entrada),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar entrada");
    }

    return response.json();
  },
  async criarEntradaProjetos(
    entrada: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
      membro_id: number;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/entradas/projetos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entrada),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar entrada");
    }

    return response.json();
  },
  async editarEntradaFinanceira(
    entrada_id: number,
    dadosAtualizados: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
      membro_id: number;
    },
    token: string
  ) {
    const response = await fetch(
      `${URL_BASE}/entradas/financeiro/${entrada_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAtualizados),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao editar entrada");
    }

    return response.json();
  },
  async editarEntradaMissionaria(
    entrada_id: number,
    dadosAtualizados: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
      membro_id: number;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/entradas/missoes/${entrada_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      throw new Error("Erro ao editar entrada");
    }

    return response.json();
  },
  async editarEntradaProjetos(
    entrada_id: number,
    dadosAtualizados: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
      membro_id: number;
    },
    token: string
  ) {
    const response = await fetch(
      `${URL_BASE}/entradas/projetos/${entrada_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAtualizados),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao editar entrada");
    }

    return response.json();
  },
  async deletarEntradaFinanceira(entrada_id: number, token: string) {
    const response = await fetch(
      `${URL_BASE}/entradas/financeiro/${entrada_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao deletar entrada");
    }

    return response.json();
  },
  async deletarEntradaMissionaria(entrada_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/entradas/missoes/${entrada_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  async deletarEntradaProjetos(entrada_id: number, token: string) {
    const response = await fetch(
      `${URL_BASE}/entradas/projetos/${entrada_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao deletar entrada");
    }

    return response.json();
  },
  async todasMovimentacoesFiltradas(
    filtro: {
      descricao?: string;
      membro_id?: number;
      data_inicio?: string;
      data_fim?: string;
      tipo_movimento?: string;
      tipo_caixa?: string;
    },
    token: string,
    skip = 0,
    limit = 20
  ) {
    const url = new URL(`${URL_BASE}/filtrar/geral`);
    if (filtro.descricao)
      url.searchParams.append("descricao", filtro.descricao);
    if (filtro.membro_id)
      url.searchParams.append("membro_id", filtro.membro_id.toString());
    if (filtro.data_inicio)
      url.searchParams.append("data_inicio", filtro.data_inicio);
    if (filtro.data_fim) url.searchParams.append("data_fim", filtro.data_fim);
    if (filtro.tipo_movimento)
      url.searchParams.append("tipo_movimento", filtro.tipo_movimento);
    if (filtro.tipo_caixa)
      url.searchParams.append("tipo_caixa", filtro.tipo_caixa);
    url.searchParams.append("skip", skip.toString());
    url.searchParams.append("limit", limit.toString());
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar movimentações filtradas");
    }
    return response.json();
  },
};

export const saidasAPI = {
  async criarSaidaFinanceira(
    saida: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/saidas/financeiro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(saida),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar saída");
    }

    return response.json();
  },
  async editarSaidaFinanceira(
    saida_id: number,
    dadosAtualizados: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/saidas/financeiro/${saida_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      throw new Error("Erro ao editar saída");
    }

    return response.json();
  },
  async criarSaidaMissionaria(
    saida: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/saidas/missoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(saida),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar saída");
    }

    return response.json();
  },
  async editarSaidaMissionaria(
    saida_id: number,
    dadosAtualizados: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/saidas/missoes/${saida_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      throw new Error("Erro ao editar saída");
    }

    return response.json();
  },
  async criarSaidaProjetos(
    saida: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/saidas/projetos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(saida),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar saída");
    }

    return response.json();
  },
  async editarSaidaProjetos(
    saida_id: number,
    dadosAtualizados: {
      tipo: string;
      valor: number;
      data: string;
      descricao: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/saidas/projetos/${saida_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      throw new Error("Erro ao editar saída");
    }

    return response.json();
  },
  async deletarSaidaFinanceira(saida_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/saidas/financeiro/${saida_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar saída");
    }

    return response.json();
  },
  async deletarSaidaMissionaria(saida_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/saidas/missoes/${saida_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar saída");
    }

    return response.json();
  },
  async deletarSaidaProjetos(saida_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/saidas/projetos/${saida_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar saída");
    }
    return response.json();
  },
};

export const relatoriosAPI = {
  async getRelatorioFinanceiroResumido(
    mes: number,
    ano: number,
    token: string
  ) {
    const url = `${URL_BASE}/relatorios/financeiro_resumido?mes=${mes}&ano=${ano}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar relatório financeiro resumido");
    }
    return response.json();
  },
  async getRelatorioFinanceiroDetalhado(
    mes: number,
    ano: number,
    token: string
  ) {
    const url = `${URL_BASE}/relatorios/financeiro?mes=${mes}&ano=${ano}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar relatório financeiro detalhado");
    }
    return response.json();
  },
};

export const eventosAPI = {
  async criarEvento(
    evento: {
      titulo: string;
      descricao: string;
      data_inicio: string;
      data_fim: string;
      ativo: boolean;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/eventos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(evento),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar evento");
    }

    return response.json();
  },
  async listarEventosAtivos(token: string) {
    const url = new URL(`${URL_BASE}/eventos/ativos`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar eventos");
    }
    return response.json();
  },
  async listarEventos(token: string, skip = 0, limit = 20) {
    const url = new URL(`${URL_BASE}/eventos/`);
    url.searchParams.append("skip", skip.toString());
    url.searchParams.append("limit", limit.toString());
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar eventos");
    }
    return response.json();
  },
  async buscarEventosPeloTitulo(termo: string, token: string) {
    const url = new URL(`${URL_BASE}/eventos/buscar`);
    url.searchParams.append("termo", termo);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar eventos");
    }
    return response.json();
  },
  async getEventoById(evento_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/eventos/${evento_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar evento");
    }

    return response.json();
  },
  async editarEvento(
    evento_id: number,
    dadosAtualizados: {
      titulo?: string;
      descricao?: string;
      data_inicio?: string;
      data_final?: string;
      ativo?: boolean;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/eventos/${evento_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      throw new Error("Erro ao editar evento");
    }

    return response.json();
  },
  async deletarEvento(evento_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/eventos/${evento_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar evento");
    }

    return response.json();
  },
};

export const escalasAPI = {
  async criarEscala(
    escala: {
      membro_id: number;
      tipo: string;
      data_escala: string;
      ativo: boolean;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/escalas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(escala),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar escala");
    }

    return response.json();
  },
  async listarEscalas(token: string, skip = 0, limit = 20) {
    const url = new URL(`${URL_BASE}/escalas/`);
    url.searchParams.append("skip", skip.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar escalas");
    }
    return response.json();
  },
  async getEscalaById(escala_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/escalas/${escala_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar escala");
    }

    return response.json();
  },
  async editarEscala(
    escala_id: number,
    dadosAtualizados: {
      membro_id?: number;
      tipo?: string;
      data_escala?: string;
      ativo?: boolean;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/escalas/${escala_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
      throw new Error("Erro ao editar escala");
    }

    return response.json();
  },
  async deletarEscala(escala_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/escalas/${escala_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar escala");
    }

    return response.json();
  },
};

export const cargosAPI = {
  async listarCargos(token: string) {
    const response = await fetch(`${URL_BASE}/cargos/`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar cargos");
    }
    return response.json();
  },
  async criarCargo(
    cargo: {
      nome: string;
    },
    token: string
  ) {
    const response = await fetch(`${URL_BASE}/cargos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cargo),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar cargo");
    }

    return response.json();
  },
  async vincularMembroCargo(
    membro_id: number,
    cargo_id: number,
    token: string
  ) {
    const url = new URL(`${URL_BASE}/cargos/vincular`);
    url.searchParams.append("membro_id", membro_id.toString());
    url.searchParams.append("cargo_id", cargo_id.toString());

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao vincular membro ao cargo");
    }

    return response.json();
  },
  async desvincularMembroCargo(
    membro_id: number,
    cargo_id: number,
    token: string
  ) {
    const url = new URL(`${URL_BASE}/cargos/desvincular`);
    url.searchParams.append("membro_id", membro_id.toString());
    url.searchParams.append("cargo_id", cargo_id.toString());

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao desvincular membro do cargo");
    }

    return response.json();
  },
  async listarMembrosComCargos(token: string) {
    const response = await fetch(`${URL_BASE}/cargos/membros`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar membros com cargos");
    }
    return response.json();
  },
};


