const sql = require('../config/connection');

class Playlist{

    index(res){
        sql.query('select id, nome from playlist order by nome', (err, r) => {
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
        sql.query('select p.numero as numero, '+
                         'a.id as id, '+
                         'a.nome as nome, '+
                         'a.local as local, '+
                         'a.tipo as tipo '+
                 'from arquivo a inner join playlist_has_midia p on p.playlist = '+id+' order by p.numero', 
        (err, r) => {
            if(err)throw err;
            return res(r);
        })        
    }

    show(id, res){
        sql.query('select id, nome from playlist where id="'+id, (err, r) => {
            if(err)throw err;            
            return res(r);
        });
    }

    check(nome, res){
        sql.query('select id from playlist where nome="'+nome, (err, r) => {
            if(err)throw err;            
            return res(r);
        });
    }

    remove(playlist, midia, res){
        sql.query('delete from playlist_has_midia where midia = '+midia+' and playlist = '+playlist+'')
    }

    delete(playlist, res){
        sql.query('delete from playlist_has_midia where playlist = '+playlist, (err, r) => {
            if(err)throw err;
            sql.query('delete from playlist where id = '+playlist, (err, response) => {
                if(err)throw err;
                return res(response);
            })
        })
    }
	clear(){
		sql.query('delete from playlist_has_midia where midia not in (select id as "midia" from arquivo)');
	}
    
}
module.exports = new Playlist();