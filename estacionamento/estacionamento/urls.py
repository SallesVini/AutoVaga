from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Rotas JSON (GET)
    path('usuarios/', views.usuarios_json),
    path('enderecos/', views.enderecos_json),
    path('veiculos/', views.veiculos_json),
    path('logs/', views.logs_json),  # <-- rota nova para pegar logs

    # Rotas POST
    path('enderecos/criar/', views.criar_endereco),
    path('veiculos/criar/', views.criar_veiculo),

    # Rota de login
    path('login/', views.login_usuario),
]
