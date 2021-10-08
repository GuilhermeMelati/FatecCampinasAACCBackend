const swaggerAutogen = require('swagger-autogen')({language: 'pt-BR'})

const outputFile = './swagger.json'
const endpointsFiles = [
  './routes/admRouter.js',
  './routes/alunoRouter.js',
  './routes/authRouter.js',
  './routes/professorRouter.js',
]

const doc = {
  info: {
    version: '1.0.0',
    title: 'AACC API',
    description:
      'Documentação das rotas da API do sistema de AACC da Fatec Campinas',
  },
  host: 'fatec-campinas-aacc.herokuapp.com',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    token: {
      type: 'apiKey',
      in: 'header',
      name: 'x-access-token',
      description: 'Token de acesso do usuário',
    },
  },
  tags: [
    {
      name: 'Autenticação',
    },
    {
      name: 'Administrador',
    },
    {
      name: 'Aluno',
    },
    {
      name: 'Professor',
    },
  ],
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app.js')
})
