var midias = [];
var midias_num = [];

var tocar_todas = true; 

var playing = false;
var last = 0;
var num = 0;
var timer = false;
var proxima; 

var fav_playing = false;
var fav_playing2 = false;
var randomizado = false;

function fav_midia(id){
    if(!fav_playing){
        $.getJSON(((randomizado)?"/favoritos/random":"/favoritos"), function(data) {
            midia_reset();
            for(i = 0; i < data.length; i++){
               addMidia(data[i].id)
            }
            fav_playing = true;
            setTimeout(()=>{
            }, 1000)
        })
    }
    fav_playing2 = true;
    audio(id);
}

function audio(id){
    if(fav_playing2){
        fav_playing2 = false;
        audio1(id);
    }else{
        if(fav_playing){
            var pergunta = confirm("Deseja sair da playlist de favoritos?");
            if(pergunta){
                fav_playing = false;
                if(randomizado)random();
                else un_random();
                setTimeout(()=>{
                    audio1(id)
                }, 1000)
                $("#all_fav").show();
            }
        }else audio1(id)
    }
}

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
    $.getJSON(((fav_playing)?"/favoritos/random":"/random/musicas"), function(data) {
        midia_reset();
        for(i = 0; i < data.length; i++){
           addMidia(data[i].id)
        }
        show_hide()
    })
}
function un_random(){
    $.getJSON(((fav_playing)?"/favoritos":"/arquivos/tipo"), function(data) {
        midia_reset();
        for(i = 0; i < data.length; i++){
            if(!fav_playing){
                if(data[i].tipo == 1 || data[i].tipo == 4) addMidia(data[i].id)
            }else addMidia(data[i].id);
        }
        show_hide()
    })
}

const player = document.getElementById('player');
const play_button = document.getElementById('play-button');
const song_title = document.getElementById('song-title');
const song_detalhes = document.getElementById('song-title-detalhes');

const all_check = document.getElementById('all');

function audio1(id){

	$(".playing").hide();
    $("#"+id).show();
    $("#f"+id).show();
    song = id;
    last = id;

    show_hide();
	
	$.getJSON("/show/"+id, (data) => {
        if(data[0]){
		    document.title = decodeURI(data[0].nome);
		    song_title.innerHTML = decodeURI(data[0].nome);
            song_detalhes.innerHTML = "<text id = 'fav_icon"+id+"'></text>"+decodeURI(data[0].nome);
            fav_check(id)
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
    fav_playing2 = fav_playing
    if(midias[last] + 1 < num){
        proxima = midias[last] + 1;
        audio(midias_num[proxima])
    }else last = 0;
};
function play_prev(){
    fav_playing2 = fav_playing
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
    if(fav_playing)$("#all_fav").hide();
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
    all_check.checked = true;
    fav_playing = false;
    fav_playing2 = false;

    if(randomizado)random();
    else un_random();
    setTimeout(()=>{
        play()
    }, 1000)
}

function Tocar_todas_fav(){
    all_check.checked = true;
    fav_playing = true;
    fav_playing2 = true;
    if(randomizado)random();
    else un_random();
    setTimeout(()=>{
        stop();
        play();
    }, 1000)
}

$('#all').change(function() {
    console.log("change")
    tocar_todas = this.checked;
})
$('#randomizar').change(function() {
    if(this.checked)random();
    else un_random();
    randomizado = this.checked;
})
function stop(){
    
    player.src = "";
    playing = false;

    $("#prev").hide();
    $("#next").hide();
    $("#stop").hide();
    $("#atalho").show();
    $("#all_fav").show();
    $("#Reproduzindo").hide();

    play_button.src = "/buttons/play";

    last = 0;
}
all_check.checked = true;