import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      navigate('/login')
      return
    }
    setUser(currentUser)
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-neutral-600 font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userType={user?.tipo} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-neutral-900 font-display">
                Bem-vindo, {user?.nome?.split(' ')[0]}! 👋
              </h1>
              <p className="text-neutral-600 mt-2">
                {user?.tipo === 'professor' && 'Acompanhe suas provas e o desempenho dos alunos'}
                {user?.tipo === 'coordenador' && 'Veja o desempenho de sua coordenação'}
                {user?.tipo === 'diretor' && 'Visão geral de toda a escola'}
              </p>
            </div>

            {/* Cards Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Card 1 */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500 hover:shadow-lg transition animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm font-medium">Provas Criadas</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">12</p>
                    <p className="text-xs text-success-600 mt-2">↑ 2 esta semana</p>
                  </div>
                  <div className="text-4xl">📄</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-secondary-500 hover:shadow-lg transition animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm font-medium">Alunos</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">400</p>
                    <p className="text-xs text-success-600 mt-2">↑ 15 inscrições</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-warning-500 hover:shadow-lg transition animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm font-medium">Desempenho Médio</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">81%</p>
                    <p className="text-xs text-success-600 mt-2">↑ 5% vs. mês passado</p>
                  </div>
                  <div className="text-4xl">📈</div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-success-500 hover:shadow-lg transition animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm font-medium">Score TRI Médio</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">650</p>
                    <p className="text-xs text-success-600 mt-2">↑ 20 pontos</p>
                  </div>
                  <div className="text-4xl">🎯</div>
                </div>
              </div>
            </div>

            {/* Grid 2x2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Provas Recentes */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 font-display">📊 Últimas Provas</h2>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver todas →</button>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Simulado ENEM 2024', date: '02/09/2024', students: 145 },
                    { title: 'Prova de Matemática', date: '25/08/2024', students: 89 },
                    { title: 'Avaliação de Português', date: '18/08/2024', students: 134 },
                  ].map((prova, idx) => (
                    <div key={idx} className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition cursor-pointer border border-neutral-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-neutral-900">{prova.title}</p>
                          <p className="text-xs text-neutral-500 mt-1">{prova.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary-600">{prova.students}</p>
                          <p className="text-xs text-neutral-500">responderam</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 font-display">⚡ Atividade</h2>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Mais detalhes →</button>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Provas finalizadas', value: 12, max: 15, color: 'primary' },
                    { label: 'Resultados processados', value: 180, max: 200, color: 'secondary' },
                    { label: 'Relatórios gerados', value: 8, max: 10, color: 'success' },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-neutral-700">{item.label}</p>
                        <p className="text-sm font-semibold text-neutral-900">{item.value}/{item.max}</p>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 bg-${item.color}-500`}
                          style={{ width: `${(item.value / item.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alertas */}
            <div className="mt-8 bg-warning-50 border-l-4 border-warning-500 rounded-lg p-6 flex gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-warning-900">Atenção!</h3>
                <p className="text-sm text-warning-800 mt-1">Você tem 3 provas para publicar nos próximos 2 dias.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}