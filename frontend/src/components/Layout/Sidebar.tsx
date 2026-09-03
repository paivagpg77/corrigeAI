import { useNavigate, useLocation } from "react-router-dom"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  userType: string
}

export default function Sidebar({ isOpen, setIsOpen, userType }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", roles: ["professor", "coordenador", "diretor"] },
    { label: "Provas", path: "/provas", roles: ["professor", "coordenador", "diretor"] },
    { label: "Resultados", path: "/resultados", roles: ["professor", "coordenador", "diretor"] },
    { label: "Relatórios", path: "/relatorios", roles: ["professor", "coordenador", "diretor"] },
  ]

  const filteredItems = menuItems.filter(item => item.roles.includes(userType))
  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)}></div>
      )}
      <div className={`fixed md:static w-64 h-screen bg-gray-900 text-white transform transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">CorrigeAI</h2>
        </div>
        <nav className="mt-8 px-4 space-y-2">
          {filteredItems.map((item) => {
            const active = isActive(item.path)
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setIsOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
