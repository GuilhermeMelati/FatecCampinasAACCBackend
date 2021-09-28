
![Logo](https://brasilcampinas.com.br/wp-content/uploads/2019/04/Fachada-1.jpg)

    
# Sistema AACC - Backend | Fatec Campinas 👨‍💻

Sistema para cadastro de atividades extra curriculares da Fatec Campinas!

## Autores

- [Guilherme Melati](https://github.com/GuilhermeMelati)
- [Pedro Neri](https://github.com/pedrogneri)
- [Ricardo Vaz](https://www.github.com/octokatherine)
- [Gustavo Henrique](https://github.com/gustavohrqz)
- [George Maurício](https://github.com/gmsl23)
- [Felipe Sacoli](https://github.com/FeSacoli)

  
## Stacks Usadas

**Server:** Express, Node.JS, Nodemon, Nodemailer

**Autenticação:** Bcrypt, JWT

**Banco de Dados:** MongoDB, Mongoose

  
## Features

- [x] Mongo Atlas - Mais performance na resposta.
- [x] Autenticação RSA - Mais segurança na Autenticação das rotas.
- [x] Token com JWT - Mais segurança com tokens finitos.
- [x] Nodemailer para envio de emails - Mais performático.
  
## Instalação

Você deve primeiramente criar um cluster no Mongo DB Atlas, após isso insira as infos de URI e demais no arquivo .env!

```bash
  npm install
  node app
```
    
## API

#### Rotas Autenticação

```http
  POST /api/login
```

| Description                |
| :------------------------- |
| Loga o user retornando as informações de auth, token e tipo de user. |

```http
  POST /api/logout
```

| Description                |
| :------------------------- |
| Logout do user |

```http
  POST /api/recuperar/senha
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `object` | **Obrigatório**. Dados do aluno que se deseja enviar o email afim de recuperar a senha. |

```http
  POST /api/recuper/senha/:token/:ra
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Obrigatório**. Token para recuperação de senha no params da req. |
| `body` | `object` | **Obrigatório**. RA do aluno que se deseja trocar a senha. |

#### Rotas Atividades

```http
  GET /api/atividades/todas
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/atividades/pendentes
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/atividades/confirmadas
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/atividades/negadas
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/atividades/todas/:RA
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `RA` | `number` | **Obrigatório**. RA do aluno que se deseja obter atividades |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/atividades/pendentes/:RA
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `RA` | `number` | **Obrigatório**. RA do aluno que se deseja obter atividades |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/atividades/confirmadas/:RA
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `RA` | `number` | **Obrigatório**. RA do aluno que se deseja obter atividades. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/atividades/negadas/:RA
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `RA` | `number` | **Obrigatório**. RA do aluno que se deseja obter atividades. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/atividade/:ID
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ID` | `string` | **Obrigatório**. ID da respectiva atividade. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  POST /api/atividade
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `object` | **Obrigatório**. Dados da atividade que se deseja inserir. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  PATCH /api/atividade
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `object` | **Obrigatório**. Dados da atividade que se deseja atualizar. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  DELETE /api/atividade/:ID
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ID` | `string` | **Obrigatório**. ID da atividade que se deseja deletar. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  DELETE /api/atividade/:ID
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ID` | `string` | **Obrigatório**. ID da atividade que se deseja deletar. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

#### Rotas Alunos

```http
  GET /api/alunos/todos
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/aluno/:RA
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `RA` | `number` | **Obrigatório**. RA do aluno que se deseja obter informações. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  POST /api/aluno
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `object` | **Obrigatório**. Dados do aluno(a) que se deseja inserir. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  POST /api/uploadexcel
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `object` | **Obrigatório**. req.file.originalname. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |


```http
  PATCH /api/aluno
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `object` | **Obrigatório**. Dados do aluno(a) que se deseja atualizar. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  DELETE /api/aluno/:RA
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `RA` | `number` | **Obrigatório**. RA do aluno(a) que se deseja excluir. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

#### Rotas Professores

```http
  GET /api/professor/todos
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  GET /api/professor/:email
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Obrigatório**. Email do professor que se deseja obter informações. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  POST /api/professor
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `object` | **Obrigatório**. Dados do professor(a) que se deseja inserir. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  PATCH /api/professor
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `object` | **Obrigatório**. Dados do professor(a) que se deseja atualizar. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |

```http
  DELETE /api/professor/:email
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Obrigatório**. Email do professor(a) que se deseja excluir. |
| `token` | `string` | **Obrigatório**. req.headers['x-access-token'], token deve estar no header da requisição. |


## Suporte

Caso você precise de ajuda com as rotas da API envie um email para gtmelati@gmail.com

  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  