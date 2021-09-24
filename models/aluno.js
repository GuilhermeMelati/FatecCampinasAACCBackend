const mongoose = require('mongoose')

const AlunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, forneça um nome ao aluno.'],
    maxlength: [20, 'Nome do aluno não pode passar de 60 caracteres!'],
  },
  RA: {
    type: Number,
    required: [true, "Por favor, forneça um RA ao aluno."],
    maxlength: [20, "RA do aluno não pode passar de 60 caracteres!"],
  },
  senha: {
    type: String,
    required: [true, "Por favor, forneça uma senha ao aluno."],
    maxlength: [20, "Senha do aluno não pode passar de 60 caracteres!"],
  },
  curso: {
    type: String,
    required: [true, "Por favor, forneça um curso ao aluno."],
  },
  semestre: {
    type: Number,
    required: [true, "Por favor, forneça um semestre ao aluno."],
  },
  periodo: {
    type: String,
    required: [true, "Por favor, forneça um período ao aluno."],
  },
  horasAprovadas: {
    type: Number,
    required: [true, "Por favor, forneça a quantidade de horas aprovadas do aluno."],
  },
  horasPendentes: {
    type: Number,
    required: [true, "Por favor, forneça a quantidade de horas pendentes do aluno."],
  },
})

module.exports = mongoose.model('Aluno', AlunoSchema)