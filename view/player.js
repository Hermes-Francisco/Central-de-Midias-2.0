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
function audio(id){
	$(".playing").hide();
	$("#"+id).show();
    song = id;
    last = id;
	
    player.src = '../abrir/'+id;
    
    player.onended = ()=>{
		$(".playing").hide();
		document.title = 'Central de Mídias'
        numero = 0;
        song = false;
        playing = false;

        if(tocar_todas){
            proxima = midias[last] + 1;
            audio(midias_num[proxima])
        }
    }
}

function play(){
    if(!playing){
        if(last == 0)audio(midias_num[0]);
        else audio(last);
        tocar_todas = true;
    }else if(playing=="pause")player.play();
    else player.pause()
}

player.onplaying = () =>{
    play_button.innerHTML = "pause";
    playing = true;
}

player.onpause = () => {
    play_button.innerHTML = "play";
    playing = "pause";
}