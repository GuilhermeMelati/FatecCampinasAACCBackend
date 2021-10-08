// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DO SCHEMA
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv/config')

// DEFININDO O SCHEMA
const alunoSchema = new mongoose.Schema({
	nome: {
		type: String,
		required: [true, 'Por favor, forneça um nome ao aluno.'],
		maxlength: [60, 'Nome do aluno não pode passar de 60 caracteres!'],
	},
	RA: {
		type: String,
		required: [true, 'Por favor, forneça um RA ao aluno.'],
		maxlength: [60, 'RA do aluno não pode passar de 60 caracteres!'],
		index: {unique: true},
	},
	email: {
		type: String,
		required: [true, 'Por favor, forneça um email ao aluno.'],
		maxlength: [60, 'Email do aluno não pode passar de 60 caracteres!'],
		index: {unique: true},
	},
	senha: {
		type: String,
		required: [true, 'Por favor, forneça uma senha ao aluno.'],
		maxlength: [60, 'Senha do aluno não pode passar de 60 caracteres!'],
	},
	curso: {
		type: String,
		required: [true, 'Por favor, forneça um curso ao aluno.'],
	},
	periodo: {
		type: String,
		required: [true, 'Por favor, forneça um período ao aluno.'],
	},
	horasAprovadas: {
		type: Number,
		required: [
			true,
			'Por favor, forneça a quantidade de horas aprovadas do aluno.',
		],
	},
	horasPendentes: {
		type: Number,
		required: [
			true,
			'Por favor, forneça a quantidade de horas pendentes do aluno.',
		],
	},
})

alunoSchema.pre('save', async function save(next) {
	if (!this.isModified('senha')) return next()
	try {
		const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR))
		this.senha = await bcrypt.hash(this.senha, salt)
		return next()
	} catch (err) {
		return next(err)
	}
})

alunoSchema.methods.validarSenha = function (senha, cb) {
	bcrypt.compare(senha, this.senha, function (err, ok) {
		if (err) return cb(err)
		cb(null, ok)
	})
}

module.exports = mongoose.model('Aluno', alunoSchema)
