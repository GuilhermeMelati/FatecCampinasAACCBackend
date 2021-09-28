// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DA ROTA
const { Router } = require("express");
const professorRouter = Router();
const atividadesSchema = require("../models/atividades");
const alunoSchema = require("../models/alunos");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const multer = require('multer')
const excelToJson = require('convert-excel-to-json')
const publicKey = fs.readFileSync("./utils/keys/public.key", "utf8");
require("dotenv/config");

function tratarXLSX(file){
  const alunos = excelToJson({
      source: fs.readFileSync(`./uploads/alunos/${file}`),
      header:{
        rows: 1
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
        H: 'curso'
      }
  })
  return alunos.alunos
}

// ROTAS PARA USO DO PROFESSOR

const destino = multer.diskStorage({
  destination: (req, file, callback) => {
      callback(null, './uploads/alunos')
  },
  filename: (req, file, callback) => {
      callback(null, file.originalname)
  }
})

const upload = multer({
  storage: destino
})

professorRouter.post('/api/uploadexcel', verificarJWTProfessor, upload.single('file'), (req, res) => {
  const alunos = tratarXLSX(req.file.originalname)

  res.send(alunos.map((demanda) => {
    const newAluno = new alunoSchema(demanda);

    newAluno.save((err) => {
      if (!err) {
        res.status(200).send("Aluno(a) inserido com sucesso!");
      } else {
        res.status(401).send(err);
      }
    });
  }))
})

// ROTA PARA OBTER TODAS AS ATIVIDADES
professorRouter.get(
  "/api/obter/atividades/todas",
  verificarJWTProfessor,
  async (req, res, next) => {
    atividadesSchema.find((err, atividades) => {
      if (!err) {
        res.status(200).send(atividades);
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// ROTA PARA OBTER ATIVIDADES PENDENTES
professorRouter.get(
  "/api/obter/atividades/pendentes",
  verificarJWTProfessor,
  async (req, res, next) => {
    atividadesSchema.find({ status: "pendente" }, (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades);
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// ROTA PARA OBTER ATIVIDADES CONFIRMADAS
professorRouter.get(
  "/api/obter/atividades/confirmadas",
  verificarJWTProfessor,
  async (req, res, next) => {
    atividadesSchema.find({ status: "confirmada" }, (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades);
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// ROTA PARA OBTER ATIVIDADES NEGADAS
professorRouter.get(
  "/api/obter/atividades/negadas",
  verificarJWTProfessor,
  async (req, res, next) => {
    atividadesSchema.find({ status: "negada" }, (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades);
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// OBTER TODOS OS ALUNOS
professorRouter.get(
  "/api/aluno/todos",
  verificarJWTProfessor,
  async (req, res, next) => {
    alunoSchema.find((err, alunos) => {
      if (!err) {
        res.status(200).send(alunos);
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// OBTER ALUNO COM BASE NO RA
professorRouter.get(
  "/api/aluno/:RA",
  verificarJWTProfessor,
  async (req, res, next) => {
    alunoSchema.findOne((err, aluno) => {
      {
        RA: req.params.RA;
      }
      if (!err) {
        res.status(200).send(aluno);
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// INSERIR UM NOVO ALUNO
professorRouter.post(
  "/api/aluno",

  async (req, res, next) => {
    const newAluno = new alunoSchema(req.body);

    newAluno.save((err) => {
      if (!err) {
        res.status(200).send("Aluno(a) inserido com sucesso!");
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// ATUALIZAR DADOS DE UM ALUNO
professorRouter.patch(
  "/api/aluno",
  verificarJWTProfessor,
  async (req, res, next) => {
    if (req.body.hasOwnProperty("senha")) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR));
      req.body.senha = await bcrypt.hash(req.body.senha, salt);
    }

    alunoSchema.updateOne({ RA: req.body.RA }, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).send("Aluno(a) atualizado com sucesso!");
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// DELETAR UM ALUNO
professorRouter.delete(
  "/api/aluno/:RA",
  verificarJWTProfessor,
  async (req, res, next) => {
    alunoSchema.deleteOne({ RA: req.params.RA }, (err) => {
      if (!err) {
        res.status(200).send("Aluno(a) apagado com sucesso!");
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// VER SE O USER ESTÁ LOGADO
async function verificarJWTProfessor(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({ message: "Token não informado." });
  }

  jwt.verify(token, publicKey, { algorithm: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Token inválido." });
    } else {
      if (decoded.acesso === "adm" || decoded.acesso === "professor") {
        next();
      } else {
        return res.status(500).send({ message: "Você não tem permissão." });
      }
    }
  });
}

module.exports = professorRouter;
