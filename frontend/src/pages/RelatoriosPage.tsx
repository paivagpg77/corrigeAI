import { useState } from 'react'
import { authService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'

export default function RelatoriosPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const relatorios = [
    { id: 1, titulo: 'Relatório ENEM - Setembro 2024', data: '02/09/2024', formato: 'PDF', tamanho: '2.4 MB', status: 'pronto' },
    { id: 2, titulo: 'Análise de Desempenho - Turma 1001', data: '01/09/2024', formato: 'Excel', tamanho: '1.2 MB', status: 'pronto' },
    { id: 3, titulo: 'Comparativo de Resultados', data: '25/08/2024', formato: 'PDF', tamanho: '3.1 MB', status: 'pronto' },
    { id: 4, titulo: 'Ranking de Alunos - Agosto', data: '31/08/2024', formato: 'Excel', tamanho: '0.8 MB', status: 'pronto' },
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 font-display">📄 Relatórios</h1>
                <p className="text-neutral-600 mt-2">Gerar e exportar relatórios de desempenho</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
              >
                ➕ Gerar Novo
              </button>
            </div>

            {/* Cards de Atalhos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200 cursor-pointer hover:shadow-lg transition transform hover:scale-105">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-primary-900 font-display">Relatório Geral</h3>
                <p className="text-sm text-primary-700 mt-2">Análise completa de desempenho</p>
              </div>

              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200 cursor-pointer hover:shadow-lg transition transform hover:scale-105">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-lg font-bold text-secondary-900 font-display">Por Turma</h3>
                <p className="text-sm text-secondary-700 mt-2">Comparativo entre turmas</p>
              </div>

              <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-6 border border-success-200 cursor-pointer hover:shadow-lg transition transform hover:scale-105">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-lg font-bold text-success-900 font-display">Por Aluno</h3>
                <p className="text-sm text-success-700 mt-2">Desempenho individual</p>
              </div>
            </div>

            {/* Relatórios Gerados */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200">
              <div className="p-6 border-b border-neutral-200 bg-neutral-50">
                <h2 className="text-lg font-bold text-neutral-900 font-display">Relatórios Disponíveis</h2>
              </div>

              <div className="divide-y divide-neutral-200">
                {relatorios.map((relatorio) => (
                  <div key={relatorio.id} className="p-6 hover:bg-neutral-50 transition flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">
                        {relatorio.formato === 'PDF' ? '📕' : '📗'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900">{relatorio.titulo}</p>
                        <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                          <span>📅 {relatorio.data}</span>
                          <span>📦 {relatorio.tamanho}</span>
                          <span>{relatorio.formato}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium text-sm transition">
                        👁️ Ver
                      </button>
                      <button className="px-4 py-2 text-secondary-600 hover:bg-secondary-50 rounded-lg font-medium text-sm transition">
                        ⬇️ Baixar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-display">Gerar Novo Relatório</h2>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Tipo</label>
                      <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none">
                        <option>Relatório Geral</option>
                        <option>Por Turma</option>
                        <option>Por Aluno</option>
                        <option>Por Área</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Período</label>
                      <div className="flex gap-2">
                        <input type="date" className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none" />
                        <span className="flex items-center">até</span>
                        <input type="date" className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Formato</label>
                      <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none">
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-900 rounded-lg font-medium hover:bg-neutral-50">
                        Cancelar
                      </button>
                      <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                        Gerar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}