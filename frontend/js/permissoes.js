// ============================================
// SISTEMA DE PERMISSÕES - CORRIGEAI v3
// ============================================
//
// DIRETOR:
//   Dashboard, Gestão, Turmas, Alunos,
//   Provas, Resultados, Relatórios
//
// COORDENADOR:
//   Dashboard, Turmas, Alunos,
//   Provas, Resultados, Relatórios
//
// PROFESSOR:
//   Dashboard, Provas, Resultados
//
// ============================================


const PERMISSOES = {

    professor: {
        paginas: [
            "dashboard.html",
            "provas.html",
            "resultados.html"
        ],

        label: "Professor",

        dashboardTitulo: "Suas Turmas",

        dashboardSubtitulo:
            "Acompanhe suas provas e o desempenho dos seus alunos"
    },


    coordenador: {
        paginas: [
            "dashboard.html",
            "turmas.html",
            "alunos.html",
            "provas.html",
            "resultados.html",
            "relatorios.html"
        ],

        label: "Coordenador",

        dashboardTitulo: "Sua Coordenação",

        dashboardSubtitulo:
            "Gerencie turmas, alunos e acompanhe o desempenho"
    },


    diretor: {
        paginas: [
            "dashboard.html",
            "gestao.html",
            "turmas.html",
            "alunos.html",
            "provas.html",
            "resultados.html",
            "relatorios.html"
        ],

        label: "Diretor",

        dashboardTitulo: "Visão Geral da Escola",

        dashboardSubtitulo:
            "Gerencie equipe, turmas, alunos e acompanhe toda a escola"
    }

};


// ============================================
// TODOS OS ITENS DO MENU
// ============================================

const MENU_ITENS = [

    {
        pagina: "dashboard.html",
        icone: "📊",
        label: "Dashboard"
    },

    {
        pagina: "gestao.html",
        icone: "👥",
        label: "Gestão"
    },

    {
        pagina: "turmas.html",
        icone: "🏫",
        label: "Turmas"
    },

    {
        pagina: "alunos.html",
        icone: "🎓",
        label: "Alunos"
    },

    {
        pagina: "provas.html",
        icone: "📋",
        label: "Provas"
    },

    {
        pagina: "resultados.html",
        icone: "📈",
        label: "Resultados"
    },

    {
        pagina: "relatorios.html",
        icone: "📄",
        label: "Relatórios"
    }

];


// ============================================
// OBTER USUÁRIO LOGADO
// ============================================

function obterUsuarioLogado() {

    const usuarioSalvo =
        localStorage.getItem("usuario");

    if (!usuarioSalvo) {
        return null;
    }

    try {

        return JSON.parse(usuarioSalvo);

    } catch (error) {

        console.error(
            "Erro ao ler usuário:",
            error
        );

        return null;
    }
}


// ============================================
// VERIFICAR LOGIN E PERMISSÃO
// ============================================

function verificarAcesso() {

    const user =
        obterUsuarioLogado();

    const token =
        localStorage.getItem("token");


    // Não está logado
    if (!user || !user.email || !token) {

        window.location.href =
            "login.html";

        return null;
    }


    // Normaliza o tipo
    const tipo =
        String(user.tipo || "")
            .trim()
            .toLowerCase();


    // Busca a permissão
    const permissao =
        PERMISSOES[tipo];


    // Tipo inválido
    if (!permissao) {

        console.error(
            "Tipo de usuário inválido:",
            user.tipo
        );

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "usuario"
        );

        window.location.href =
            "login.html";

        return null;
    }


    // Descobre página atual
    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();


    // Verifica se pode acessar
    if (
        !permissao.paginas.includes(
            paginaAtual
        )
    ) {

        alert(
            "Você não tem permissão para acessar esta página."
        );

        window.location.href =
            "dashboard.html";

        return null;
    }


    return {
        user,
        tipo,
        permissao
    };
}


// ============================================
// MONTAR SIDEBAR DINÂMICA
// ============================================

function montarSidebar(tipo) {

    const permissao =
        PERMISSOES[tipo];


    if (!permissao) {
        return;
    }


    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();


    const itensPermitidos =
        MENU_ITENS.filter(
            item =>
                permissao.paginas.includes(
                    item.pagina
                )
        );


    const sidebarNav =
        document.querySelector(
            ".sidebar-nav"
        );


    if (!sidebarNav) {
        return;
    }


    sidebarNav.innerHTML = "";


    itensPermitidos.forEach(item => {

        const link =
            document.createElement("a");

        link.href =
            item.pagina;

        link.className =
            "nav-item";


        if (
            paginaAtual ===
            item.pagina
        ) {

            link.classList.add(
                "active"
            );

        }


        link.innerHTML = `
            <span class="nav-icon">
                ${item.icone}
            </span>

            <span>
                ${item.label}
            </span>
        `;


        sidebarNav.appendChild(link);

    });

}


// ============================================
// ATUALIZAR HEADER
// ============================================

function atualizarHeader(
    user,
    tipo
) {

    const permissao =
        PERMISSOES[tipo];


    if (!permissao) {
        return;
    }


    const nome =
        user.nome ||
        user.email?.split("@")[0] ||
        "Usuário";


    const primeiraLetra =
        nome
            .charAt(0)
            .toUpperCase();


    // Avatar
    const avatar =
        document.getElementById(
            "avatar"
        );

    if (avatar) {

        avatar.textContent =
            primeiraLetra;

    }


    // Nome
    const username =
        document.getElementById(
            "username"
        );

    if (username) {

        username.textContent =
            nome;

    }


    // Cargo
    const userrole =
        document.getElementById(
            "userrole"
        );

    if (userrole) {

        userrole.textContent =
            permissao.label;

    }


    // Saudação
    const greeting =
        document.getElementById(
            "greeting"
        );

    if (greeting) {

        greeting.textContent =
            `Bem-vindo, ${nome.split(" ")[0]}!`;

    }


    // Subtítulo
    const subtitle =
        document.getElementById(
            "subtitle"
        );

    if (subtitle) {

        subtitle.textContent =
            permissao.dashboardSubtitulo;

    }

}


// ============================================
// INICIALIZAR PERMISSÕES
// ============================================

function inicializarPermissoes() {

    const acesso =
        verificarAcesso();


    if (!acesso) {
        return null;
    }


    const {
        user,
        tipo,
        permissao
    } = acesso;


    montarSidebar(
        tipo
    );


    atualizarHeader(
        user,
        tipo
    );


    return {
        user,
        tipo,
        permissao
    };
}


// ============================================
// LOGOUT
// ============================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
        "login.html";
}


// ============================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        inicializarPermissoes();

    }
);