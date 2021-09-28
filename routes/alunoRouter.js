// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DA ROTA
const { Router } = require("express");
const atividadeSchema = require("../models/atividades");
const statusModificado = require("../utils/notificacoes/statusModificado");
const alunoRouter = Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync("./utils/keys/public.key", "utf8");
require("dotenv/config");

// ROTAS PARA USO DO ALUNO

// OBTER TODAS AS ATIVIDADES DO ALUNO COM BASE NO RA
alunoRouter.get(
  "/api/atividades/todas/:RA",
  verificarJWTAluno,
  async (req, res, next) => {
    const RA = req.params.RA;
    atividadeSchema.find({ RA: RA }, (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades);
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// OBTER TODAS AS ATIVIDADES PENDENTES DO ALUNO COM BASE NO RA
alunoRouter.get("/api/atividades/pendentes/:RA", async (req, res, next) => {
  const RA = req.params.RA;
  atividadeSchema.find(
    {
      RA: RA,
      status: "pendente",
    },
    (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades);
      } else {
        res.status(401).send(err);
      }
    }
  );
});

// OBTER TODAS AS ATIVIDADES CONFIRMADAS DO ALUNO COM BASE NO RA
alunoRouter.get("/api/atividades/confirmadas/:RA", async (req, res, next) => {
  const RA = req.params.RA;
  atividadeSchema.find(
    {
      RA: RA,
      status: "confirmada",
    },
    (err, atividades) => {
      if (!err) {
        res.status(200).send(atividades);
      } else {
        res.status(401).send(err);
      }
    }
  );
});

// OBTER TODAS AS ATIVIDADES NEGADAS DO ALUNO COM BASE NO RA
alunoRouter.get(
  "/api/atividades/negadas/:RA",
  verificarJWTAluno,
  async (req, res, next) => {
    const RA = req.params.RA;
    atividadeSchema.find(
      {
        RA: RA,
        status: "negada",
      },
      (err, atividades) => {
        if (!err) {
          res.status(200).send(atividades);
        } else {
          res.status(401).send(err);
        }
      }
    );
  }
);

// OBTER ATIVIDADE PELO ID
alunoRouter.get(
  "/api/atividade/:ID",
  verificarJWTAluno,
  async (req, res, next) => {
    atividadeSchema.findById(req.params.ID, (err, atividade) => {
      if (!err) {
        res.status(200).send(atividade);
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// INSERIR UMA NOVA ATIVIDADE
alunoRouter.post(
  "/api/atividade",
  verificarJWTAluno,
  async (req, res, next) => {
    const newAtividade = new atividadeSchema(req.body);

    newAtividade.save((err) => {
      if (!err) {
        res.status(200).send("Atividade inserida com sucesso!");
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// ATUALIZAR OS DADOS DE UMA ATIVIDADE
alunoRouter.patch(
  "/api/atividade",
  verificarJWTAluno,
  async (req, res, next) => {
    const RA = req.body.RA;
    alunoSchema.findOne({ RA: RA }, (err, aluno) => {
    if (!err) {
      if (req.body.status) {
        statusModificado.enviarEmail(aluno.email, 'localhost:4000', aluno.nome)
      }
      atividadeSchema.findByIdAndUpdate(
        req.body._id,
        { $set: req.body },
        (err) => {
          if (!err) {
            res.status(200).send("Atividade atualizada com sucesso!");
          } else {
            res.status(401).send(err);
          }
        }
      );
    } else {
      res.status(401).send(err);
    }
  });
})

// DELETAR UMA ATIVIDADE COM BASE NO ID
alunoRouter.delete(
  "/api/atividade/:ID",
  verificarJWTAluno,
  async (req, res, next) => {
    atividadeSchema.findByIdAndRemove(req.params.ID, (err) => {
      if (!err) {
        res.status(200).send("Atividade deletada com sucesso!");
      } else {
        res.status(401).send(err);
      }
    });
  }
);

// VER SE O USER ESTÁ LOGADO
async function verificarJWTAluno(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({ message: "Token não informado." });
  }

  jwt.verify(token, publicKey, { algorithm: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Token inválido." });
    } else {
      if (
        decoded.acesso === "user" ||
        decoded.acesso === "professor" ||
        decoded.acesso === "adm"
      ) {
        next();
      } else {
        return res.status(500).send({ message: "Você não tem permissão." });
      }
    }
  });
}

module.exports = alunoRouter;
