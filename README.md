<b>PROGRAMA STARTER FULL STACK WEB - GROWDEV</b>

<b>Módulo: QUALIDADE DE SOFTWARE</b>

<b>Atividade final do módulo</b>

<b>GROWTWITTER API QA</b>

<hr>

Este projeto consiste em uma aplicação desenvolvida, que simula comandos básicos do Twitter:

##### CADASTRO DE USUÁRIOS

##### CRIAÇÃO DE TWEET'S

##### LIKES

##### REPLIES

##### FOLLOWERS

##### FEED

##### AUTENTICAÇÃO DE USUÁRIOS COM JWT (JSON Web Token)

##### DOCUMENTAÇÃO (SWAGGER)

##### TESTES UNITÁRIOS E DE API

<hr>

Requisitos / Features:

1. instalar o Prisma no projeto para modelar e criar as tabelas da aplicação, com os seguintes requisitos:

- Cadastro de usuários;
- Cadastro de tweets por usuários;
- Likes em tweets.
- Autenticação de usuários.;

2. Requisitos do Bando de Dados:

- Configurar o Prisma ORM.
- Conectar a um banco de dados PostgreSQL.
  • Criar no BD todas as tabelas necessárias para armazenar os dados, usando os models do Prisma.

3. Requisitos API:

- Criar uma API usando o Express para o projeto.
- Fazer o CRUD para as seguintes funcionalidades:
  • Usuários
  • Tweets
  • Likes
- Implementar rota para login de usuários.
- A autenticação deve ser feita com username/email e senha.
- As seguintes funcionalidades só poderão ser executadas mediante login:
  • Tweets
  • Likes

4. Regras para Tweets:

- Devem ter id único.
- Possui um tipo (Tweet ou Reply).
- Devem ser de apenas 1 usuário.
- Podem conter likes e replies.

5. Regras para a feature Like:

- Um usuário poderá curtir (like) um Tweet específico.
- Um tweet pode ter zero ou vários likes.
- Um usuário não pode curtir mais de uma vez o mesmo tweet.

6. Regras para a feature Reply:

- Um usuário poderá criar um tweet que é uma resposta a outro tweet, de qualquer usuário
- Um tweet pode ter zero ou vários replys.
- ao listar os tweets, exibir junto os seus replys.

7. Regras para a feature Followers:

- Um usuário pode seguir outros usuários
- Um usuário pode ter zero ou vários seguidores

8. Regras para a feature Feed:

- o feed consiste em exibir a lista de tweets do usuário e dos usuários que ele segue

9. Regras para a feature testes:

- usar mocks para testes unitários
- fazer validações de pelo menos 5 asserts diferentes
- alcançar pelo menos 85% de cobertura de código

<hr>

### Tecnologias

- Nodejs
- TypeScript
- BD (Postgres)
- Primas (ORM)
- Jest

<hr>

<b>Instalação</b>

1 - Clone este repositório: https://github.com/Ligueja/growtwitter_api_qa.git

2 - Execute npm install para instalar as dependências.

<hr>

<b>Execução:</b>
Execute npm run dev para iniciar o servidor.
