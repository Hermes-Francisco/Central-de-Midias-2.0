var QRCode = require('qrcode')
var IP = require("ip");

class qrcode{
    generate(req, res){
		const ip = 'http://'+IP.address()+':3000';
        QRCode.toDataURL(ip, function (err, url) {
            return res.send("<table align='center'><tr><td>"+
            "<img height='200px' style='margin-top: 50px' src='"+url+"'></img>"+
            "</td></tr></table>"+
            "<h2 align='center'>"+ip+"</h2>")
        })
    }
	autentification(res, auth){
		const ip = 'http://'+IP.address()+':3000';
		var code = Date.now();
		auth(code);
		var local = ip + '/enviar/' + code;
		QRCode.toDataURL(local, function (err, url) {
            return res.send("<div id='conteudo'>"+
			"<table align='center'><tr><td>"+
            "<img height='200px' style='margin-top: 50px' src='"+url+"'></img>"+
            "</td></tr></table>"+
            "<h2 align='center'>"+local+"</h2>"+
			"</div>"+
			"<script>setTimeout(()=>{window.close(); "+
			"document.getElementById('conteudo').innerHTML = '';}, 10000);</script>");
        })
	}
}
module.exports = new qrcode();
