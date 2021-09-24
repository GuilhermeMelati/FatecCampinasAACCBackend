const mongoose = require('mongoose')

const ProfessorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, forneça um nome ao professor.'],
    maxlength: [20, 'Nome do professor não pode passar de 60 caracteres!'],
  },
  email: {
    type: String,
    required: [true, "Por favor, forneça um email ao professor."],
    maxlength: [20, "Email do professor não pode passar de 60 caracteres!"],
  },
  senha: {
    type: String,
    required: [true, "Por favor, forneça uma senha ao professor."],
    maxlength: [20, "Senha do professor não pode passar de 60 caracteres!"],
  },
})

module.exports = mongoose.model('Professor', ProfessorSchema)