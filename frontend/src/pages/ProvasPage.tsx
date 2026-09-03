import { useState } from 'react'
import { authService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'

export default function ProvasPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const provas = [
    { id: 1, titulo: 'Simulado ENEM 2024', questoes: 180, status: 'publicada', criacao: '01/09/2024', alunos: 145 },
    { id: 2, titulo: 'Prova de Matemática', questoes: 40, status: 'rascunho', criacao: '30/08/2024', alunos: 0 },
    { id: 3, titulo: 'Avaliação de Português', questoes: 50, status: 'finalizada', criacao: '25/08/2024', alunos: 134 },
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
                <h1 className="text-4xl font-bold text-neutral-900 font-display">📋 Provas</h1>
                <p className="text-neutral-600 mt-2">Gerenciar e criar novas provas</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
              >
                ➕ Nova Prova
              </button>
            </div>

            {/* Filtros */}
            <div className="mb-8 flex gap-3">
              {['Todos', 'Rascunho', 'Publicadas', 'Finalizadas'].map((filter) => (
                <button key={filter} className="px-4 py-2 rounded-lg font-medium text-sm transition bg-white hover:bg-primary-50 text-neutral-700 hover:text-primary-700 border border-neutral-200">
                  {filter}
                </button>
              ))}
            </div>

            {/* Tabela de Provas */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Título</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Questões</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Criação</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Alunos</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provas.map((prova) => (
                      <tr key={prova.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-neutral-900">{prova.titulo}</p>
                        </td>
                        <td className="px-6 py-4 text-neutral-700">{prova.questoes}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${prova.status === 'publicada' && 'bg-success-100 text-success-800'}
                            ${prova.status === 'rascunho' && 'bg-neutral-200 text-neutral-800'}
                            ${prova.status === 'finalizada' && 'bg-primary-100 text-primary-800'}
                          `}>
                            {prova.status === 'publicada' && '✅ Publicada'}
                            {prova.status === 'rascunho' && '📝 Rascunho'}
                            {prova.status === 'finalizada' && '🔒 Finalizada'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-700 text-sm">{prova.criacao}</td>
                        <td className="px-6 py-4 text-neutral-700 font-semibold">{prova.alunos}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">Editar</button>
                            <button className="text-danger-600 hover:text-danger-700 font-medium text-sm">Deletar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal de Nova Prova */}
            {showModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6 font-display">Criar Nova Prova</h2>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Título</label>
                      <input type="text" placeholder="Simulado ENEM 2024" className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Total de Questões</label>
                      <input type="number" placeholder="180" className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none" />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-900 rounded-lg font-medium hover:bg-neutral-50">
                        Cancelar
                      </button>
                      <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                        Criar
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