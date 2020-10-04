function fav_list(){
    $.getJSON("/favoritos", function(data) {
        for(i = 0; i < data.length; i++){
            
            var interno = 'excluir_fav('+data[i].id+', "'+decodeURI(data[i].nome)+'")'
            var opcao = "<a href='#' onclick='"+interno+"'><img src='/lixeira' style='margin-left:5px' height='20'></img></a></td>"
            var nome = "'"+decodeURI(data[i].nome)+"'"
    
            $('#lista').append('<tr><td><a href="#" onclick="midia(1,'+data[i].id+', '+nome+')">'+
            '<img src="/icone" style="display: none; margin-right: 5px;" class="playing" id="'+data[i].id+'" height="15px"></img>'+
            decodeURI(data[i].nome)+'</a></td>'
            +opcao+'</tr>');
        }
        if(song)$("#"+song).show();
    });
}