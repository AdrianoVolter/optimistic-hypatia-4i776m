
//Importação de pacotes/módulos para uso da aplicação
var express = require("express"); //Importação do pacote express
var app = express(); //Inicialização da aplicação 'app' pelo pacote express
var bodyParser = require("body-parser"); //Importação do pacote body-parser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Importação do pacote cors
const cors = require("cors");

//Importação do pacote mongoose
var mongoose = require("mongoose");

//Configuração da conexão com o MongoDB no serviço cloud MongoDB Atlas
const uri =
  "mongodb+srv://<usuario>:<senha>@cluster0.a2jgtz7.mongodb.net/?retryWrites=true&w=majority";

//Validação da configuração da conexão com o MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("A conexão com o MongoDB foi realizada com sucesso!");
  })
  .catch((err) => {
    console.log(err);
  });
//Importação do arquivo de modelo que irá representar a coleção 'usuario'
var Usuario = require("./modelo/usuario");
const usuario = require("./modelo/usuario");
//Definição da porta do servidor da aplicação
var porta = 4000;
//Definição da varíavel router para utilizar as instâncias das rotas do pacote express
var router = express.Router();
//Configuração do pacote cors para autorizar requisições de todas as origens
app.use(cors());

//Definição do middleware para acessar as solicitações enviadas à API
router.use(function (req, res, next) {
  console.log("Acesso à primeira camada do middleware...");
  //Definição do site de origem que tem permissão de realizar a conexão com a API
  //O "*" indicado que qualquer site pode fazer a conexão
  res.header("Access-Control-Allow-Origin", "*");
  //Definição dos métodos permitidos pela conexão durante o acesso à API
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  app.use(cors());
  next();
});

//Rota para exibir uma mensagem ao usuário
app.get("/", (req, res) => {
  res.send("Olá mundo! Esta é a página inicial da nossa aplicação.");
});


router.get("/", function (req, res) {
  res.json({
    message: "Olá mundo! Está é a nossa API desenvolvida em Node.js."
  });
});

//Rotas terminadas em '/usuarios' (rotas para os verbos GET e POST)
router
  .route("/usuarios")

  .post(function (req, res) {
    var usuario = new Usuario();
    //Definição dos campos que fazem parte da solicitação
    usuario.nome = req.body.nome;
    usuario.login = req.body.login;
    usuario.senha = req.body.senha;

    usuario.save(function (error) {
      if (error) res.send(error);
      res.json({ message: "Usuário cadastrado com sucesso!" });
    });
  })

  /**
   * Método GET: retornar a listagem de todos os usuários
   * Acesso: GET https://6j07g.sse.codesandbox.io/api/usuarios
   */
  .get(function (req, res) {
    Usuario.find(function (error, usuarios) {
      if (error) res.send(error);
      res.json(usuarios);
    });
  });

//Rotas terminadas em '/usuarios/:usuario_id' (rotas para os verbos GET, PUT e DELETE)
router
  .route("/usuarios/:usuario_id")

  /**
   * Método GET: listar as informações de um usuário específico
   * Acesso: GET https://6j07g.sse.codesandbox.io/api/usuarios/:usuario_id
   */
  .get(function (req, res) {
    Usuario.findById(req.params.usuario_id, function (error, usuario) {
      if (error) res.send(error);
      res.json(usuario);
    });
  })

  .put(function (req, res) {
    Usuario.findById(req.params.usuario_id, function (error, usuario) {
      if (error) res.send(error);
      usuario.nome = req.body.nome;
      usuario.login = req.body.login;
      usuario.senha = req.body.senha;

      usuario.save(function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário Atualizado!" });
      });
    });
  })
 
  .delete(function (req, res) {
    Usuario.deleteOne(
      {
        _id: req.params.usuario_id
      },
      function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário excluído com sucesso!" });
      }
    );
  });

app.listen(porta);
console.log("Iniciando a aplicação na porta " + porta);

app.use("/api", router);
