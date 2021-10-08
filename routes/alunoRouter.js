const {Router} = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const atividadeSchema = require('../models/atividades')
const alunoSchema = require('../models/alunos')
const statusModificado = require('../utils/notificacoes/statusModificado')
const publicKey = process.env.PUBLIC_KEY
const sanitize = require('mongo-sanitize')
const alunoRouter = Router()
require('dotenv/config')

const verificarJWTAluno = async (req, res, next) => {
  var token = req.headers['x-access-token']
  if (!token) {
    return res.status(401).send({message: 'Token não informado.'})
  }

  jwt.verify(token, publicKey, {algorithm: ['RS256']}, (err, decoded) => {
    if (err) {
      return res.status(500).send({message: 'Token inválido.'})
    } else {
      if (
        decoded.acesso === 'user' ||
        decoded.acesso === 'professor' ||
        decoded.acesso === 'adm'
      ) {
        next()
      } else {
        return res.status(500).send({message: 'Você não tem permissão.'})
      }
    }
  })
}

alunoRouter.get(
  '/api/atividades/todas/:RA',
  verificarJWTAluno,
  async (req, res) => {
    /* 
    #swagger.tags = ['Aluno']
    #swagger.description = 'Obter todas as atividades do aluno com base no RA'
    #swagger.security = [{
      "token": []
    }] 
  */

    const RA = sanitize(req.params.RA)

    atividadeSchema.find({RA: RA}, (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades)
      } else {
        res.status(404).send(err)
      }
    })
  }
)

alunoRouter.get(
  '/api/atividades/pendentes/:RA',
  verificarJWTAluno,
  async (req, res) => {
    /* 
    #swagger.tags = ['Aluno']
    #swagger.description = 'Obter todas as atividades pendentes do aluno com base no RA'
    #swagger.security = [{
      "token": []
    }] 
  */

    const RA = sanitize(req.params.RA)
    atividadeSchema.find(
      {
        RA: RA,
        status: 'pendente',
      },
      (err, atividades) => {
        if (!err) {
          res.status(200).send(atividades)
        } else {
          res.status(404).send(err)
        }
      }
    )
  }
)

alunoRouter.get(
  '/api/atividades/confirmadas/:RA',
  verificarJWTAluno,
  async (req, res) => {
    /* 
    #swagger.tags = ['Aluno']
    #swagger.description = 'Obter todas as atividades confirmadas do aluno com base no RA'
    #swagger.security = [{
      "token": []
    }] 
  */

    const RA = sanitize(req.params.RA)
    atividadeSchema.find(
      {
        RA: RA,
        status: 'confirmada',
      },
      (err, atividades) => {
        if (!err) {
          res.status(200).send(atividades)
        } else {
          res.status(404).send(err)
        }
      }
    )
  }
)

alunoRouter.get(
  '/api/atividades/negadas/:RA',
  verificarJWTAluno,
  async (req, res) => {
    /* 
    #swagger.tags = ['Aluno']
    #swagger.description = 'Obter todas as atividades negadas do aluno com base no RA'
    #swagger.security = [{
      "token": []
    }] 
  */

    const RA = sanitize(req.params.RA)
    atividadeSchema.find(
      {
        RA: RA,
        status: 'negada',
      },
      (err, atividades) => {
        if (!err) {
          res.status(200).send(atividades)
        } else {
          res.status(404).send(err)
        }
      }
    )
  }
)

alunoRouter.get('/api/atividade/:ID', verificarJWTAluno, async (req, res) => {
  /* 
    #swagger.tags = ['Aluno']
    #swagger.description = 'Obter atividade pelo id'
    #swagger.security = [{
      "token": []
    }] 
  */

  const id = sanitize(req.params.ID)

  atividadeSchema.findById(id, (err, atividade) => {
    if (!err) {
      res.status(200).send(atividade)
    } else {
      res.status(404).send(err)
    }
  })
})

alunoRouter.post('/api/atividade', verificarJWTAluno, async (req, res) => {
  /* 
    #swagger.tags = ['Aluno']
    #swagger.description = 'Inserir uma nova atividade'
    #swagger.security = [{
      "token": []
    }]
    #swagger.parameters['atividade'] = {
      in: 'body',
      description: 'Dados da atividade',
      required: true,
      type: 'object',
    }
  */

  const newAtividade = new atividadeSchema(sanitize(req.body))

  newAtividade.save((err) => {
    if (!err) {
      res.status(200).send('Atividade inserida com sucesso!')
    } else {
      res.status(404).send(err)
    }
  })
})

alunoRouter.patch('/api/atividade', verificarJWTAluno, async (req, res) => {
  /* 
    #swagger.tags = ['Aluno']
    #swagger.description = 'Atualizar uma atividade'
    #swagger.security = [{
      "token": []
    }] 
  */

  const RA = sanitize(req.body.RA)

  alunoSchema.findOne({RA: RA}, (err, aluno) => {
    if (!err) {
      if (req.body.status) {
        statusModificado.enviarEmail(aluno.email, process.env.APPLICATION_URL, aluno.nome)
      }

      const id = sanitize(req.body._id)
      const body = sanitize(req.body)

      atividadeSchema.findByIdAndUpdate(id, {$set: body}, (err) => {
        if (!err) {
          res.status(200).send('Atividade atualizada com sucesso!')
        } else {
          res.status(404).send(err)
        }
      })
    } else {
      res.status(404).send(err)
    }
  })
})

alunoRouter.delete(
  '/api/atividade/:ID',
  verificarJWTAluno,
  async (req, res) => {
    /* 
    #swagger.tags = ['Aluno']
    #swagger.description = 'Deletar uma atividade pelo id'
    #swagger.security = [{
      "token": []
    }] 
  */

    const id = sanitize(req.params.ID)

    atividadeSchema.findByIdAndRemove(id, (err) => {
      if (!err) {
        res.status(200).send('Atividade deletada com sucesso!')
      } else {
        res.status(404).send(err)
      }
    })
  }
)

module.exports = alunoRouter
