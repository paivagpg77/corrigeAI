// src/types/index.ts

// ==========================================
// USUÁRIOS E AUTENTICAÇÃO
// ==========================================

export type UserRole = 'professor' | 'coordenador' | 'diretor'

export interface Usuario {
  id: string
  nome: string
  email: string
  tipo: UserRole
  escola_id: string
  avatar_url?: string
  ativo: boolean
  data_criacao: string
}

export interface AuthResponse {
  user: Usuario
  token: string
  refreshToken?: string
}

export interface LoginRequest {
  email: string
  senha: string
}

// ==========================================
// PROVAS
// ==========================================

export type ProvaStatus = 'rascunho' | 'publicada' | 'finalizada'

export interface Prova {
  id: string
  titulo: string
  descricao?: string
  total_questoes: number
  data_aplicacao?: string
  status: ProvaStatus
  gabarito_pdf_url?: string
  data_criacao: string
  professor_id: string
  escola_id: string
}

export interface CriarProvaRequest {
  titulo: string
  descricao?: string
  total_questoes: number
  data_aplicacao?: string
  gabarito_pdf?: File
}

// ==========================================
// GABARITO E QUESTÕES
// ==========================================

export type Dificuldade = 'facil' | 'media' | 'dificil'

export interface Questao {
  id: string
  prova_id: string
  numero_questao: number
  resposta_correta: string
  dificuldade: Dificuldade
  peso: number
  disciplina: string
  area_conhecimento: string
}

export interface GabaritoRequest {
  prova_id: string
  questoes: Questao[]
}

// ==========================================
// ÁREAS DE CONHECIMENTO
// ==========================================

export interface AreaConhecimento {
  id: string
  nome: string
  slug: string
}

export const AREAS_CONHECIMENTO: AreaConhecimento[] = [
  { id: '1', nome: 'Ciências da Natureza', slug: 'natureza' },
  { id: '2', nome: 'Ciências Humanas', slug: 'humanas' },
  { id: '3', nome: 'Linguagens', slug: 'linguagens' },
  { id: '4', nome: 'Matemática', slug: 'matematica' },
]

// ==========================================
// RESULTADOS
// ==========================================

export interface ResultadoAluno {
  id: string
  aluno_id: string
  prova_id: string
  total_acertos: number
  total_questoes: number
  percentual_convencional: number
  pontuacao_obtida: number
  pontuacao_maxima: number
  tri_score?: number
  notas_por_area: {
    [key: string]: {
      convencional: number
      acertos: number
      total: number
    }
  }
  data_resultado: string
}

export interface AnaliseTurma {
  turma_id: string
  prova_id: string
  media_percentual: number
  media_tri?: number
  desvio_padrao_tri?: number
  melhor_aluno: string
  pior_aluno: string
  media_por_area: {
    [key: string]: number
  }
}

// ==========================================
// QR CODE E FOLHAS
// ==========================================

export interface FolhaResposta {
  id: string
  aluno_id: string
  prova_id: string
  qr_code_token: string
  qr_code_url: string
  pdf_url: string
  gerado: boolean
  impresso: boolean
}

export interface GenerarQRRequest {
  prova_id: string
  turma_id: string
}

// ==========================================
// RELATÓRIOS
// ==========================================

export interface Relatorio {
  id: string
  tipo: 'turma' | 'professor' | 'area' | 'geral'
  titulo: string
  arquivo_url: string
  data_geracao: string
}

// ==========================================
// TURMAS
// ==========================================

export interface Turma {
  id: string
  nome: string
  ano: string
  professor_id: string
  total_alunos: number
}

// ==========================================
// FILTROS E QUERIES
// ==========================================

export interface FiltroResultados {
  prova_id?: string
  turma_id?: string
  area_conhecimento?: string
  data_inicio?: string
  data_fim?: string
}

export interface PaginacaoParams {
  page: number
  limit: number
  sort?: 'asc' | 'desc'
  sortBy?: string
}

// ==========================================
// DASHBOARD
// ==========================================

export interface DashboardStats {
  total_provas: number
  total_alunos: number
  media_desempenho: number
  provas_recentes: Prova[]
  alertas: string[]
}

export interface ChartData {
  name: string
  value: number
  area?: string
}