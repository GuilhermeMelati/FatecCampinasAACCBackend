// REQUIRES NECESSÁRIOS PARA A IMPLEMENTAÇÃO DO SERVIDOR
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const admRouter = require("./routes/admRouter");
const alunoRouter = require("./routes/alunoRouter");
const authRouter = require("./routes/authRouter");
const professorRouter = require("./routes/professorRouter");
require("dotenv/config");

// CONECTANDO O MONGO DB ATLAS (REMOTO)
mongoose.connect(process.env.MONGO_URI);

// DEFININDO OS SETS DO EXPRESS
const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ROTAS
app.use(admRouter)
app.use(alunoRouter)
app.use(authRouter)
app.use(professorRouter)

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// DEFININDO A PORTA DO SERVIDOR (PADRÃO 4000)
const port = process.env.PORT || 4000;

// ESCUTANDO A PORTA
app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
