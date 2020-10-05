todos();

function listar_tipos(){
	document.getElementById('tipos').innerHTML = " "
	$.getJSON("/tipos", function(data) {
		for (i = 0; i < data.length; i++) {
			var interno = data[i].id + ", '" +data[i].nome+ "'";
			$('#tipos').append('<li><a href="#" onclick="tipo('+interno+')">'+iniMaiuscula(data[i].nome)+'</a></li>');		
		}
	});	
}

var Pasta = false;
var PastaAberta = false;

function prevent(e){
    e.preventDefault();
}
document.getElementById("search").addEventListener('submit', prevent);

const host = (window.location.hostname == "localhost");
if(!host)$(".config").hide();

var tipo_id;
var tipo_nome;
var song = false;
var resetar = false;

function todos(){

	if(resetar)midia_reset();

	tipo_id = 0;
	tipo_nome = "";
	$(".th_arquivos").show();
	PastaAberta = false;
	
	if(Menu)menu();
	
	listar_tipos();
    document.getElementById('Lista-titulo').innerHTML = "Procurar";
    document.getElementById('lista').innerHTML = " ";
	
	$('#pesquisa').show();
	$('#Lista-titulo').css("margin-top", "25px");
	$('#Lista-titulo').css("margin-bottom", "20px");
    
	if(!Pasta){
		$.getJSON("/arquivos/tipo", function(data) {
			for(i = 0; i < data.length; i++){

				var dir = data[i].local.split('/');
				var diretorio = iniMaiuscula(decodeURI(dir[dir.length-2]));
				var dirLink = "folder('"+dir[dir.length-2]+"', '"+diretorio+"')";
				var interno = 'excluir('+data[i].id+', "'+decodeURI(data[i].nome)+'")'
				var opcao = ((host)?"<td width='100px'><a href='../dir/"+data[i].id+"' target='blanck'><img src='/folder' style='margin-right:5px' height='20'></img></a>"+
				"<a href='#' onclick='editar("+data[i].id+")'><img src='/lapis' style='margin-left:5px; margin-right:5px' height='20'></img></a>" + 
				"<a href='#' onclick='"+interno+"'><img src='/lixeira' style='margin-left:5px' height='20'></img></a></td>": "")
				var nome = "'"+decodeURI(data[i].nome)+"'"

				$('#lista').append('<tr><td><a href="#" onclick="midia('+data[i].tipo+','+data[i].id+', '+nome+')">'+
				'<img src="/icone" style="display: none; margin-right: 5px;" class="playing" id="'+data[i].id+'" height="15px"></img>'+
				decodeURI(data[i].nome)+'</a></td>'+
				'<td><a href="#" onclick="'+dirLink+'">'+diretorio+'</a></td>'+opcao+'</tr>');
				if(data[i].tipo == 1 || data[i].tipo == 4)addMidia(data[i].id);
			}
			if(song)$("#"+song).show();
		});
	}else ExibirPasta(Pasta);
}
function iniMaiuscula(palavra){
    return palavra.substring(0,1).toUpperCase() + palavra.substring(1);
}
function tipo(id, nome){
	tipo_id = id;
	tipo_nome = nome;
	$(".th_arquivos").show();
	PastaAberta = false;
	
	if(Menu)menu();
	
	listar_tipos();
	$('#pesquisa').hide();
    document.getElementById('Lista-titulo').innerHTML = iniMaiuscula(nome);
	document.getElementById('lista').innerHTML = " ";
	
	$('#Lista-titulo').css("margin-top", "30px");
	$('#Lista-titulo').css("margin-bottom", "30px");
	
	if(!Pasta){
		$.getJSON("/arquivos/"+id, function(data) {
			for(i = 0; i < data.length; i++){

				var dir = data[i].local.split('/');
				var diretorio = iniMaiuscula(decodeURI(dir[dir.length-2]));
				var dirLink = "folder('"+dir[dir.length-2]+"', '"+diretorio+"')";
				var interno = 'excluir('+data[i].id+', "'+decodeURI(data[i].nome)+'")'
				var opcao = ((host)?"<td width='100px'><a href='../dir/"+data[i].id+"' target='blanck'><img src='/folder' style='margin-right:5px' height='20'></img></a>"+
				"<a href='#' onclick='editar("+data[i].id+")'><img src='/lapis' style='margin-left:5px; margin-right:5px' height='20'></img></a>" + 
				"<a href='#' onclick='"+interno+"'><img src='/lixeira' style='margin-left:5px' height='20'></img></a></td>": "")
				var nome = "'"+decodeURI(data[i].nome)+"'"

				$('#lista').append('<tr><td><a href="#" onclick="midia('+data[i].tipo+','+data[i].id+', '+nome+')">'+
				'<img src="/icone" style="display: none; margin-right: 5px;" class="playing" id="'+data[i].id+'" height="15px"></img>'+
				decodeURI(data[i].nome)+'</a></td>'+
				'<td><a href="#" onclick="'+dirLink+'">'+diretorio+'</a></td>'+opcao+'</tr>');
			}
			if(song)$("#"+song).show();
		});
	}else ExibirPasta(Pasta);
}

