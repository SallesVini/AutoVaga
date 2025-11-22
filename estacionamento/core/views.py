from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils import timezone
from .models import Usuario, Endereco, Veiculo, Log


# ===== LISTAGENS EM JSON =====

@api_view(['GET'])
def usuarios_json(request):
    dados = list(Usuario.objects.values())
    return Response(dados)

@api_view(['GET'])
def enderecos_json(request):
    dados = list(Endereco.objects.values())
    return Response(dados)

@api_view(['GET'])
def veiculos_json(request):
    dados = list(Veiculo.objects.values())
    return Response(dados)

@api_view(['GET'])
def logs_json(request):
    # Pega todos os logs em forma de dicionário
    logs = list(Log.objects.values())
    return Response(logs)


# ===== LOGIN =====
@api_view(['POST'])
def login_usuario(request):
    email = request.data.get('email')
    senha = request.data.get('senha')

    if not email or not senha:
        return Response({"sucesso": False, "mensagem": "Campos obrigatórios não enviados."})

    try:
        usuario = Usuario.objects.get(email=email, senha=senha)

        # ===== CRIAR LOG DE SESSÃO =====
        Log.objects.create(usuario=usuario, login_hora=timezone.now(), ativo=True)

        return Response({
            "sucesso": True,
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "sobrenome": usuario.sobrenome,
                "email": usuario.email,
                "funcao": usuario.funcao
            }
        })

    except Usuario.DoesNotExist:
        return Response({
            "sucesso": False,
            "mensagem": "Email ou senha incorretos."
        })



# ===== CRIAR ENDEREÇO =====

@api_view(['POST'])
def criar_endereco(request):
    cep = request.data.get('cep')
    logradouro = request.data.get('logradouro')
    bairro_cidade = request.data.get('bairro_cidade')

    if not cep or not logradouro or not bairro_cidade:
        return Response({"sucesso": False, "mensagem": "Campos obrigatórios do endereço não enviados."})

    endereco = Endereco.objects.create(
        cep=cep,
        logradouro=logradouro,
        bairro_cidade=bairro_cidade
    )

    return Response({
        "sucesso": True,
        "id": endereco.id,
        "cep": endereco.cep,
        "logradouro": endereco.logradouro,
        "bairro_cidade": endereco.bairro_cidade
    })


# ===== CRIAR VEÍCULO =====
@api_view(['POST'])
def criar_veiculo(request):
    try:
        placa = request.data.get('placa')
        modelo = request.data.get('modelo')
        cor = request.data.get('cor')
        numero_vaga = request.data.get('numero_vaga')
        data_entrada = request.data.get('data_entrada')
        data_saida = request.data.get('data_saida')
        valor = request.data.get('valor') or 0
        tempo_estimado = request.data.get('tempo_estimado') or "00:00"
        responsavel = request.data.get('responsavel') or "Não informado"
        endereco_id = request.data.get('endereco')

        if not placa or not modelo or not cor or not numero_vaga or not data_entrada or not endereco_id:
            return Response({"sucesso": False, "mensagem": "Campos obrigatórios do veículo não enviados."})

        endereco = Endereco.objects.get(id=endereco_id)

        veiculo = Veiculo.objects.create(
            placa=placa,
            modelo=modelo,
            cor=cor,
            numero_vaga=int(numero_vaga),
            data_entrada=data_entrada,
            data_saida=data_saida,
            valor=float(valor),
            tempo_estimado=tempo_estimado,  # <-- corrigido
            endereco=endereco,
            responsavel=responsavel
        )

        return Response({
            "sucesso": True,
            "veiculo": {
                "id": veiculo.id,
                "placa": veiculo.placa,
                "modelo": veiculo.modelo,
                "cor": veiculo.cor,
                "numero_vaga": veiculo.numero_vaga,
                "data_entrada": veiculo.data_entrada,
                "data_saida": veiculo.data_saida,
                "valor": veiculo.valor,
                "tempo_estimado": veiculo.tempo_estimado,  # <-- corrigido
                "endereco": veiculo.endereco.id,
                "responsavel": veiculo.responsavel
            }
        })
    except Exception as e:
        print("ERRO CRIAR VEÍCULO:", e)
        return Response({"sucesso": False, "mensagem": str(e)})
