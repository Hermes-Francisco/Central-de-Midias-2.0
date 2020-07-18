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
		sql.query('insert into playlist_has_midia (playlist, midia) values ("'+playlist+'","'+midia+'")', (err, r) => {
            if(err)throw err;
            return res(r);
        });
	}
//
    content(id, res){
        sql.query('select id, nome, local, tipo from arquivo where id in (select midia as "id" from playlist_has_midia where playlist = '+id+')', (err, r) => {
            if(err)throw err;
            return res(r);
        })        
    }

    show(id, res){
        sql.query('select id, nome from playlist where id="'+id+'"', (err, r) => {
            if(err)throw err;            
            return res(r);
        });
    }
	clear(){
		sql.query('delete from playlist_has_midia where midia not in (select id as "midia" from arquivo)');
	}
    
}
module.exports = new Playlist();