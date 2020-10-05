const { Router } = require('express');
const routes = new Router();
const Arquivo = require('./controller/midia');
const Tipo = require('./controller/tipo');
const qrcode = require('./controller/qrcode');

const pc_auth = require("./controller/pc_auth")

const multer = require('multer');
const uploadConfig = require('./config/upload');
const upload = multer(uploadConfig);

const shell = require('shelljs');
const favoritos = require('./controller/favoritos');

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
routes.get('/random/musicas', Arquivo.random);
routes.get('/search/:query', Arquivo.search);
routes.get('/search/:local/:tipo', Arquivo.search_folder);
routes.get('/pastas/:tipo', Arquivo.index_folder);
routes.get('/abrir/:id', Arquivo.send)
routes.get('/script', (req, res) => {
    return res.sendFile(__dirname + "/view/script.js")
});
routes.get('/player_script', (req, res) => {
    return res.sendFile(__dirname + "/view/player.js")
});
routes.get('/ab/:id', Arquivo.open)
routes.get('/dir/:id', Arquivo.openDir);
routes.get('/tipos', Tipo.index);

function checkIp(req, res, next){
	if(req.connection.remoteAddress == '::1'){
		return next();
	}else return res.send("<h1>Não Autorizado</h1>")
}

routes.get('/dialog', checkIp,(req, res) => {
	shell.exec('start explorer '+ __dirname + "\\registrar.exe");
	return res.send("<script>window.close()</script>")
})

routes.get('/upload/*', checkIp, (req, res) => {
	
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
routes.delete('/', checkIp, Arquivo.delete);
routes.put('/:id', checkIp, Arquivo.update);
routes.get('/qr', qrcode.generate);

var code = 0;
var called = false;
var pc = false;

routes.get('/receber', (req, res) => {
	called = false;
	pc = false;
    if(req.connection.remoteAddress == '::1'){
		qrcode.autentification(res, (auth) => {
			code = auth;
		});
		setTimeout(()=>{
			if(!called && !pc)code = 0;
		}, 15000)
	}else return res.send('<h1>Não Autorizado</h1>');
});
routes.get('/cancel',(req, res)=>{
	code = 0;
	called = false;
	pc = false;
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
		pc = false;
		return res.send('<h1>Não Autorizado</h1>');
	}
});
routes.post('/enviar/:id', (req, res, next)=>{
if(req.params.id == code && code != 0 && (called)){
	code = 0; 
	called=false; 
	pc = false;
	next();
}else return res.status(400).json({erro:'erro'});
}, 
upload.any(), (req, res) => {
    res.send({msg:"success"})
	shell.exec('start explorer '+__dirname + "\\uploads")
});

routes.get('/enviar_auth/:login/:senha', (req, res) => {
	pc_auth.check(req, res, code,(auth) =>{
		code = auth;
	})
});
routes.get('/receber/:login/:senha', checkIp, (req, res) => {
	pc_auth.code(req, res, (auth) => {
		code = auth;
		pc = true;
	})
})
routes.get('/receber_pc', checkIp, (req, res) => {
	res.sendFile(__dirname+'/view/receber.html');
});
routes.get('/enviar', (req, res) => {
	res.sendFile(__dirname+'/view/enviar_auth.html');
});

//player

routes.get('/buttons/play', (req, res) => {
	res.sendFile(__dirname+'/view/player/play.png');
});
routes.get('/buttons/pause', (req, res) => {
	res.sendFile(__dirname+'/view/player/pause.png');
});
routes.get('/buttons/stop', (req, res) => {
	res.sendFile(__dirname+'/view/player/stop.png');
});
routes.get('/buttons/prev', (req, res) => {
	res.sendFile(__dirname+'/view/player/anterior.png');
});
routes.get('/buttons/next', (req, res) => {
	res.sendFile(__dirname+'/view/player/proximo.png');
});
routes.get('/buttons/detalhes', (req, res) => {
	res.sendFile(__dirname+'/view/player/detalhes.png');
});
routes.get('/buttons/addfavorito', (req, res) => {
	res.sendFile(__dirname+'/view/player/favorito-branco.png');
});
routes.get('/buttons/removefavorito', (req, res) => {
	res.sendFile(__dirname+'/view/player/favorito-preto.png');
});
routes.get('/buttons/fav_icon', (req, res) => {
	res.sendFile(__dirname+'/view/player/favorito-icon.png');
});

//favoritos

routes.get('/favoritos', favoritos.index);
routes.get('/favoritos/random', favoritos.random);
routes.get('/favoritos/count', favoritos.counter);
routes.get('/favoritos/check/:midia', favoritos.check);
routes.get('/favoritos/script', (req, res) => {
	res.sendFile(__dirname+'/view/favoritos.js');
});
routes.post('/favoritos', favoritos.store);
routes.put('/favoritos/:midia', favoritos.update);
routes.delete('/favoritos', favoritos.delete);


module.exports = routes;