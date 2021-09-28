// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DA ROTA
const { Router } = require("express");
const recuperarSenha = require("../utils/notificacoes/recuperarSenha");
const professorSchema = require("../models/professor");
const alunoSchema = require("../models/alunos");
const authRouter = Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync("./utils/keys/private.key", "utf8");
const publicKey = fs.readFileSync("./utils/keys/public.key", "utf8");
require("dotenv/config");

const generateProfessorToken = (professor) => {
  const acesso =  professor.superUser ? "adm" : "professor";

  return jwt.sign({
    id: professor._id,
    acesso,
    email: professor.email,
    nome: professor.nome
  }, privateKey, {
    expiresIn: 900,
    algorithm: "RS256",
  });
}

const generateStudentToken = (aluno) => (
  jwt.sign({
    id: aluno._id,
    acesso: 'user',
    nome: aluno.nome,
    email: aluno.email,
    ra: aluno.RA,
  }, privateKey, {
    expiresIn: 900,
    algorithm: "RS256",
  })
)

// AUTENTICAR UM USER
authRouter.post("/api/login", async (req, res) => {
  const { login, senha } = req.body;

  professorSchema.findOne({ email: login }, (err, professor) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (professor) {
      professor.validarSenha(senha, (err, ok) => {
        if (!ok || err) {
          return res.status(401).send();
        }

        return res.status(200).send({
          token: generateProfessorToken(professor),
        });
      });
      return;
    } 

    alunoSchema.findOne({ RA: login }, (err, aluno) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!aluno) {
        return res.status(401).send();
      }

      aluno.validarSenha(senha, (err, ok) => {
        if (!ok || err) {
          return res.status(401).send();
        }

        return res.status(200).send({
          token: generateStudentToken(aluno)
        });
      });
    });
  });
});

// DESLOGAR UM USER
authRouter.post("/api/logout", async (req, res) => {
  res.json({ auth: false, token: null, access: false });
});

// RECUPERAR A SENHA DE UM USER
authRouter.post("/api/recuperar-senha", async (req, res) => {
  const RA = req.body.RA;
  alunoSchema.findOne({ RA: RA }, (err, aluno) => {
    if (!err) {
      if (aluno !== null) {
        const RA = aluno.RA;
        const acesso = "recuperar";
        const token = jwt.sign({ RA, acesso }, privateKey, {
          expiresIn: 900,
          algorithm: "RS256",
        });
        const link = `http://localhost:4010/api/recuper/senha/${token}/${aluno.RA}`;
        recuperarSenha.enviarEmail(aluno.email, link, aluno.nome);
        return res
          .status(200)
          .send("Foi enviado no seu email o link para recuperar sua senha!");
      }
      return res.status(401).send("Nenhum aluno encontrado com esse RA!");
    } else {
      res.status(401).send(err);
    }
  });
});

// RECUPERAR A SENHA DE UM USER
authRouter.get("/api/recuperar-senha/:token/:ra", async (req, res, next) => {
  const auth = verificarJWTRecuperar(req.params.token, req.params.ra);
  console.log(auth)
  if (auth === true) {
    alunoSchema.findOne({
      RA: req.params.ra,
    },
    (err, document) => {
      if (!err) {
        res.status(200).send(document);
      } else {
        res.status(401).send(err);
      }
    });
  } else {
    res.status(401).send("Você não tem permissão.");
  }
});

// VER SE O TOKEN DE RECUPERAÇÃO DE SENHA É CORRETO
function verificarJWTRecuperar(token, RA) {
  if (!token) {
    return false;
  }

  return jwt.verify(
    token,
    publicKey,
    { algorithm: ["RS256"] },
    (err, decoded) => {
      if (err) {
        console.log;
        return false;
      } else {
        if (String(decoded.RA) === RA) {
          return true;
        } else {
          return false;
        }
      }
    }
  );
}

module.exports = authRouter;
