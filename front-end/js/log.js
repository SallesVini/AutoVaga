async function mostrarNomeUsuario() {
    const spanUser = document.getElementById("user");

    try {
        // 1️⃣ Pega os logs ativos
        const logsResponse = await fetch("http://127.0.0.1:8000/logs/");
        const logs = await logsResponse.json();

        // Procura o log ativo
        const logAtivo = logs.find(log => log.ativo === true);

        if (!logAtivo) {
            spanUser.textContent = "Visitante"; // nenhum usuário logado
            return;
        }

        const usuarioId = logAtivo.usuario_id;

        // 2️⃣ Pega os dados do usuário pelo id
        const usuariosResponse = await fetch("http://127.0.0.1:8000/usuarios/");
        const usuarios = await usuariosResponse.json();

        const usuario = usuarios.find(u => u.id === usuarioId);

        if (usuario) {
            spanUser.textContent = usuario.nome; // coloca o nome no <strong>
              console.log(logAtivo.usuario_id);  
        } else {
            spanUser.textContent = "Visitante";
        }

    } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
        spanUser.textContent = "Visitante"; // fallback em caso de erro
    }
}

// Executa assim que a página carregar
document.addEventListener("DOMContentLoaded", mostrarNomeUsuario);
