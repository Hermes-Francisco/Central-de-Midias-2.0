const { Router } = require('express');
const routes = new Router();
const Arquivo = require('./controller/midia');
const Tipo = require('./controller/tipo');
const qrcode = require('./controller/qrcode');

const multer = require('multer');
const uploadConfig = require('./config/upload');
const upload = multer(uploadConfig);

const shell = require('shelljs');

routes.get('/teste', (req, res) => {
    return res.sendFile(__dirname + "/view/teste.html")
})
routes.get('/icone', (req, res) => {
    return res.sendFile(__dirname + "/view/favicon.png")
})
routes.get('/', (req, res) => {
    return res.sendFile(__dirname + "/view/index.html")
})
routes.get('/folder', (req, res) => {
    return res.sendFile(__dirname + "/view/folder.ico")
})
routes.get('/lapis', (req, res) => {
    return res.sendFile(__dirname + "/view/lapis.ico")
})
routes.get('/lixeira', (req, res) => {
    return res.sendFile(__dirname + "/view/lixeira.ico")
})
routes.get('/carregando', (req, res) => {
    return res.sendFile(__dirname + "/view/carregando.gif")
})

routes.post('/', Arquivo.store);
routes.get('/arquivos/:tipo', Arquivo.index);
routes.get('/search/:query', Arquivo.search);
routes.get('/search/:local/:tipo', Arquivo.search_folder);
routes.get('/abrir/:id', Arquivo.send)
routes.get('/script', (req, res) => {
    return res.sendFile(__dirname + "/view/script.js")
})
routes.get('/ab/:id', Arquivo.open)
routes.get('/dir/:id', Arquivo.openDir);
routes.get('/tipos', Tipo.index);

var dialog = false;

routes.get('/dialog', (req, res) => {
	shell.exec('start explorer '+ __dirname + "\\registrar.exe");
	dialog = true;
	return res.send("<script>window.close()</script>")
})

routes.get('/upload/*', (req, res) => {
	
	if(!dialog) return res.send("<html><h1>Origem desconhecida</h1></html>");
	
	var array = req.params[0].split("/");
	
	var loc = encodeURI(req.params[0]);
	var type = array[array.length -1].split(".");
	type = type[type.length -1];
	var name = encodeURI(array[array.length -1].split("."+type)[0]);

	var request = []
	request.body = {nome:name, local: loc, tipo: type}
    Arquivo.storeDialog(request, (r) => {});
	
	return res.send("<html></html>");
	
});

routes.get('/show/:id', Arquivo.show)
routes.delete('/', Arquivo.delete);
routes.put('/:id', Arquivo.update);
routes.get('/qr', qrcode.generate);

var code = 0;
var called = false;

routes.get('/receber', (req, res) => {
	called = false;
    if(req.connection.remoteAddress == '::1'){
		qrcode.autentification(res, (auth) => {
			code = auth;
		});
		setTimeout(()=>{
			if(!called)code = 0;
		}, 15000)
	}else return res.send('<h1>Não Autorizado</h1>');
});
routes.get('/cancel',(req, res)=>{
	code = 0;
	called = false;
	return res.send('<h1>Não Autorizado</h1>');
});
routes.get('/enviar/:id', (req, res)=>{
	const { id } = req.params;
	if( id == code && code != 0 && (!called)){
		called = true;
		return res.sendFile(__dirname + "/view/upload.html");
	}else{
		code = 0;
		called = false;
		return res.send('<h1>Não Autorizado</h1>');
	}
});
routes.post('/enviar/:id', (req, res, next)=>{
if(req.params.id == code && code != 0 && (called)){
	code = 0; 
	called=false; 
	next();
}else return res.status(400).json({erro:'erro'});
}, 
upload.any(), (req, res) => {
    res.send({msg:"success"})
	shell.exec('start explorer '+__dirname + "\\uploads")
});


module.exports = routes;