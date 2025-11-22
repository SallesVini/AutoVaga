async function logar(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const msgSucess = document.getElementById('msgSucess');
    const msgError = document.getElementById('msgError');

    msgSucess.textContent = '';
    msgError.textContent = '';

    try {
        const resposta = await fetch("http://127.0.0.1:8000/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            msgSucess.textContent = "Usuário logado com sucesso!";

            sessionStorage.setItem('usuarioLogado', JSON.stringify(dados.usuario));

            setTimeout(() => {
                window.location.href = './pages/home.html';
            }, 1500);
        } else {
            msgError.textContent = dados.mensagem || "Erro no login!";
        }

    } catch (erro) {
        msgError.textContent = "Usuário ou senha incorretos! Tente novamente.";
        console.log(erro);
    }
}
