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

function obterUsuarioLogado() {
    try {
        return JSON.parse(
            localStorage.getItem("usuario") || "null"
        );
    } catch (error) {
        console.error(
            "Erro ao ler usuário:",
            error
        );

        return null;
    }
}

function verificarAcesso() {
    const user =
        obterUsuarioLogado();

    const token =
        localStorage.getItem("token");

    if (!user || !token) {
        window.location.href =
            "login.html";

        return null;
    }

    const tipo =
        (user.tipo || "")
            .toLowerCase();

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();

    const permissao =
        PERMISSOES[tipo];

    if (!permissao) {
        logout();
        return null;
    }

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

    const navHTML =
        itensPermitidos
            .map(item => {

                const ativo =
                    paginaAtual === item.pagina
                        ? " active"
                        : "";

                return `
                    <a
                        href="${item.pagina}"
                        class="nav-item${ativo}"
                    >
                        <span class="nav-icon">
                            ${item.icone}
                        </span>

                        <span>
                            ${item.label}
                        </span>
                    </a>
                `;
            })
            .join("");

    const sidebarNav =
        document.querySelector(
            ".sidebar-nav"
        );

    if (sidebarNav) {
        sidebarNav.innerHTML =
            navHTML;
    }
}

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

    const avatar =
        document.getElementById(
            "avatar"
        );

    if (avatar) {
        avatar.textContent =
            nome.charAt(0).toUpperCase();
    }

    const username =
        document.getElementById(
            "username"
        );

    if (username) {
        username.textContent =
            nome;
    }

    const userrole =
        document.getElementById(
            "userrole"
        );

    if (userrole) {
        userrole.textContent =
            permissao.label;
    }

    const greeting =
        document.getElementById(
            "greeting"
        );

    if (greeting) {
        greeting.textContent =
            `Bem-vindo, ${nome.split(" ")[0]}!`;
    }

    const subtitle =
        document.getElementById(
            "subtitle"
        );

    if (subtitle) {
        subtitle.textContent =
            permissao.dashboardSubtitulo;
    }
}

function inicializarPermissoes() {
    const acesso =
        verificarAcesso();

    if (!acesso) {
        return null;
    }

    const {
        user,
        tipo
    } = acesso;

    montarSidebar(tipo);

    atualizarHeader(
        user,
        tipo
    );

    return acesso;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href =
        "login.html";
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        inicializarPermissoes();
    }
);