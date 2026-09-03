import { useState } from 'react'
import { authService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'

export default function ResultadosPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const resultados = [
    { aluno: 'Ana Silva', prova: 'Simulado ENEM', acertos: 145, total: 180, percentual: 81, tri: 680 },
    { aluno: 'Bruno Santos', prova: 'Simulado ENEM', acertos: 132, total: 180, percentual: 73, tri: 620 },
    { aluno: 'Carolina Costa', prova: 'Simulado ENEM', acertos: 155, total: 180, percentual: 86, tri: 720 },
    { aluno: 'Diego Oliveira', prova: 'Simulado ENEM', acertos: 118, total: 180, percentual: 66, tri: 550 },
  ]

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
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-neutral-900 font-display">📊 Resultados</h1>
              <p className="text-neutral-600 mt-2">Análise de desempenho dos alunos</p>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
                <p className="text-neutral-600 text-sm font-medium">Média Geral</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">77%</p>
                <p className="text-xs text-neutral-500 mt-2">de acerto</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-success-500">
                <p className="text-neutral-600 text-sm font-medium">Melhor Desempenho</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">86%</p>
                <p className="text-xs text-neutral-500 mt-2">Carolina Costa</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-warning-500">
                <p className="text-neutral-600 text-sm font-medium">Pior Desempenho</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">66%</p>
                <p className="text-xs text-neutral-500 mt-2">Diego Oliveira</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-secondary-500">
                <p className="text-neutral-600 text-sm font-medium">TRI Score Médio</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">642</p>
                <p className="text-xs text-neutral-500 mt-2">pontos</p>
              </div>
            </div>

            {/* Tabela de Resultados */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200">
              <div className="p-6 border-b border-neutral-200 bg-neutral-50">
                <h2 className="text-lg font-bold text-neutral-900 font-display">Resultados por Aluno</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Aluno</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Prova</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Acertos</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Percentual</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">TRI Score</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((resultado, idx) => (
                      <tr key={idx} className="border-b border-neutral-200 hover:bg-neutral-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-neutral-900">{resultado.aluno}</p>
                        </td>
                        <td className="px-6 py-4 text-neutral-700">{resultado.prova}</td>
                        <td className="px-6 py-4 font-semibold text-neutral-900">{resultado.acertos}/{resultado.total}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-neutral-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-500 rounded-full transition-all"
                                style={{ width: `${resultado.percentual}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-neutral-900">{resultado.percentual}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm font-semibold">
                            {resultado.tri}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {resultado.percentual >= 80 && <span className="text-success-600 font-semibold">✅ Aprovado</span>}
                          {resultado.percentual >= 60 && resultado.percentual < 80 && <span className="text-warning-600 font-semibold">⚠️ Atenção</span>}
                          {resultado.percentual < 60 && <span className="text-danger-600 font-semibold">❌ Reprovado</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Análise por Área */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-neutral-200">
              <h2 className="text-lg font-bold text-neutral-900 mb-6 font-display">📈 Desempenho por Área de Conhecimento</h2>
              
              <div className="space-y-4">
                {[
                  { area: 'Ciências da Natureza', media: 82, max: 100 },
                  { area: 'Ciências Humanas', media: 76, max: 100 },
                  { area: 'Linguagens', media: 79, max: 100 },
                  { area: 'Matemática', media: 72, max: 100 },
                ].map((item) => (
                  <div key={item.area}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-neutral-900">{item.area}</p>
                      <p className="text-sm font-semibold text-primary-600">{item.media}%</p>
                    </div>
                    <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all"
                        style={{ width: `${item.media}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}