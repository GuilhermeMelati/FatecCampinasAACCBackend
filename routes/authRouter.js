// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DA ROTA
const {Router} = require('express')
const recuperarSenha = require('../utils/notificacoes/recuperarSenha')
const sanitize = require('mongo-sanitize')
const professorSchema = require('../models/professor')
const alunoSchema = require('../models/alunos')
const authRouter = Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
const privateKey = fs.readFileSync('./utils/keys/private.key', 'utf8')
const publicKey = fs.readFileSync('./utils/keys/public.key', 'utf8')
require('dotenv/config')

const generateProfessorToken = (professor) => {
  const acesso = professor.superUser ? 'adm' : 'professor'

  return jwt.sign(
    {
      id: professor._id,
      acesso,
      email: professor.email,
      nome: professor.nome,
    },
    privateKey,
    {
      expiresIn: 900,
      algorithm: 'RS256',
    }
  )
}

const generateStudentToken = (aluno) =>
  jwt.sign(
    {
      id: aluno._id,
      acesso: 'user',
      nome: aluno.nome,
      email: aluno.email,
      ra: aluno.RA,
    },
    privateKey,
    {
      expiresIn: 900,
      algorithm: 'RS256',
    }
  )

authRouter.post('/api/login', async (req, res) => {
  /* 
    #swagger.tags = ['Autenticação']
    #swagger.description = 'Autenticar um usuário'
  */

  const {login, senha} = sanitize(req.body)

  professorSchema.findOne({email: login}, (err, professor) => {
    if (err) {
      return res.status(500).send(err)
    }

    if (professor) {
      professor.validarSenha(senha, (err, ok) => {
        if (!ok || err) {
          return res.status(401).send()
        }

        return res.status(200).send({
          token: generateProfessorToken(professor),
        })
      })
      return
    }

    alunoSchema.findOne({RA: login}, (err, aluno) => {
      if (err) {
        return res.status(500).send(err)
      }

      if (!aluno) {
        return res.status(401).send()
      }

      aluno.validarSenha(senha, (err, ok) => {
        if (!ok || err) {
          return res.status(401).send()
        }

        return res.status(200).send({
          token: generateStudentToken(aluno),
        })
      })
    })
  })
})

authRouter.post('/api/logout', async (req, res) => {
  /* 
    #swagger.tags = ['Autenticação']
    #swagger.description = 'Deslogar um usuário'
    #swagger.security = [{
      "token": []
    }] 
  */

  res.json({auth: false, token: null, access: false})
})

authRouter.post('/api/recuperar-senha', async (req, res) => {
  /* 
    #swagger.tags = ['Autenticação']
    #swagger.description = 'Recuperar a senha de um usuário'
    #swagger.security = [{
      "token": []
    }] 
  */

  const RA = sanitize(req.body.RA)
  alunoSchema.findOne({RA: RA}, (err, aluno) => {
    if (!err) {
      if (aluno !== null) {
        const RA = aluno.RA
        const acesso = 'recuperar'
        const token = jwt.sign({RA, acesso}, privateKey, {
          expiresIn: 900,
          algorithm: 'RS256',
        })
        const link = `http://localhost:4010/api/recuper/senha/${token}/${aluno.RA}`
        recuperarSenha.enviarEmail(aluno.email, link, aluno.nome)
        return res
          .status(200)
          .send('Foi enviado no seu email o link para recuperar sua senha!')
      }
      return res.status(401).send('Nenhum aluno encontrado com esse RA!')
    } else {
      res.status(401).send(err)
    }
  })
})

authRouter.get('/api/recuperar-senha/:token/:ra', async (req, res) => {
  /* 
    #swagger.tags = ['Autenticação']
    #swagger.description = 'Recuperar a senha de um usuário'
    #swagger.security = [{
      "token": []
    }] 
  */

  const auth = verificarJWTRecuperar(req.params.token, req.params.ra)

  const RA = sanitize(req.params.ra)

  if (auth === true) {
    alunoSchema.findOne(
      {
        RA: RA,
      },
      (err, document) => {
        if (!err) {
          res.status(200).send(document)
        } else {
          res.status(401).send(err)
        }
      }
    )
  } else {
    res.status(401).send('Você não tem permissão.')
  }
})

// VER SE O TOKEN DE RECUPERAÇÃO DE SENHA É CORRETO
function verificarJWTRecuperar(token, RA) {
  if (!token) {
    return false
  }

  return jwt.verify(
    token,
    publicKey,
    {algorithm: ['RS256']},
    (err, decoded) => {
      if (err) {
        console.log
        return false
      } else {
        if (String(decoded.RA) === RA) {
          return true
        } else {
          return false
        }
      }
    }
  )
}

module.exports = authRouter
