const {Router} = require('express')
const professorRouter = Router()
const atividadesSchema = require('../models/atividades')
const alunoSchema = require('../models/alunos')
const sanitize = require('mongo-sanitize')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const excelToJson = require('convert-excel-to-json')
const publicKey = process.env.PUBLIC_KEY
require('dotenv/config')

const verificarJWTProfessor = async (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) {
    return res.status(401).send({message: 'Token não informado.'})
  }

  jwt.verify(token, publicKey, {algorithm: ['RS256']}, (err, decoded) => {
    if (err) {
      return res.status(500).send({message: 'Token inválido.'})
    } else {
      if (decoded.acesso === 'adm' || decoded.acesso === 'professor') {
        next()
      } else {
        return res.status(500).send({message: 'Você não tem permissão.'})
      }
    }
  })
}

const tratarXLSX = (file) => {
  const alunos = excelToJson({
    source: fs.readFileSync(`${__dirname}/uploads/alunos/${file}`),
    header: {
      rows: 1,
    },
    sheets: ['Alunos'],
    columnToKey: {
      A: 'nome',
      B: 'RA',
      C: 'senha',
      D: 'email',
      E: 'horasAprovadas',
      F: 'horasPendentes',
      G: 'periodo',
      H: 'curso',
    },
  })
  return alunos.alunos
}

const destino = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/alunos')
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  },
})

const upload = multer({
  storage: destino,
})

professorRouter.post(
  '/api/uploadexcel',
  verificarJWTProfessor,
  upload.single('file'),
  (req, res) => {
    /* 
    #swagger.tags = ['Professor']
    #swagger.description = 'Faz upload do excel com dados dos alunos'
    #swagger.security = [{
      "token": []
    }] 
  */

    const arquivo = sanitize(req.file.originalname)
    const alunos = tratarXLSX(arquivo)

    res.send(
      alunos.map((demanda) => {
        const newAluno = new alunoSchema(demanda)

        newAluno.save((err) => {
          if (!err) {
            res.status(200).send('Aluno(a) inserido com sucesso!')
          } else {
            res.status(401).send(err)
          }
        })
      })
    )
  }
)

professorRouter.get(
  '/api/obter/atividades/todas',
  verificarJWTProfessor,
  async (req, res, next) => {
    /* 
      #swagger.tags = ['Professor']
      #swagger.description = 'Obter todas as atividades'
      #swagger.security = [{
        "token": []
      }] 
    */

    atividadesSchema.find((err, atividades) => {
      if (!err) {
        res.status(200).send(atividades)
      } else {
        res.status(401).send(err)
      }
    })
  }
)

professorRouter.get(
  '/api/obter/atividades/pendentes',
  verificarJWTProfessor,
  async (req, res, next) => {
    /* 
      #swagger.tags = ['Professor']
      #swagger.description = 'Obter todas as atividades pendentes'
      #swagger.security = [{
        "token": []
      }] 
    */

    atividadesSchema.find({status: 'pendente'}, (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades)
      } else {
        res.status(401).send(err)
      }
    })
  }
)

professorRouter.get(
  '/api/obter/atividades/confirmadas',
  verificarJWTProfessor,
  async (req, res, next) => {
    /* 
      #swagger.tags = ['Professor']
      #swagger.description = 'Obter todas as atividades confirmadas'
      #swagger.security = [{
        "token": []
      }] 
    */

    atividadesSchema.find({status: 'confirmada'}, (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades)
      } else {
        res.status(401).send(err)
      }
    })
  }
)

professorRouter.get(
  '/api/obter/atividades/negadas',
  verificarJWTProfessor,
  async (req, res, next) => {
    /* 
      #swagger.tags = ['Professor']
      #swagger.description = 'Obter todas as atividades negadas'
      #swagger.security = [{
        "token": []
      }] 
    */

    atividadesSchema.find({status: 'negada'}, (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades)
      } else {
        res.status(401).send(err)
      }
    })
  }
)

professorRouter.get(
  '/api/aluno/todos',
  verificarJWTProfessor,
  async (req, res, next) => {
    /* 
      #swagger.tags = ['Professor']
      #swagger.description = 'Obter todos os alunos'
      #swagger.security = [{
        "token": []
      }] 
    */

    alunoSchema.find((err, alunos) => {
      if (!err) {
        res.status(200).send(alunos)
      } else {
        res.status(401).send(err)
      }
    })
  }
)

professorRouter.get(
  '/api/aluno/:RA',
  verificarJWTProfessor,
  async (req, res, next) => {
    /* 
      #swagger.tags = ['Professor']
      #swagger.description = 'Obter aluno pelo RA'
      #swagger.security = [{
        "token": []
      }] 
    */

    const RA = sanitize(req.params.RA)

    alunoSchema.findOne((err, aluno) => {
      {
        RA: RA
      }
      if (!err) {
        res.status(200).send(aluno)
      } else {
        res.status(401).send(err)
      }
    })
  }
)

professorRouter.post('/api/aluno', verificarJWTProfessor, async (req, res) => {
  /*
    #swagger.tags = ['Professor']
    #swagger.description = 'Inserir um novo aluno'
    #swagger.security = [{
      "token": []
    }] 
    #swagger.parameters['aluno'] = {
      in: 'body',
      description: 'Dados do aluno',
      required: true,
      type: 'object',
    }
  */
  const newAluno = new alunoSchema(sanitize(req.body))

  newAluno.save((err) => {
    if (!err) {
      res.status(200).send('Aluno(a) inserido com sucesso!')
    } else {
      res.status(401).send(err)
    }
  })
})

professorRouter.patch(
  '/api/aluno',
  verificarJWTProfessor,
  async (req, res, next) => {
    /* 
      #swagger.tags = ['Professor']
      #swagger.description = 'Atualizar dados de um aluno'
      #swagger.security = [{
        "token": []
      }] 
    */

    if (req.body.hasOwnProperty('senha')) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR))
      req.body.senha = await bcrypt.hash(req.body.senha, salt)
    }

    const RA = sanitize(req.body.RA)
    const body = sanitize(req.body)

    alunoSchema.updateOne({RA: RA}, {$set: body}, (err) => {
      if (!err) {
        res.status(200).send('Aluno(a) atualizado com sucesso!')
      } else {
        res.status(401).send(err)
      }
    })
  }
)

professorRouter.delete(
  '/api/aluno/:RA',
  verificarJWTProfessor,
  async (req, res, next) => {
    /* 
      #swagger.tags = ['Professor']
      #swagger.description = 'Deletar um aluno pelo RA'
      #swagger.security = [{
        "token": []
      }] 
    */

    const RA = sanitize(req.params.RA)

    alunoSchema.deleteOne({RA: RA}, (err) => {
      if (!err) {
        res.status(200).send('Aluno(a) apagado com sucesso!')
      } else {
        res.status(401).send(err)
      }
    })
  }
)

module.exports = professorRouter
