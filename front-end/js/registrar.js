function cadastrar() {
  console.log('Função cadastrar chamada'); // Para garantir que a função é executada

  const nome = document.getElementById('nome');
  const email = document.getElementById('usuario');
  const cpf = document.getElementById('cpf');
  const senha = document.getElementById('senha');
  const confirmSenha = document.getElementById('confirmSenha');

  const msgSucess = document.getElementById('msgSucess');
  const msgError = document.getElementById('msgError');

  // Limpa mensagens anteriores e garante que elas estão visíveis
  msgSucess.innerText = '';
  msgError.innerText = '';
  msgSucess.style.display = 'block';
  msgError.style.display = 'block';

  // Reseta bordas
  [nome, email, cpf, senha, confirmSenha].forEach(field => {
    field.style.border = '1px solid #ced4da';
  });

  let erro = false;

  // Validação básica dos campos
  if (!nome.value.trim()) {
    nome.style.border = '2px solid red';
    erro = true;
  }
  if (!email.value.trim()) {
    email.style.border = '2px solid red';
    erro = true;
  }
  if (!cpf.value.trim()) {
    cpf.style.border = '2px solid red';
    erro = true;
  }
  if (!senha.value) {
    senha.style.border = '2px solid red';
    erro = true;
  }
  if (!confirmSenha.value) {
    confirmSenha.style.border = '2px solid red';
    erro = true;
  }

  if (erro) {
    msgError.innerText = 'Por favor, preencha todos os campos corretamente.';
    setTimeout(() => {
        location.reload();
    }, 1000);
    return;
  }

  // Validação de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    email.style.border = '2px solid red';
    msgError.innerText = 'E-mail inválido.';
    return;
  }

  // Validação de CPF (apenas números, 11 dígitos)
  const cpfRegex = /^\d{11}$/;
  if (!cpfRegex.test(cpf.value)) {
    cpf.style.border = '2px solid red';
    msgError.innerText = 'CPF inválido. Insira 11 dígitos numéricos.';
    return;
  }

  // Validação de senha e confirmação
  if (senha.value !== confirmSenha.value) {
    senha.style.border = '2px solid red';
    confirmSenha.style.border = '2px solid red';
    msgError.innerText = 'As senhas não conferem.';
    return;
  }

  // Pega os usuários cadastrados do localStorage
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  // Verifica se já existe usuário com mesmo email ou CPF
  const existe = usuarios.some(user => user.email === email.value.trim() || user.cpf === cpf.value.trim());
  if (existe) {
    msgError.innerText = 'Usuário ou CPF já cadastrado.';
    return;
  }

  // Exibe mensagem temporária
  msgSucess.innerText = 'Cadastrando usuário...';
  msgError.innerText = '';

  setTimeout(() => {
    const novoUsuario = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      cpf: cpf.value.trim(),
      senha: senha.value
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    msgSucess.innerText = 'Cadastro realizado com sucesso!';
    msgError.innerText = '';

    // Limpa campos e reseta bordas
    [nome, email, cpf, senha, confirmSenha].forEach(field => {
      field.value = '';
      field.style.border = '1px solid #ced4da';
    });
  }, 1000);
}
