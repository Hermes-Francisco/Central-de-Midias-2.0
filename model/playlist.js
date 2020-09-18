const sql = require('../config/connection');

class Playlist{

    index(res){
        sql.query('select nome, id from playlist order by nome', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }

    store(nome, res){
        sql.query('insert into playlist (nome) values ("'+nome+'")', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }
	
	add(playlist, midia, res){
		sql.query('insert into playlist_has_midia (playlist, midia)')
	}
//
    show(id, res){
        sql.query('select nome from tipo where id='+id, (err, r) => {
            if(err)throw err;
            return res(r);
        })        
    }

    showId(tipo, res){
        sql.query('select id from tipo where nome="'+tipo+'"', (err, r) => {
            if(err)throw err;            
            return res(r);
        });
    }
	clear(){
		sql.query('delete from tipo where id not in (select tipo from arquivo) AND id > 4');
	}
    
}
module.exports = new Playlist();