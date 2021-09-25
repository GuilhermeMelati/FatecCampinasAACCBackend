// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DO SERVIDOR
const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser') 
const fs = require('fs')
const mongoose = require('mongoose')
const AtividadeSchema = require('./models/atividade')
const AlunoSchema = require('./models/aluno')
const ProfessorSchema = require('./models/professor')
const recuperarSenha = require('./utils/messages/recoveryPass')
const bcrypt = require('bcryptjs')
const privateKey  = fs.readFileSync('./utils/keys/private.key', 'utf8')
const publicKey  = fs.readFileSync('./utils/keys/public.key', 'utf8')
require('dotenv/config')

// CONECTANDO O MONGO DB ATLAS (REMOTO)
mongoose.connect(process.env.MONGO_URI)

// DEFININDO OS SETS DO EXPRESS
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// ROTAS PARA USO DO PROFESSOR

// ROTA PARA OBTER TODAS AS ATIVIDADES
app.get('/api/obter/atividades/todas', verificarJWT, async(req, res, next) => {
  AtividadeSchema.find((err, document) => {
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// ROTA PARA OBTER ATIVIDADES PENDENTES
app.get('/api/obter/atividades/pendentes', verificarJWT, async(req, res, next) => {
  AtividadeSchema.find({ status: 'pendente' }, (err, document) => {
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// ROTA PARA OBTER ATIVIDADES CONFIRMADAS
app.get('/api/obter/atividades/confirmadas', verificarJWT, async(req, res, next) => {
  AtividadeSchema.find({ status: 'confirmada' }, (err, document) => {
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// ROTA PARA OBTER ATIVIDADES NEGADAS
app.get('/api/obter/atividades/negadas', verificarJWT, async(req, res, next) => {
  AtividadeSchema.find({ status: 'negada' }, (err, document) => {
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// ROTAS PARA USO DO ALUNO

// OBTER TODAS AS ATIVIDADES DO ALUNO COM BASE NO RA
app.get('/api/obter/atividades/todas/:RA', verificarJWT, async(req, res, next) => {
  const RA = req.params.RA
  AtividadeSchema.find({ RA: RA }, (err, document) => {
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// OBTER TODAS AS ATIVIDADES PENDENTES DO ALUNO COM BASE NO RA
app.get('/api/obter/atividades/pendentes/:RA', verificarJWT, async(req, res, next) => {
  const RA = req.params.RA
  AtividadeSchema.find(
    {
      RA: RA,
      status: 'pendente',
    },
    (err, document) => {
      if (!err) {
        res.send(document)
      } else {
        res.status('400').send(err)
      }
    }
  )
})

// OBTER TODAS AS ATIVIDADES CONFIRMADAS DO ALUNO COM BASE NO RA
app.get('/api/obter/atividades/confirmadas/:RA', verificarJWT, async(req, res, next) => {
  const RA = req.params.RA
  AtividadeSchema.find(
    {
      RA: RA,
      status: 'confirmada',
    },
    (err, document) => {
      if (!err) {
        res.send(document)
      } else {
        res.status('400').send(err)
      }
    }
  )
})

// OBTER TODAS AS ATIVIDADES NEGADAS DO ALUNO COM BASE NO RA
app.get('/api/obter/atividades/negadas/:RA', verificarJWT, async(req, res, next) => {
  const RA = req.params.RA
  AtividadeSchema.find(
    {
      RA: RA,
      status: 'negada',
    },
    (err, document) => {
      if (!err) {
        res.send(document)
      } else {
        res.status('400').send(err)
      }
    }
  )
})

// OBTER ATIVIDADE PELO ID
app.get('/api/obter/atividade/:ID', verificarJWT, async(req, res, next) => {
  AtividadeSchema.findById(
    req.params.ID,
    (err, document) => {
      if (!err) {
        res.status(200).send(document)
      } else {
        res.status(400).send(err)
      }
    }
  )
})

// INSERIR UMA NOVA ATIVIDADE
app.post('/api/inserir/atividade', verificarJWT, async(req, res, next) => {
  const newAtividade = new AtividadeSchema(req.body)

  newAtividade.save((err) => {
    if (!err) {
      res.status(200).send('OK')
    } else {
      res.status(400).send(err)
    }
  })
})

// ATUALIZAR OS DADOS DE UMA ATIVIDADE
app.patch('/api/atualizar/atividade', verificarJWT, async(req, res, next) => {
  AtividadeSchema.findByIdAndUpdate(
    req.body._id,
    {$set: req.body},
    (err) => {
      if (!err) {
        res.status(200).send('OK')
      } else {
        res.status(400).send(err)
      }
    }
  )
})

// DELETAR UMA ATIVIDADE COM BASE NO ID
app.delete('/api/deletar/atividade/:ID', verificarJWT, async(req, res, next) => {
  AtividadeSchema.findByIdAndRemove(
    req.params.ID,
    (err) => {
      if (!err) {
        res.status(200).send('OK')
      } else {
        res.status(400).send(err)
      }
    }
  )
})

// OBTER TODOS OS ALUNOS
app.get('/api/obter/todos/alunos', verificarJWT, async(req, res, next) => {
  AlunoSchema.find((err, document) => {
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// OBTER ALUNO COM BASE NO RA
app.get('/api/obter/aluno/:RA', async(req, res, next) => {
  AlunoSchema.findOne((err, document) => {
    { RA: req.params.RA }
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// INSERIR UM NOVO ALUNO
app.post('/api/inserir/aluno', async(req, res, next) => {
  const newAluno = new AlunoSchema(req.body)

  newAluno.save((err) => {
    if (!err) {
      res.status(200).send('OK')
    } else {
      res.status(400).send(err)
    }
  })
})

// ATUALIZAR DADOS DE UM ALUNO
app.patch('/api/atualizar/aluno', verificarJWT, async(req, res, next) => {
  if (req.body.hasOwnProperty('senha')) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR))
    req.body.senha = await bcrypt.hash(req.body.senha, salt)
  }

  AlunoSchema.updateOne(
    { RA: req.body.RA },
    {$set: req.body},
    (err) => {
      if (!err) {
        res.status(200).send('OK')
      } else {
        res.status(400).send(err)
      }
    }
  )
})

// DELETAR UM ALUNO
app.delete('/api/deletar/aluno/:RA', verificarJWT, async(req, res, next) => {
  AlunoSchema.deleteOne(
    { RA: req.params.RA },
    (err) => {
      if (!err) {
        res.status(200).send('OK')
      } else {
        res.status(400).send(err)
      }
    }
  )
})

// OBTER TODOS OS PROFESSORES
app.get('/api/obter/todos/professores', verificarJWT, async(req, res, next) => {
  ProfessorSchema.find((err, document) => {
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// INSERIR UM NOVO PROFESSOR
app.post('/api/inserir/professor', async(req, res, next) => {
  const newProfessor = new ProfessorSchema(req.body)

  newProfessor.save((err) => {
    if (!err) {
      res.status(200).send('OK')
    } else {
      res.status(400).send(err)
    }
  })
})

// ATUALIZAR DADOS DE UM PROFESSOR
app.patch('/api/atualizar/professor', async(req, res, next) => {
  if (req.body.hasOwnProperty('senha')) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR))
    req.body.senha = await bcrypt.hash(req.body.senha, salt)
  }

  ProfessorSchema.updateOne (
    { email: req.body.email },
    { $set: req.body },
    (err) => {
      if (!err) {
        res.status(200).send('OK')
      } else {
        res.status(400).send(err)
      }
    }
  )
})

// DELETAR UM PROFESSOR
app.delete('/api/deletar/aluno/:email', verificarJWT, async(req, res, next) => {
  ProfessorSchema.deleteOne(
    { email: req.params.email },
    (err) => {
      if (!err) {
        res.status(200).send('OK')
      } else {
        res.status(400).send(err)
      }
    }
  )
})

// AUTENTICAR UM USER
app.post('/api/login', async(req, res, next) => {
  ProfessorSchema.findOne({ email: req.body.login }, (err, professor) => {
    if (!err) {
      if (professor !== null) {
        var idProfessor = professor._id
        professor.validarSenha(req.body.senha, (err, ok) => {
          if(ok === true) {
            var token = jwt.sign({ idProfessor }, privateKey, { 
                expiresIn: 900,
                algorithm: 'RS256'
            })

            if (professor.superUser === true) {
              var acesso = 'adm'
            } else {
              var acesso = 'professor'
            }
            
            return res.status(200).send({ 
              auth: true, 
              token: token,
              acess: acesso
            }) 
          }
          return res.status(400).send('Login inválido!') 
        })
      } else {
        AlunoSchema.findOne({ RA: req.body.login }, (err, aluno) => {
          var idAluno = aluno._id
          if (!err) {
            if (aluno !== null) {
              aluno.validarSenha(req.body.senha, (err, ok) => {
                if(ok === true) {
                  var token = jwt.sign({ idAluno }, privateKey, { 
                      expiresIn: 900,
                      algorithm: 'RS256'
                  }) 
                
                  return res.status(200).send({ 
                    auth: true, 
                    token: token ,
                    acess: 'user'
                  }) 
                }
                return res.status(400).send('Login inválido!') 
              })
            }
          } else {
            res.status(400).send(err)
          }
        })}
    } else {
      res.status(400).send(err)
    }
  })
})

// DESLOGAR UM USER
app.post('/api/logout', async(req, res) => {
    res.json({ auth: false, token: null, acess: 'false' })
})

// RECUPERAR A SENHA DE UM USER
app.post('/api/recuperar/senha', async(req, res) => {
  const RA = req.body.RA
  AlunoSchema.findOne(
    { RA: RA }, 
    (err, aluno) => {
    if (!err) {
      if (aluno !== null) {
        const idAluno = aluno._id
        const token = jwt.sign({ idAluno }, process.env.SECRET_RECOVERYPASS, {
          expiresIn: 900,
        })
        const link = `http://localhost:4000/api/recuper/senha/${token}/${aluno.RA}`
        recuperarSenha.sendEmail(aluno.email, link, aluno.nome)
        return res.status(200).send('Foi enviado no seu email o link para recuperar sua senha!')
      }
      return res.status(400).send('Nenhum aluno encontrado com esse RA!')
    } else {
    res.status(400).send(err)
  }
  })
})

// RECUPERAR A SENHA DE UM USER
app.get('/api/recuper/senha/:token/:ra', verifyJWT, async(req, res, next) => {
  AlunoSchema.findOne((err, document) => {
    { RA: req.params.RA }
    if (!err) {
      res.send(document)
    } else {
      res.status('400').send(err)
    }
  })
})

// VER SE O TOKEN DE RECUPERAÇÃO É CORRETO
function verifyJWT(req, res, next){
  const token = req.params.token;
  if (!token) return res.status(401).json({ auth: false, message: 'Token não informado.' });
  
  jwt.verify(token, process.env.SECRET_RECOVERYPASS, (err, decoded) => {
    if (err) return res.status(500).json({ auth: false, message: 'Token inválido.' });
    next();
  });
}

// VER SE O USER ESTÁ LOGADO
async function verificarJWT(req, res, next){ 
  var token = req.headers['x-access-token'] 
  if (!token) 
      return res.status(400).send({ auth: false, message: 'Token não informado.' }) 
  
  jwt.verify(token, publicKey, {algorithm: ['RS256']}, (err, decoded) => { 
      if (err) 
          return res.status(500).send({ auth: false, message: 'Token inválido.' }) 
    
      next() 
  }) 
}

// DEFININDO A PORTA DO SERVIDOR (PADRÃO 4000)
const port = process.env.PORT || 4000

// ESCUTANDO A PORTA
const server = app.listen(port, () => {
  console.log('Rodando na porta ' + port)
})