import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==========================================
// AUTH SERVICE
// ==========================================

export const authService = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha })
    const { token, user } = response.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return { token, user }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    const { token } = response.data
    localStorage.setItem('token', token)
    return token
  },
}

// ==========================================
// PROVAS SERVICE
// ==========================================

export const provasService = {
  listar: async () => {
    const response = await api.get('/provas')
    return response.data
  },

  obter: async (id: string) => {
    const response = await api.get(`/provas/${id}`)
    return response.data
  },

  criar: async (dados: any) => {
    const response = await api.post('/provas', dados)
    return response.data
  },

  atualizar: async (id: string, dados: any) => {
    const response = await api.put(`/provas/${id}`, dados)
    return response.data
  },

  deletar: async (id: string) => {
    const response = await api.delete(`/provas/${id}`)
    return response.data
  },

  publicar: async (id: string) => {
    const response = await api.patch(`/provas/${id}/publicar`)
    return response.data
  },

  finalizar: async (id: string) => {
    const response = await api.patch(`/provas/${id}/finalizar`)
    return response.data
  },
}

// ==========================================
// GABARITO SERVICE
// ==========================================

export const gabaritoService = {
  configurar: async (provaId: string, dados: any) => {
    const response = await api.post(`/gabaritos/${provaId}`, dados)
    return response.data
  },

  obter: async (provaId: string) => {
    const response = await api.get(`/gabaritos/${provaId}`)
    return response.data
  },

  atualizarDificuldade: async (provaId: string, numeroQuestao: number, dificuldade: string) => {
    const response = await api.patch(`/gabaritos/${provaId}/questoes/${numeroQuestao}`, {
      dificuldade,
    })
    return response.data
  },

  atualizarPeso: async (provaId: string, numeroQuestao: number, peso: number) => {
    const response = await api.patch(`/gabaritos/${provaId}/questoes/${numeroQuestao}`, {
      peso,
    })
    return response.data
  },
}

// ==========================================
// FOLHAS (QR CODES) SERVICE
// ==========================================

export const folhasService = {
  gerarQRCodes: async (provaId: string, turmaId: string) => {
    const response = await api.post('/folhas/gerar-qr', {
      prova_id: provaId,
      turma_id: turmaId,
    })
    return response.data
  },

  baixarPDFs: async (provaId: string, turmaId: string) => {
    const response = await api.get(`/folhas/download/${provaId}/${turmaId}`, {
      responseType: 'blob',
    })
    return response.data
  },

  statusGeracao: async (provaId: string) => {
    const response = await api.get(`/folhas/status/${provaId}`)
    return response.data
  },
}

// ==========================================
// CORREÇÃO (OCR) SERVICE
// ==========================================

export const correcaoService = {
  enviarFoto: async (provaId: string, file: File, qrToken: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('prova_id', provaId)
    formData.append('qr_token', qrToken)

    const response = await api.post('/correcao/processar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  obterResultado: async (respostaId: string) => {
    const response = await api.get(`/correcao/resultado/${respostaId}`)
    return response.data
  },

  historico: async (provaId: string) => {
    const response = await api.get(`/correcao/historico/${provaId}`)
    return response.data
  },
}

// ==========================================
// RESULTADOS SERVICE
// ==========================================

export const resultadosService = {
  obterProva: async (provaId: string) => {
    const response = await api.get(`/resultados/prova/${provaId}`)
    return response.data
  },

  obterAluno: async (alunoId: string) => {
    const response = await api.get(`/resultados/aluno/${alunoId}`)
    return response.data
  },

  obterTurma: async (turmaId: string) => {
    const response = await api.get(`/resultados/turma/${turmaId}`)
    return response.data
  },

  porArea: async (provaId: string, area: string) => {
    const response = await api.get(`/resultados/prova/${provaId}/area/${area}`)
    return response.data
  },

  analiseTurma: async (turmaId: string, provaId: string) => {
    const response = await api.get(`/resultados/analise/${turmaId}/${provaId}`)
    return response.data
  },
}

// ==========================================
// RELATÓRIOS SERVICE
// ==========================================

export const relatoriosService = {
  gerar: async (tipo: string, filtros: any) => {
    const response = await api.post('/relatorios/gerar', {
      tipo,
      filtros,
    })
    return response.data
  },

  exportarExcel: async (provaId: string, area?: string) => {
    const response = await api.get(
      `/relatorios/exportar/excel/${provaId}${area ? `?area=${area}` : ''}`,
      {
        responseType: 'blob',
      }
    )
    return response.data
  },

  exportarCSV: async (provaId: string, area?: string) => {
    const response = await api.get(
      `/relatorios/exportar/csv/${provaId}${area ? `?area=${area}` : ''}`,
      {
        responseType: 'blob',
      }
    )
    return response.data
  },

  listar: async () => {
    const response = await api.get('/relatorios')
    return response.data
  },
}

// ==========================================
// DASHBOARD SERVICE
// ==========================================

export const dashboardService = {
  statsProf: async () => {
    const response = await api.get('/dashboard/professor')
    return response.data
  },

  statsCoord: async () => {
    const response = await api.get('/dashboard/coordenador')
    return response.data
  },

  statsDir: async () => {
    const response = await api.get('/dashboard/diretor')
    return response.data
  },

  alertas: async () => {
    const response = await api.get('/dashboard/alertas')
    return response.data
  },
}

// ==========================================
// TURMAS SERVICE
// ==========================================

export const turmasService = {
  listar: async () => {
    const response = await api.get('/turmas')
    return response.data
  },

  obter: async (id: string) => {
    const response = await api.get(`/turmas/${id}`)
    return response.data
  },

  criar: async (dados: any) => {
    const response = await api.post('/turmas', dados)
    return response.data
  },

  atualizar: async (id: string, dados: any) => {
    const response = await api.put(`/turmas/${id}`, dados)
    return response.data
  },
}

// ==========================================
// HEALTH CHECK SERVICE
// ==========================================

export const healthService = {
  check: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch {
      throw new Error('Backend não está disponível')
    }
  },
}

export default api