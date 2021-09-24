const mongoose = require('mongoose')

const AtividadeSchema = new mongoose.Schema({
  nomeAluno: {
    type: String,
    required: [true, 'Por favor, forneça um nome ao aluno.'],
    maxlength: [20, 'Nome do aluno não pode passar de 60 caracteres!'],
  },
  RA: {
    type: String,
    required: [true, "Por favor, forneça um RA ao aluno."],
    maxlength: [20, "RA do aluno não pode passar de 60 caracteres!"],
  },
  nomeAtividade: {
    type: String,
    required: [true, "Por favor, forneça o nome da atividade."],
  },
  inicio: {
    type: Date,
    required: [true, "Por favor, forneça a data de inicio do curso."],
  },
  termino: {
    type: Date,
    required: [true, "Por favor, forneça a data de termino do curso."],
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
    required: [true, "Por favor, forneça o nome do palestrante da atividade realizada."],
  },
  indicacaoProfessor: {
    type: String,
  },
  categoria: {
    type: String,
    required: [true, "Por favor, forneça a categoria da atividade realizada."],
  },
  dataDeEnvio: {
    type: Date,
    required: [true],
  },
  dataDeAprovacao: {
    type: Date,
  },
  status: {
    type: String,
    required: [true],
  },
  horasTotais: {
    type: Number,
  },
  comentariosProfessor: {
    type: String
  },
})

module.exports = mongoose.model('Atividade', AtividadeSchema)