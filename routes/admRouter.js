const {Router} = require('express')
const professorSchema = require('../models/professor')
const bcrypt = require('bcryptjs')
const admRouter = Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
const sanitize = require('mongo-sanitize');
const publicKey = fs.readFileSync('./utils/keys/public.key', 'utf8')
require('dotenv/config')

const verificarJWTADM = async (req, res, next) => {
  var token = req.headers['x-access-token']
  if (!token) {
    return res.status(401).send({message: 'Token não informado.'})
  }

  jwt.verify(token, publicKey, {algorithm: ['RS256']}, (err, decoded) => {
    if (err) {
      return res.status(500).send({message: 'Token inválido.'})
    } else {
      if (decoded.acesso === 'adm') {
        next()
      } else {
        return res.status(500).send({message: 'Você não tem permissão.'})
      }
    }
  })
}

admRouter.get(
  '/api/professor/todos',
  verificarJWTADM,
  async (req, res, next) => {
    /* 
    #swagger.tags = ['Administrador']
    #swagger.description = 'Obter todos os professores'
    #swagger.security = [{
      "token": []
    }] 
  */

    professorSchema.find((err, professores) => {
      if (!err) {
        res.status(200).send(professores)
      } else {
        res.status(401).send(err)
      }
    })
  }
)

admRouter.get(
  '/api/professor/:email',
  verificarJWTADM,
  async (req, res, next) => {
    /* 
    #swagger.tags = ['Administrador']
    #swagger.description = 'Obter professor por email'
    #swagger.security = [{
      "token": []
    }] 
  */

    const email = sanitize(req.params.email)

    professorSchema.findOne((err, professor) => {
      {
        email: email
      }
      if (!err) {
        res.status(200).send(professor)
      } else {
        res.status(401).send(err)
      }
    })
  }
)

admRouter.post('/api/professor', async (req, res, next) => {
  /* 
    #swagger.tags = ['Administrador']
    #swagger.description = 'Inserir novo professor'
    #swagger.security = [{
      "token": []
    }] 
    #swagger.parameters['professor'] = {
      in: 'body',
      description: 'Dados do professor',
      required: true,
      type: 'object',
    }
  */

  const newProfessor = new professorSchema(sanitize(req.body))

  newProfessor.save((err) => {
    if (!err) {
      res.status(200).send('Professor(a) inserido com sucesso!')
    } else {
      res.status(401).send(err)
    }
  })
})

admRouter.patch('/api/professor', verificarJWTADM, async (req, res, next) => {
  /* 
    #swagger.tags = ['Administrador']
    #swagger.description = 'Atualizar professor'
    #swagger.security = [{
      "token": []
    }]
    #swagger.parameters['professor'] = {
      in: 'body',
      description: 'Dados do professor',
      required: true,
      type: 'object',
    }
  */

  if (req.body.hasOwnProperty('senha')) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR))
    req.body.senha = await bcrypt.hash(req.body.senha, salt)
  }

  const email = req.body.email

  professorSchema.updateOne({email: email}, {$set: req.body}, (err) => {
    if (!err) {
      res.status(200).send('Professor(a) atualizado com sucesso!')
    } else {
      res.status(401).send(err)
    }
  })
})

admRouter.delete(
  '/api/professor/:email',
  verificarJWTADM,
  async (req, res, next) => {
    /* 
    #swagger.tags = ['Administrador']
    #swagger.description = 'Deletar professor por email'
    #swagger.security = [{
      "token": []
    }]
  */

    professorSchema.deleteOne({email: req.params.email}, (err) => {
      if (!err) {
        res.status(200).send('Professor(a) apagado com sucesso!')
      } else {
        res.status(401).send(err)
      }
    })
  }
)

module.exports = admRouter
