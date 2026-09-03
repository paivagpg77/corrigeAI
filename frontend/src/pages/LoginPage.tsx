import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.login(email, senha)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-subtle"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-subtle"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-display">CorrigeAI</h1>
            <p className="text-primary-100 text-sm mt-2 font-medium">Correção Automática de Provas</p>
          </div>

          {/* Conteúdo */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-danger-900 text-sm font-medium">Erro na autenticação</p>
                  <p className="text-danger-700 text-xs mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition duration-200 text-neutral-900 placeholder-neutral-500"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg">🔒</span>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none transition duration-200 text-neutral-900 placeholder-neutral-500"
                    required
                  />
                </div>
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Autenticando...
                  </>
                ) : (
                  <>
                    ✅ Entrar
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-neutral-500 font-medium">Dados de Demo</span>
              </div>
            </div>

            {/* Cards de Demo */}
            <div className="space-y-3">
              <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                <p className="text-xs font-semibold text-primary-900">👨‍🏫 Professor</p>
                <p className="text-xs text-primary-700 mt-1">prof@escola.com / 123456</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-900">👔 Coordenador</p>
                <p className="text-xs text-secondary-700 mt-1">coord@escola.com / 123456</p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg border border-success-200">
                <p className="text-xs font-semibold text-success-900">🏫 Diretor</p>
                <p className="text-xs text-success-700 mt-1">diretor@escola.com / 123456</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-neutral-50 border-t border-neutral-200">
            <p className="text-center text-xs text-neutral-500">
              © 2024 CorrigeAI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}