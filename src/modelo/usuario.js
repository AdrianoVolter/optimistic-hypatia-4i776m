/**
 * Arquivo da configuração do esquema da base de dados MongoDB
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioEsquema = new Schema({
  nome: String,
  login: String,
  senha: String
});

module.exports = mongoose.model("Usuario", UsuarioEsquema);