function pesquisa(){
	tipo_id = 0;
	tipo_nome = "";
	$(".th_arquivos").show();
	
    var query = $('#pesq').val();
    if(query == ''){
		todos();
	}else{
	listar_tipos();
    document.getElementById('Lista-titulo').innerHTML = "Resultados";
    document.getElementById('lista').innerHTML = " ";
	
    $.getJSON("/search/"+query, function(data) {
        for(i = 0; i < data.length; i++){

            var dir = data[i].local.split('/');
            var diretorio = iniMaiuscula(decodeURI(dir[dir.length-2]));
			var dirLink = "folder('"+dir[dir.length-2]+"', '"+diretorio+"')";
			var interno = 'excluir('+data[i].id+', "'+decodeURI(data[i].nome)+'")'
			var opcao = ((host)?"<td width='100px'><a href='../dir/"+data[i].id+"' target='blanck'><img src='/folder' style='margin-right:5px' height='20'></img></a>"+
			"<a href='#' onclick='editar("+data[i].id+")'><img src='/lapis' style='margin-left:5px; margin-right:5px' height='20'></img></a>" + 
			"<a href='#' onclick='"+interno+"'><img src='/lixeira' style='margin-left:5px' height='20'></img></a></td>": "")
			var nome = "'"+decodeURI(data[i].nome)+"'"

            $('#lista').append('<tr><td><a href="#" onclick="midia('+data[i].tipo+','+data[i].id+', '+nome+')">'+
				'<img src="/icone" style="display: none; margin-right: 5px;" class="playing" id="'+data[i].id+'" height="15px"></img>'+
				decodeURI(data[i].nome)+'</a></td>'+
            '<td><a href="#" onclick="'+dirLink+'">'+diretorio+'</a></td>'+opcao+'</tr>')
        }
		if(song)$("#"+song).show();
    });
	}
}

function folder(local, nome){
	listar_tipos();
	$('#pesquisa').hide();
	$(".th_arquivos").show();
	PastaAberta = true;
	var titulo_folder  = ((tipo_nome == "")?iniMaiuscula(nome):iniMaiuscula(tipo_nome)+" ("+iniMaiuscula(nome)+")");
    document.getElementById('Lista-titulo').innerHTML = titulo_folder;
    document.getElementById('lista').innerHTML = " ";
	
	var tipo_atual = tipo_id;
	if(tipo_atual == 0)tipo_atual = 'tipo';
	
	var op = ((host)?"<td>--</td>":"")
	$('#lista').append('<tr><td><a href="#" onclick="voltar()"><img src="/folder" style="margin-right:5px" height="20"></img>Voltar</a></td>'+
	'<td>--</td>'+op+'</tr>')	
	
    $.getJSON("/search/"+local+"/"+tipo_atual, function(data) {
        for(i = 0; i < data.length; i++){

            var dir = data[i].local.split('/');
            var diretorio = iniMaiuscula(decodeURI(dir[dir.length-2]));
			var interno = 'excluir('+data[i].id+', "'+decodeURI(data[i].nome)+'")'
			var opcao = ((host)?"<td width='100px'><a href='../dir/"+data[i].id+"' target='blanck'><img src='/folder' style='margin-right:5px' height='20'></img></a>"+
			"<a href='#' onclick='editar("+data[i].id+")'><img src='/lapis' style='margin-left:5px; margin-right:5px' height='20'></img></a>" + 
			"<a href='#' onclick='"+interno+"'><img src='/lixeira' style='margin-left:5px' height='20'></img></a></td>": "")
			var nome = "'"+decodeURI(data[i].nome)+"'"

            $('#lista').append('<tr><td><a href="#" onclick="midia('+data[i].tipo+','+data[i].id+', '+nome+')">'+
				'<img src="/icone" style="display: none; margin-right: 5px;" class="playing" id="'+data[i].id+'" height="15px"></img>'+
				decodeURI(data[i].nome)+'</a></td>'+
            '<td><a href="#">'+diretorio+'</a></td>'+opcao+'</tr>')
        }
		if(song)$("#"+song).show();
    });
}

