const express = require("express");
const mongoose = require("mongoose");
const AtividadeSchema = require("./models/atividade");
const AlunoSchema = require("./models/aluno");
require("dotenv/config");

mongoose.connect(process.env.MONGO_URI);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET ATIVIDADES

// MODO TOTAL PARA VISUALIZAÇÃO DO PROFESSOR

app.get("/api/obter/atividades/todas", (req, res) => {
  AtividadeSchema.find((err, document) => {
    if (!err) {
      res.send(document);
    } else {
      res.status("400").send(err);
    }
  });
});

app.get("/api/obter/atividades/pendentes", (req, res) => {
  AtividadeSchema.findOne({ status: "pendente" }, (err, document) => {
    if (!err) {
      res.send(document);
    } else {
      res.status("400").send(err);
    }
  });
});

app.get("/api/obter/atividades/confirmadas", (req, res) => {
  AtividadeSchema.findOne({ status: "confirmada" }, (err, document) => {
    if (!err) {
      res.send(document);
    } else {
      res.status("400").send(err);
    }
  });
});

app.get("/api/obter/atividades/negadas", (req, res) => {
  AtividadeSchema.findOne({ status: "negada" }, (err, document) => {
    if (!err) {
      res.send(document);
    } else {
      res.status("400").send(err);
    }
  });
});

// MODO ALUNO

app.get("/api/obter/atividades/todas", (req, res) => {
  const RA = req.body.RA;
  AtividadeSchema.findOne({ RA: RA }, (err, document) => {
    if (!err) {
      res.send(document);
    } else {
      res.status("400").send(err);
    }
  });
});

app.get("/api/obter/atividades/pendentes", (req, res) => {
  const RA = req.body.RA;
  AtividadeSchema.findOne(
    {
      RA: RA,
      status: "pendente",
    },
    (err, document) => {
      if (!err) {
        res.send(document);
      } else {
        res.status("400").send(err);
      }
    }
  );
});

app.get("/api/obter/atividades/confirmadas", (req, res) => {
  const RA = req.body.RA;
  AtividadeSchema.findOne(
    {
      RA: RA,
      status: "confirmada",
    },
    (err, document) => {
      if (!err) {
        res.send(document);
      } else {
        res.status("400").send(err);
      }
    }
  );
});

app.get("/api/obter/atividades/negadas", (req, res) => {
  const RA = req.body.RA;
  AtividadeSchema.findOne(
    {
      RA: RA,
      status: "negada",
    },
    (err, document) => {
      if (!err) {
        res.send(document);
      } else {
        res.status("400").send(err);
      }
    }
  );
});

// POST ATIVIDADES

app.post("/api/inserir/atividade", (req, res) => {
  const newAtividade = new AtividadeSchema(req.body);

  newAtividade.save((err) => {
    if (!err) {
      res.status(200);
    } else {
      res.status(400).send(err);
    }
  });
});

// PATCH ATIVIDADES

app.patch("/api/deletar/atividade", (req, res) => {
  AtividadeSchemaSchema.findB(
    { RA: req.body.RA },
    (err) => {
      if (!err) {
        res.status(200);
      } else {
        res.status(400).send(err);
      }
    }
  );
});

// DELETE ALUNO

app.delete("/api/deletar/atividade", (req, res) => {
  AtividadeSchemaSchema.deleteOne(
    { RA: req.body.RA },
    (err) => {
      if (!err) {
        res.status(200);
      } else {
        res.status(400).send(err);
      }
    }
  );
});



// POST ALUNO

app.post("/api/inserir/aluno", (req, res) => {
  const newAluno = new AlunoSchema(req.body);

  newAluno.save((err) => {
    if (!err) {
      res.status(200);
    } else {
      res.status(400).send(err);
    }
  });
});

// PATCH ALUNOS

app.patch("/api/atualizar/aluno", (req, res) => {
  AlunoSchema.updateOne(
    { RA: req.body.RA },
    { $set: req.body },
    (err) => {
      if (!err) {
        res.status(200);
      } else {
        res.status(400).send(err);
      }
    }
  );
});

// DELETE ALUNO

app.delete("/api/deletar/aluno", (req, res) => {
  AlunoSchema.deleteOne(
    { RA: req.body.RA },
    (err) => {
      if (!err) {
        res.status(200);
      } else {
        res.status(400).send(err);
      }
    }
  );
});

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
