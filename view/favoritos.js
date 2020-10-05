function fav_list(){
    document.getElementById('lista_fav').innerHTML = " ";
    $.getJSON("/favoritos", function(data) {
        for(i = 0; i < data.length; i++){
            
            var interno = 'excluir_fav('+data[i].id+', "'+decodeURI(data[i].nome)+'", true)'
            var opcao = "<a href='#' onclick='"+interno+"'><img src='/lixeira' style='margin-left:5px' height='20'></img></a></td>"
            var nome = "'"+decodeURI(data[i].nome)+"'"
    
            $('#lista_fav').append('<tr><td><img src="/icone" style="display: none; margin-right: 5px;" class="playing" id="'+data[i].id+'" height="15px"></img>'+data[i].numero+'</td>'
            +'<td><a href="#" onclick="midia(1,'+data[i].id+', '+nome+')">'+
            decodeURI(data[i].nome)+'</a></td>'
            +opcao+'</tr>');
        }
        if(song)$("#"+song).show();
    });
}

function excluir_fav(id, nome, origem){
    if(origem)var pergunta = confirm("Deseja remover o arquivo '"+nome+"' dos favoritos?");
    else pergunta = true;
	if(pergunta){
		var xhr = new XMLHttpRequest();
        xhr.open("delete", '/favoritos', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "midia": id
        }));
        xhr.response;
        fav_list();

	}
}