const {Router} = require('express')
const recuperarSenha = require('../utils/notificacoes/recuperarSenha')
const sanitize = require('mongo-sanitize')
const professorSchema = require('../models/professor')
const bcrypt = require('bcryptjs')
const alunoSchema = require('../models/alunos')
const authRouter = Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
const privateKey = process.env.PRIVATE_KEY
const publicKey = process.env.PUBLIC_KEY
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

const verificarJWTRecuperaSenha = async (req, res, next) => {
  var token = req.headers['x-access-token']
  if (!token) {
    return res.status(401).send({message: 'Token não informado.'})
  }

  jwt.verify(token, publicKey, {algorithm: ['RS256']}, (err, decoded) => {
    if (err) {
      return res.status(401).send({message: 'Token inválido.'})
    } else {
      if (decoded.acesso === 'recuperar' && decoded.RA === req.body.RA) {
        next()
      } else {
        return res.status(401).send({message: 'Você não tem permissão.'})
      }
    }
  })
}

authRouter.post('/api/login', async (req, res) => {
  /* 
    #swagger.tags = ['Autenticação']
    #swagger.description = 'Autenticar um usuário'
    #swagger.parameters['login'] = {
      in: 'body',
      description: 'Dados do login',
      required: true,
      type: 'object',
      schema: {
        $login: '',
        $senha: '',
      }
    }
  */

  const {login, senha} = sanitize(req.body)

  professorSchema.findOne({email: login}, (err, professor) => {
    if (err) {
      return res.status(404).send(err)
    }

    if (professor) {
      professor.validarSenha(senha, (err, ok) => {
        if (!ok || err) {
          return res.status(404).send(err)
        }

        return res.status(200).send({
          token: generateProfessorToken(professor),
        })
      })
      return
    }

    alunoSchema.findOne({RA: login}, (err, aluno) => {
      if (err) {
        return res.status(404).send(err)
      }

      if (!aluno) {
        return res.status(404).send(err)
      }

      aluno.validarSenha(senha, (err, ok) => {
        if (!ok || err) {
          return res.status(404).send(err)
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
        console.log(token)
        const link = `${process.env.APPLICATION_URL}/recovery-password?token=${token}&ra=${aluno.RA}`
        recuperarSenha.enviarEmail(aluno.email, link, aluno.nome)
        return res
          .status(200)
          .send('Foi enviado no seu email o link para recuperar sua senha!')
      }
      return res.status(401).send('Nenhum aluno encontrado com esse RA!')
    } else {
      res.status(404).send(err)
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

  const auth = verificarJWTEmail(req.params.token, req.params.ra)

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
          res.status(404).send(err)
        }
      }
    )
  } else {
    res.status(401).send('Você não tem permissão.')
  }
})

authRouter.patch(
  '/api/recuperar-senha',
  verificarJWTRecuperaSenha,
  async (req, res, next) => {
    /* 
    #swagger.tags = ['Autenticação']
    #swagger.description = 'Altera a senha de um usuário'
    #swagger.security = [{
      "token": []
    }] 
  */
    console.log(req.body.senha)

    if (req.body.hasOwnProperty('senha')) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR))
      const senha = await bcrypt.hash(req.body.senha, salt)

      const RA = sanitize(req.body.RA)
      alunoSchema.updateOne(
        {
          RA: RA,
        },
        {
          senha: senha,
        },
        (err) => {
          if (!err) {
            res.status(200).send('Senha alterada com sucesso!')
          } else {
            res.status(404).send(err)
          }
        }
      )
    } else {
      res.status(401).send('Insira uma nova senha!')
    }
  }
)

// VER SE O TOKEN DE RECUPERAÇÃO DE SENHA É CORRETO
function verificarJWTEmail(token, RA) {
  if (!token) {
    return false
  }

  return jwt.verify(
    token,
    publicKey,
    {algorithm: ['RS256']},
    (err, decoded) => {
      if (err) {
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
