var midias = [];
var midias_num = [];
var playlist = [];

var tocar_todas = false; 

var playing = false;
var last = 0;
var num = 0;
var timer = false;
var proxima; 

function addMidia(id){
    if(!(id in midias)){
    midias[id] = num;
    midias_num[num] = id;
    num++;
       
    }
    /*if(!timer){
        timer = true;
        setTimeout(()=>{console.log(num); timer=false}, 3000);
    }*/
}

function midia_reset(){
    midias = [];
    midias_num = [];
    num = 0;
}

function random(){
    $.getJSON("/random/musicas", function(data) {
        midia_reset();
        for(i = 0; i < data.length; i++){
           addMidia(data[i].id)
        }
    })
}
function un_random(){
    $.getJSON("/arquivos/tipo", function(data) {
        midia_reset();
        for(i = 0; i < data.length; i++){
            if(data[i].tipo == 1 || data[i].tipo == 4) addMidia(data[i].id)
        }
    })
}

const player = document.getElementById('player');
const play_button = document.getElementById('play-button');
const song_title = document.getElementById('song-title');
const song_detalhes = document.getElementById('song-title-detalhes');

const all_check = document.getElementById('all');

function audio(id){
	$(".playing").hide();
	$("#"+id).show();
    song = id;
    last = id;

    show_hide();
	
	$.getJSON("/show/"+id, (data) => {
        if(data[0]){
		    document.title = decodeURI(data[0].nome);
		    song_title.innerHTML = decodeURI(data[0].nome);
            song_detalhes.innerHTML = decodeURI(data[0].nome);
        }else play_next();
	})
	
    player.src = '../abrir/'+id;
    
    player.onended = ()=>{
		$(".playing").hide();
		document.title = 'Central de Mídias'
        numero = 0;
        song = false;
        playing = false;
        $("#Reproduzindo").hide();

        if(tocar_todas){
			play_next();
		}
    }
}

function play_next(){
    if(midias[last] + 1 < num){
        proxima = midias[last] + 1;
        audio(midias_num[proxima])
    }else last = 0;
};
function play_prev(){
    if(midias[last] - 1 >= 0){
        proxima = midias[last] - 1;
        audio(midias_num[proxima])
    }else last = 0;
}

function show_hide(){
    if(midias[last]-1 >= 0)$("#prev").show();
    else $("#prev").hide();
    if(midias[last]+1 < num)$("#next").show();
    else $("#next").hide();
}

function play(){
    if(!playing && midias.length > 0){
        if(last == 0)audio(midias_num[0]);
        else audio(last);
    }else if(playing=="pause")player.play();
    else player.pause()
}

player.onplaying = () =>{
    play_button.src = "/buttons/pause";
    playing = true;
    $("#Reproduzindo").show();

    $("#stop").show();
    $("#atalho").hide();
}

player.onpause = () => {
    play_button.src = "/buttons/play";
    playing = "pause";
}
function controles(ativar){
    if(ativar){
        $("#corpo").hide();
        $("#mini-player").hide();
        $("#detalhes").show();
    }else{
        $("#corpo").show();
        $("#mini-player").show();
        $("#detalhes").hide();
    }
}
function Tocar_todas(){
    all_check = true;
    
    play();
}
$('#all').change(function() {
    tocar_todas = this.checked;
})
function stop(){
    tocar_todas = false;
    player.src = "";
    playing = false;

    $("#prev").hide();
    $("#next").hide();
    $("#stop").hide();
    $("#atalho").show();
    $("#Reproduzindo").hide();

    play_button.src = "/buttons/play";

    last = 0;
}