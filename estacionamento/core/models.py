from django.db import models
from django.utils import timezone

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    sobrenome = models.CharField(max_length=100)
    email = models.EmailField()
    funcao = models.CharField(max_length=50)
    senha = models.CharField(max_length=128)

    def __str__(self):
        return self.nome


class Endereco(models.Model):
    cep = models.CharField(max_length=20)
    logradouro = models.CharField(max_length=150)
    bairro_cidade = models.CharField(max_length=150)

    def __str__(self):
        return self.logradouro


class Veiculo(models.Model):
    placa = models.CharField(max_length=20)
    modelo = models.CharField(max_length=100)
    cor = models.CharField(max_length=50)
    data_entrada = models.DateTimeField()
    data_saida = models.DateTimeField(null=True, blank=True)
    numero_vaga = models.IntegerField(null=True, blank=True)
    endereco = models.ForeignKey(Endereco, on_delete=models.CASCADE)
    responsavel = models.CharField(max_length=100)

    # NOVOS CAMPOS
    valor = models.FloatField(default=0)             # valor a pagar
    tempo_estimado = models.CharField(max_length=10, default="00:00")  # tempo estimado

    def __str__(self):
        return self.placa


# =============================
# NOVA TABELA DE LOG DE SESSÃO
# =============================
class Log(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    login_hora = models.DateTimeField(default=timezone.now)
    logout_hora = models.DateTimeField(null=True, blank=True)
    ativo = models.BooleanField(default=True)  # indica se o usuário está logado

    def __str__(self):
        return f"{self.usuario.nome} - {'Ativo' if self.ativo else 'Inativo'}"
