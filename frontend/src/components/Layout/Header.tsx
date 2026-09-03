interface HeaderProps {
  user: any
  onLogout: () => void
  onMenuClick: () => void
}

export default function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg transition md:hidden">
          ☰
        </button>
        <h1 className="text-xl font-bold text-blue-600">CorrigeAI</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{user?.nome?.charAt(0).toUpperCase()}</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user?.nome}</p>
          <p className="text-xs text-gray-500">
            {user?.tipo === 'professor' && 'Professor'}
            {user?.tipo === 'coordenador' && 'Coordenador'}
            {user?.tipo === 'diretor' && 'Diretor'}
          </p>
        </div>
        <button onClick={onLogout} className="ml-4 p-2 hover:bg-red-50 rounded-lg transition text-red-600">
          🚪
        </button>
      </div>
    </header>
  )
}
