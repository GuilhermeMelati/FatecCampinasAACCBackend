// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DO SCHEMA
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv/config')

// DEFININDO O SCHEMA
const professorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, forneça um nome ao professor.'],
    maxlength: [60, 'Nome do professor não pode passar de 60 caracteres!'],
  },
  email: {
    type: String,
    required: [true, 'Por favor, forneça um email ao professor.'],
    maxlength: [60, 'Email do professor não pode passar de 60 caracteres!'],
    index: {unique: true},
  },
  senha: {
    type: String,
    required: [true, 'Por favor, forneça uma senha ao professor.'],
    maxlength: [60, 'Senha do professor não pode passar de 60 caracteres!'],
  },
  superUser: {
    type: Boolean,
    required: [
      true,
      'Por favor, confirme se o professor será um super usuário do sistema.',
    ],
  },
})

professorSchema.pre('save', async function save(next) {
  if (!this.isModified('senha')) return next()
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR))
    this.senha = await bcrypt.hash(this.senha, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

professorSchema.methods.validarSenha = function (senha, cb) {
  bcrypt.compare(senha, this.senha, function (err, ok) {
    if (err) return cb(err)
    cb(null, ok)
  })
}

module.exports = mongoose.model('Professor', professorSchema)
