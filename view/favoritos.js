function fav_list(){
    document.getElementById('lista_fav').innerHTML = " ";
    $.getJSON("/favoritos", function(data) {
        for(i = 0; i < data.length; i++){
            
            var interno = 'excluir_fav('+data[i].id+', true)'
            var opcao = "<a href='#' onclick='"+interno+"'><img src='/lixeira' style='margin-left:5px' height='20'></img></a></td>"
    
            $('#lista_fav').append('<tr><td><img src="/icone" style="display: none; margin-right: 5px;" class="playing" id="f'+data[i].id+'" height="15px"></img>'
            +'<text align="right" id="fav'+data[i].id+'"><a href="#" onclick="fav_order('+data[i].id+', '+data[i].numero+')">'+data[i].numero+'</a></text></td>'
            +'<td><a href="#" onclick="fav_midia('+data[i].id+')">'+
            decodeURI(data[i].nome)+'</a></td><td>'
            +opcao+'</td></tr>');
        }
        if(song)$("#f"+song).show();
    });
}

function excluir_fav(id, origem){
    var msg = ["Deseja remover o arquivo "," dos favoritos?"]
		$.getJSON("/show/"+id, (data) => {
            if(origem)var pergunta = confirm(msg[0]+decodeURI(data[i].nome)+msg[1]);
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
                fav_check(id)
            }
        });
}
var ordenando = false;
var fav_number = false;
function fav_order(id,numero){
    $.getJSON('/favoritos/count', function(data){
        if(data[0].quantidade > 1 && !ordenando){
            ordenando = id;
            fav_number = numero;
            document.getElementById('fav'+id).innerHTML = "<form onsubmit='reordenar("+id+")' id='posicao' align='center'>"
            +'<input type="number" id="ordem" min="1" max="'+data[0].quantidade+'" value = "'+numero+'"></input></form>';
            document.getElementById("posicao").addEventListener('submit', prevent);
        
        }else if(data[0].quantidade > 1 && ordenando){

            document.getElementById('fav'+ordenando).innerHTML = '<a href="#" onclick="fav_order('+ordenando+', '+fav_number+')">'+fav_number+'</a>';
            ordenando = false;
            fav_number = false;
            fav_order(id, numero);
       
        }
    });
}

function reordenar(id){
    var xhr = new XMLHttpRequest();
        xhr.open("put", '/favoritos/' +id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
			"numero_novo": $('#ordem').val()
        }));
        xhr.response;
        fav_list()
        if(!randomizado)un_random()
}

function fav_add(midia){
    var xhr = new XMLHttpRequest();
    xhr.open("post", '/favoritos', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "midia": midia
    }));
    xhr.response;
    fav_check(midia)
}
function fav_check(midia){
    $.getJSON('/favoritos/check/'+midia, function(data){
        var fav_interno = false;
        if (data[0]) fav_interno = "'"+decodeURI(data[0].nome)+"'"
        var retorno = ((!data[0])?'<a href="#" onclick="fav_add('+midia+')"><img src="/buttons/addfavorito" height = "20"></a>':
                           '<a href="#" onclick="excluir_fav('+midia+', '+fav_interno+', true)"><img src="/buttons/removefavorito" height = "20"></a>')
        document.getElementById("fav_icon"+midia).innerHTML = retorno;
    })
}
function fav_show(ativar){
    if(ativar){
        $("#mini-player").show();
        $('#favoritos').show();
        $("#detalhes").hide();
        $("#show_detalhes").hide();
        $("#fav_button").hide();
		fav_list()
    }else{
        $('#favoritos').hide();
        $("#mini-player").hide();
        $("#show_detalhes").show();
        $("#detalhes").show();
        $("#fav_button").show();
    }
}