function ExibirPasta(ativado){
	Pasta = ativado;
	if(Menu)menu();
	if(!PastaAberta){
		if(ativado){
			document.getElementById('lista').innerHTML = " ";
			$("#th_arquivos").hide();
			var tipo_atual = tipo_id;
			if(tipo_atual == 0)tipo_atual = 'tipo';
		
			$.getJSON("/pastas/"+tipo_atual, function(data) {
				for(i = 0; i < data.length; i++){
					
					var diretorio = iniMaiuscula(decodeURI(data[i].local));
					var dirLink = "folder('"+data[i].local+"', '"+diretorio+"')";
					var opcao = ((host)?"<td>--</td>":"")
					
					$('#lista').append('<tr><td><a href="#" onclick="'+dirLink+'"><img src="/folder" style="margin-right:5px" height="20"></img>'+diretorio+'</a></td>'+
					'<td>--</td>'+opcao+'</tr>')
				}
				if(song)$("#"+song).show();
			});
		}else voltar();
	}
}
function adicionar(){
	$.getJSON('/dialog');
	if(Menu)menu();
}

function OpenWindow(url)
     {
        config=""
        config+="toolbar=no,";
        config+="resizable=yes," 
        config+="scrollbars=yes,"
        config+="width=740,"
        config+="height=400"
        var window=open(url,"",config);
        window.focus();
     }

function midia(tipo, id, nome){
    if(tipo == 1 || tipo == 4){
		audio(id);
		document.title = nome;
		tocar_todas = false;
	}
    if(tipo == 2 || tipo == 3){
        OpenWindow("../abrir/"+id);
        if(tipo == 2 && player !='')player.pause();
    }
    if(tipo > 4)OpenWindow(((host)?"../ab/"+id : "../abrir/"+id))
}
function excluir(id, nome){
	var pergunta = confirm("Deseja excluir o arquivo '"+nome+"' da lista?")
	if(pergunta){
		excluir_fav(id, "", false)
		var xhr = new XMLHttpRequest();
        xhr.open("delete", '/', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "id": id
        }));
		xhr.response;
		resetar = true;
		if(tipo_id > 0)tipo(tipo_id, tipo_nome);
		else todos();
	}
}
var id_editado = 0;
var input_nome = document.getElementById("nome_arquivo");
var input_local = document.getElementById("local_arquivo");
	
function editar(id){
	$('#main').hide();
	$('#update').show();
	
	$.getJSON("/show/"+id , function(data) {
		input_nome.value = decodeURI(data[0].nome);
		input_local.value = decodeURI(data[0].local)
	});
	id_editado= id;
}
function salvar(){
	var tipo_update = input_local.value.split('.');
	tipo_update = tipo_update[tipo_update.length-1];
	
	var xhr = new XMLHttpRequest();
        xhr.open("put", '/' +id_editado, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
			"nome": encodeURI(input_nome.value),
			"local": encodeURI(input_local.value),
			"tipo" : tipo_update
        }));
		xhr.response;
	if(tipo_id > 0)tipo(tipo_id, tipo_nome);
	else todos();
	
    $('#main').show();
	$('#update').hide();
	id_editado = 0;
}
function cancelar(){
	input_local.value = "";
	input_nome.value = "";
	$('#main').show();
	$('#update').hide();
	id_editado = 0;
}
function voltar(){
	PastaAberta = false;
	if(tipo_id > 0)tipo(tipo_id, tipo_nome);
	else todos();
};
var Menu = true;
function menu(){
	if(window.innerWidth < 767 && Menu){
		$('#menu').hide();
		Menu = false;
	}else{
		$('#menu').show();
		Menu = true;
	}
}
menu();

$(window).resize(function() {
	if(window.innerWidth < 767){
		$('#menu').hide();
		Menu = false;
	}else{
		$('#menu').show();
		Menu = true;
	}
});