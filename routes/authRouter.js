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

// AUTENTICAR UM USER
authRouter.post("/api/login", async (req, res, next) => {
  professorSchema.findOne({ email: req.body.login }, (err, professor) => {
    if (!err) {
      if (professor !== null) {
        const idProfessor = professor._id;
        professor.validarSenha(req.body.senha, (err, ok) => {
          if (ok === true) {
            let acesso;

            if (professor.superUser === true) {
              acesso = "adm";
            } else {
              acesso = "professor";
            }

            const token = jwt.sign({
              idProfessor,
              acesso,
              email: professor.email,
              nome: professor.nome
            }, privateKey, {
              expiresIn: 900,
              algorithm: "RS256",
            });

            return res.status(200).send({
              token: token,
            });
          }
          return res.status(401).send("Login inválido!");
        });
      } else {
        alunoSchema.findOne({ RA: req.body.login }, (err, aluno) => {
          if (!err) {
            if (aluno !== null) {
              const idAluno = aluno._id;
              const acesso = "user";
              aluno.validarSenha(req.body.senha, (err, ok) => {
                if (ok === true) {
                  const token = jwt.sign({
                    idAluno,
                    acesso,
                    nome: aluno.nome,
                    email: aluno.email,
                    ra: aluno.RA,
                  }, privateKey, {
                    expiresIn: 900,
                    algorithm: "RS256",
                  });

                  return res.status(200).send({
                    token: token,
                  });
                }
                return res.status(401).send("Login inválido!");
              });
            }
          } else {
            res.status(401).send(err);
          }
        });
      }
    } else {
      res.status(401).send(err);
    }
  });
});

// DESLOGAR UM USER
authRouter.post("/api/logout", async (req, res) => {
  res.json({ auth: false, token: null, acess: "false" });
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
