const sql = require('../config/connection');

class Favoritos{

    index(res){
        sql.query('select a.nome, a.id, f.numero from arquivo a join favoritos f WHERE a.id = f.midia order by f.numero', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }
    store(midia, res){
        sql.query('SET @num = (SELECT COUNT(*) FROM favoritos) + 1;'
                 +'INSERT INTO favoritos (midia, numero) VALUES'
                 +'('+midia+', @num);', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }

    update(midia, numero_antigo, numero_novo){
        sql.query('SET @novo ='+numero_novo+';'
                 +'SET @velho ='+numero_antigo+';'
                 +'UPDATE favoritos SET numero = numero -1 WHERE numero > @velho;'
                 +'UPDATE favoritos SET numero = numero +1 WHERE numero >= @novo;'
                 +'UPDATE favoritos SET numero = @novo WHERE id ='+midia+';');
    }

    delete(midia){
        sql.query('SET @deletar ='+midia+';'
                 +'SET @velho = (SELECT numero FROM favoritos WHERE id = @deletar);'
                 +'UPDATE favoritos SET numero = numero - 1 WHERE numero > @velho;'
                 +'DELETE FROM favoritos WHERE id = @deletar;'
                 +'+SELECT * FROM favoritos;');
    }

	clear(){
		sql.query('delete from tipo where id not in (select tipo from arquivo) AND id > 4');
	}
    
}
module.exports = new Favoritos();