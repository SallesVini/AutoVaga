# Sistema de Estacionamento - Backend Django

Este é o backend de um sistema de estacionamento feito em **Python Django**. 

⚠️ **Importante:** A pasta `venv` **não está incluída** no repositório, pois contém milhares de arquivos específicos da sua máquina. 

Cada pessoa que baixar o projeto deve criar seu próprio ambiente virtual. Para rodar o projeto, primeiro clone o repositório e entre na pasta do projeto usando 
`git clone <URL_DO_REPO>` e `cd <NOME_DO_PROJETO>`. 

Em seguida, crie um novo ambiente virtual com `python -m venv venv` 
e ative-o: no 

Windows use `venv\Scripts\activate`

Linux ou Mac use `source venv/bin/activate`. 


Com o ambiente virtual ativo, instale todas as dependências listadas no `requirements.txt` usando `pip install -r requirements.txt`. 


Depois, rode as migrações do Django para criar o banco de dados SQLite e todas as tabelas necessárias com `python manage.py makemigrations` e `python manage.py migrate`. 


Por fim, inicie o servidor Django com `python manage.py runserver`; o projeto estará disponível em `http://127.0.0.1:8000/`. 


Caso seja necessário resetar o banco de dados SQLite, basta deletar o arquivo `db.sqlite3` e rodar novamente `python manage.py migrate`. 

Esse processo garante que qualquer pessoa que baixar o projeto consiga rodá-lo corretamente em seu próprio ambiente virtual.
