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

const player = document.getElementById('player');
const play_button = document.getElementById('play-button');
const song_title = document.getElementById('song-title');
const song_detalhes = document.getElementById('song-title-detalhes');

function audio(id){
	$(".playing").hide();
	$("#"+id).show();
    song = id;
    last = id;
	
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

function play(){
    if(!playing && midias.length > 0){
        if(last == 0)audio(midias_num[0]);
        else audio(last);
        tocar_todas = true;
    }else if(playing=="pause")player.play();
    else player.pause()
}

player.onplaying = () =>{
    play_button.src = "/buttons/pause";
    playing = true;
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