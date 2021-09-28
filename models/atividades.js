// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DO SCHEMA
const mongoose = require("mongoose");

// DEFININDO O SCHEMA
const atividadeSchema = new mongoose.Schema({
  nomeAluno: {
    type: String,
    required: [true, "Por favor, forneça um nome ao aluno."],
    maxlength: [60, "Nome do aluno não pode passar de 60 caracteres!"],
  },
  RA: {
    type: String,
    required: [true, "Por favor, forneça um RA ao aluno."],
    maxlength: [60, "RA do aluno não pode passar de 60 caracteres!"],
  },
  nomeAtividade: {
    type: String,
    required: [true, "Por favor, forneça o nome da atividade."],
  },
  inicio: {
    type: String,
    required: [true, "Por favor, forneça a data de inicio da atividade."],
  },
  termino: {
    type: String,
    required: [true, "Por favor, forneça a data de termino da atividade."],
  },
  cidade: {
    type: String,
    required: [true, "Por favor, forneça a cidade onde foi feita a atividade."],
  },
  organizador: {
    type: String,
    required: [true, "Por favor, forneça o organizador da atividade."],
  },
  nomePalestrante: {
    type: String,
    required: [
      true,
      "Por favor, forneça o nome do palestrante da atividade realizada.",
    ],
  },
  categoria: {
    type: String,
    required: [true, "Por favor, forneça a categoria da atividade realizada."],
  },
  indicacaoProfessor: {
    type: String,
  },
  dataDeEnvio: {
    type: String,
    required: [true],
  },
  professor: {
    type: String,
  },
  dataDaRespostaDoProfessor: {
    type: String,
  },
  status: {
    type: String,
    required: [true],
  },
  horasTotais: {
    type: Number,
  },
  comentariosProfessor: {
    type: String,
  },
});

module.exports = mongoose.model("Atividade", atividadeSchema);
