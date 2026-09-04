// ============================================
// SISTEMA DE PERMISSÕES - CORRIGEAI
// ============================================
//
// PROFESSOR
// Dashboard, Provas e Resultados
//
// COORDENADOR
// Dashboard, Provas, Resultados e Relatórios
//
// DIRETOR
// Dashboard, Provas, Resultados e Relatórios
// ============================================


const PERMISSOES = {

    PROFESSOR: {
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


    COORDENADOR: {
        paginas: [
            "dashboard.html",
            "provas.html",
            "resultados.html",
            "relatorios.html"
        ],

        label: "Coordenador",

        dashboardTitulo: "Sua Coordenação",

        dashboardSubtitulo:
            "Visão geral do desempenho da sua coordenação"
    },


    DIRETOR: {
        paginas: [
            "dashboard.html",
            "provas.html",
            "resultados.html",
            "relatorios.html"
        ],

        label: "Diretor",

        dashboardTitulo: "Visão Geral da Escola",

        dashboardSubtitulo:
            "Acompanhe todas as turmas, provas e desempenho da escola"
    }

};


// ============================================
// PEGAR USUÁRIO LOGADO
// ============================================

function obterUsuario() {

    try {

        return JSON.parse(
            localStorage.getItem("usuario") || "{}"
        );

    } catch (error) {

        console.error(
            "Erro ao ler usuário:",
            error
        );

        return {};

    }
}


// ============================================
// VERIFICAR ACESSO
// ============================================

function verificarAcesso() {

    const usuario = obterUsuario();

    const token = localStorage.getItem("token");


    // Não está logado
    if (!token || !usuario.email) {

        window.location.href = "login.html";

        return null;
    }


    // Tipo do usuário
    const tipo = (
        usuario.tipo || "PROFESSOR"
    ).toUpperCase();


    // Permissão do tipo
    const permissao = PERMISSOES[tipo];


    // Tipo desconhecido
    if (!permissao) {

        console.error(
            "Tipo de usuário inválido:",
            tipo
        );

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "login.html";

        return null;
    }


    // Página atual
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
        usuario,
        tipo,
        permissao
    };
}


// ============================================
// MONTAR SIDEBAR
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


    const todosItens = [

        {
            pagina: "dashboard.html",
            icone: "📊",
            label: "Dashboard"
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


    const itensPermitidos =
        todosItens.filter(
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

        link.href = item.pagina;

        link.className = "nav-item";


        if (
            item.pagina === paginaAtual
        ) {

            link.classList.add("active");

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
// LOGOUT
// ============================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    window.location.href =
        "login.html";
}


// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const acesso =
            verificarAcesso();


        if (!acesso) {
            return;
        }


        montarSidebar(
            acesso.tipo
        );

    }
);