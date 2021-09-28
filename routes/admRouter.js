// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DA ROTA
const { Router } = require("express");
const professorSchema = require("../models/professor");
const bcrypt = require("bcryptjs");
const admRouter = Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync("./utils/keys/public.key", "utf8");
require("dotenv/config");

// ROTAS PARA O USO DO ADM

// OBTER TODOS OS PROFESSORES
admRouter.get("/api/professor/todos", verificarJWTADM, async (req, res, next) => {
  professorSchema.find((err, professores) => {
    if (!err) {
      res.status(200).send(professores);
    } else {
      res.status(400).send(err);
    }
  });
});

// OBTER PROFESSOR COM BASE NO EMAIL
admRouter.get("/api/professor/:email", verificarJWTADM, async (req, res, next) => {
  professorSchema.findOne((err, professor) => {
    {
      email: req.params.email;
    }
    if (!err) {
      res.status(200).send(professor);
    } else {
      res.status(400).send(err);
    }
  });
});

// INSERIR UM NOVO PROFESSOR
admRouter.post("/api/professor", async (req, res, next) => {
  const newProfessor = new professorSchema(req.body);

  newProfessor.save((err) => {
    if (!err) {
      res.status(200).send("Professor(a) inserido com sucesso!");
    } else {
      res.status(400).send(err);
    }
  });
});

// ATUALIZAR DADOS DE UM PROFESSOR
admRouter.patch("/api/professor", verificarJWTADM, async (req, res, next) => {
  if (req.body.hasOwnProperty("senha")) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR));
    req.body.senha = await bcrypt.hash(req.body.senha, salt);
  }

  professorSchema.updateOne(
    { email: req.body.email },
    { $set: req.body },
    (err) => {
      if (!err) {
        res.status(200).send("Professor(a) atualizado com sucesso!");
      } else {
        res.status(400).send(err);
      }
    }
  );
});

// DELETAR UM PROFESSOR
admRouter.delete("/api/professor/:email", verificarJWTADM, async (req, res, next) => {
  professorSchema.deleteOne({ email: req.params.email }, (err) => {
    if (!err) {
      res.status(200).send("Professor(a) apagado com sucesso!");
    } else {
      res.status(400).send(err);
    }
  });
});

// VER SE O USER ESTÁ LOGADO
async function verificarJWTADM(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token) {
    return res
      .status(400)
      .send({ message: "Token não informado." });
  }

  jwt.verify(token, publicKey, { algorithm: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Token inválido." });
    } else {
      if (decoded.acesso === 'adm') {
        next();
      } else {
        return res.status(500).send({ message: "Você não tem permissão." });
      }
    }
  });
}

module.exports = admRouter;
