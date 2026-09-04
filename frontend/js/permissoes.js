// ============================================
// SISTEMA DE PERMISSÕES - CORRIGEAI v2
// ============================================
//
// DIRETOR:
//   Dashboard, Gestão (pessoas), Turmas, Alunos,
//   Provas, Resultados, Relatórios
//   → Pode cadastrar professores, coordenadores,
//     turmas e alunos. Vê escola inteira.
//
// COORDENADOR:
//   Dashboard, Turmas, Alunos,
//   Provas, Resultados, Relatórios
//   → Pode cadastrar turmas e alunos da coordenação.
//     Vê dados da sua coordenação.
//
// PROFESSOR:
//   Dashboard, Provas, Resultados
//   → Só vê e cria provas das turmas dele.
//     Só vê resultados das turmas dele.
//     SEM relatórios, SEM gestão, SEM turmas/alunos.
//

const PERMISSOES = {

    professor: {
        paginas: [
            'dashboard.html',
            'provas.html',
            'resultados.html'
        ],
        label: 'Professor',
        dashboardTitulo: 'Suas Turmas',
        dashboardSubtitulo: 'Acompanhe suas provas e o desempenho dos seus alunos'
    },

    coordenador: {
        paginas: [
            'dashboard.html',
            'turmas.html',
            'alunos.html',
            'provas.html',
            'resultados.html',
            'relatorios.html'
        ],
        label: 'Coordenador',
        dashboardTitulo: 'Sua Coordenação',
        dashboardSubtitulo: 'Gerencie turmas, alunos e acompanhe o desempenho'
    },

    diretor: {
        paginas: [
            'dashboard.html',
            'gestao.html',
            'turmas.html',
            'alunos.html',
            'provas.html',
            'resultados.html',
            'relatorios.html'
        ],
        label: 'Diretor',
        dashboardTitulo: 'Visão Geral da Escola',
        dashboardSubtitulo: 'Gerencie equipe, turmas, alunos e acompanhe toda a escola'
    }
};


// ============================================
// TODOS OS ITENS DO MENU
// ============================================

const MENU_ITENS = [
    { pagina: 'dashboard.html',  icone: '📊', label: 'Dashboard' },
    { pagina: 'gestao.html',     icone: '👥', label: 'Gestão' },
    { pagina: 'turmas.html',     icone: '🏫', label: 'Turmas' },
    { pagina: 'alunos.html',     icone: '🎓', label: 'Alunos' },
    { pagina: 'provas.html',     icone: '📋', label: 'Provas' },
    { pagina: 'resultados.html', icone: '📈', label: 'Resultados' },
    { pagina: 'relatorios.html', icone: '📄', label: 'Relatórios' }
];


// ============================================
// VERIFICAR LOGIN E PERMISSÃO
// ============================================

function verificarAcesso() {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    if (!user.email && !token) {
        window.location.href = 'login.html';
        return null;
    }

    const tipo = (user.tipo || 'professor').toLowerCase();
    const paginaAtual = window.location.pathname.split('/').pop();
    const permissao = PERMISSOES[tipo];

    if (permissao && !permissao.paginas.includes(paginaAtual)) {
        alert('Você não tem permissão para acessar esta página.');
        window.location.href = 'dashboard.html';
        return null;
    }

    return { user, tipo, permissao };
}


// ============================================
// MONTAR SIDEBAR DINÂMICA
// ============================================

function montarSidebar(tipo) {

    const permissao = PERMISSOES[tipo];
    const paginaAtual = window.location.pathname.split('/').pop();

    const itensPermitidos = MENU_ITENS.filter(item =>
        permissao.paginas.includes(item.pagina)
    );

    const navHTML = itensPermitidos.map(item => {
        const ativo = paginaAtual === item.pagina ? ' active' : '';
        return `
            <a href="${item.pagina}" class="nav-item${ativo}">
                <span class="nav-icon">${item.icone}</span>
                <span>${item.label}</span>
            </a>
        `;
    }).join('');

    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
        sidebarNav.innerHTML = navHTML;
    }
}


// ============================================
// ATUALIZAR HEADER COM INFO DO USUÁRIO
// ============================================

function atualizarHeader(user, tipo) {

    const permissao = PERMISSOES[tipo];
    const nome = user.nome || user.email?.split('@')[0] || 'Usuário';
    const primeiraLetra = nome.charAt(0).toUpperCase();

    const avatar = document.getElementById('avatar');
    if (avatar) avatar.textContent = primeiraLetra;

    const username = document.getElementById('username');
    if (username) username.textContent = nome;

    const userrole = document.getElementById('userrole');
    if (userrole) userrole.textContent = permissao.label;

    const greeting = document.getElementById('greeting');
    if (greeting) greeting.textContent = `Bem-vindo, ${nome.split(' ')[0]}!`;

    const subtitle = document.getElementById('subtitle');
    if (subtitle) subtitle.textContent = permissao.dashboardSubtitulo;
}


// ============================================
// INICIALIZAR
// ============================================

function inicializarPermissoes() {

    const acesso = verificarAcesso();
    if (!acesso) return null;

    const { user, tipo, permissao } = acesso;

    montarSidebar(tipo);
    atualizarHeader(user, tipo);

    return { user, tipo, permissao };
}


// ============================================
// LOGOUT
// ============================================

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}


// ============================================
// AUTO-INICIALIZAR
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    inicializarPermissoes();
});