// Serviço central de requisições à API
export const URL_BASE = "http://localhost:5000";

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

export const membrosAPI = {
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
  async listarEntradasFiltradas(
    filtro: {
      tipo?: string;
      descricao?: string;
      nome_membro?: string;
      data_inicio?: string;
      data_fim?: string;
    },
    token: string,
    skip = 0,
    limit = 10
  ) {
    const url = new URL(`${URL_BASE}/entradas/filtradas`);
    if (filtro.tipo) url.searchParams.append("tipo", filtro.tipo);
    if (filtro.descricao)
      url.searchParams.append("descricao", filtro.descricao); 
    if (filtro.nome_membro)
      url.searchParams.append("nome_membro", filtro.nome_membro);
    if (filtro.data_inicio)
      url.searchParams.append("data_inicio", filtro.data_inicio);
    if (filtro.data_fim) url.searchParams.append("data_fim", filtro.data_fim);
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
      throw new Error("Erro ao buscar entradas filtradas");
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
  async getEntradaById(entrada_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/entradas/${entrada_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar entrada");
    }

    return response.json();
  },
  async listarEntradasFinanceiras(token: string, skip = 0, limit = 20) {
    const url = new URL(`${URL_BASE}/entradas/`);
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
      throw new Error("Erro ao buscar últimas entradas");
    }
    return response.json();
  },
  async getEntradaMissionariaById(entrada_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/entradas/missoes/${entrada_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar entrada missionária");
    }

    return response.json();
  },
  async listarEntradasMissionarias(token: string, skip = 0, limit = 20) {
    const url = new URL(`${URL_BASE}/entradas/listar/missoes`);
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
      throw new Error("Erro ao buscar últimas entradas missionárias");
    }
    return response.json();
  },
  async getEntradaProjetoById(entrada_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/entradas/projetos/${entrada_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar entrada de projeto");
    }

    return response.json();
  },
  async listarEntradasProjetos(token: string, skip = 0, limit = 20) {
    const url = new URL(`${URL_BASE}/entradas/listar/projetos`);
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
      throw new Error("Erro ao buscar últimas entradas de projetos");
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
    const response = await fetch(`${URL_BASE}/entradas/financeiro/${entrada_id}`, {
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
    const response = await fetch(`${URL_BASE}/entradas/projetos/${entrada_id}`, {
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
  async deletarEntradaFinanceira(entrada_id: number, token: string) {
    const response = await fetch(`${URL_BASE}/entradas/financeiro/${entrada_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    const response = await fetch(`${URL_BASE}/entradas/projetos/${entrada_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar entrada");
    }

    return response.json();
  },
  async todasMovimentacoesFiltradas(
    filtro: {
      descricao?: string,
      membro_id?: number,
      data_inicio?: string,
      data_fim?: string,
      tipo_movimento?: string,
      tipo_caixa?: string
    },
    token: string,
    skip = 0,
    limit = 20
  ) {
    const url = new URL(`${URL_BASE}/filtrar`);
    if (filtro.descricao) url.searchParams.append("descricao", filtro.descricao);
    if (filtro.membro_id) url.searchParams.append("membro_id", filtro.membro_id.toString());
    if (filtro.data_inicio) url.searchParams.append("data_inicio", filtro.data_inicio);
    if (filtro.data_fim) url.searchParams.append("data_fim", filtro.data_fim);
    if (filtro.tipo_movimento) url.searchParams.append("tipo_movimento", filtro.tipo_movimento);
    if (filtro.tipo_caixa) url.searchParams.append("tipo_caixa", filtro.tipo_caixa);
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
  }
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
};
