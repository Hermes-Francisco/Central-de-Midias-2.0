const sql = require('../config/connection');

class Favoritos{

    index(res){
        sql.query('select a.nome, a.id, f.numero from arquivo a join favoritos f WHERE a.id = f.midia order by f.numero', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }
    random(res){
        sql.query('select a.nome, a.id, f.numero from arquivo a join favoritos f WHERE a.id = f.midia order by RAND()', (err, r) => {
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

    update(midia, numero_novo, res){
        sql.query('SET @alterar = '+midia+';'
                 +'SET @novo = '+numero_novo+';'
                 +'SET @velho = (SELECT numero FROM favoritos WHERE midia = @alterar);'
                 +'UPDATE favoritos SET numero = numero -1 WHERE numero > @velho;'
                 +'UPDATE favoritos SET numero = numero +1 WHERE numero >= @novo;'
                 +'UPDATE favoritos SET numero = @novo WHERE midia = @alterar;', (err, r) =>{
                     if(err)throw err;
                     return res(r);
                 });
    }

    delete(midia, res){
        sql.query('SET @deletar ='+midia+';'
                 +'SET @velho = (SELECT numero FROM favoritos WHERE midia = @deletar);'
                 +'UPDATE favoritos SET numero = numero - 1 WHERE numero > @velho;'
                 +'DELETE FROM favoritos WHERE midia = @deletar;'
                 +'+SELECT * FROM favoritos;', (err, r) =>{
                    if(err)throw err;
                    return res(r);
                });
    }
    
    counter(res){
        sql.query('select count(*) from favoritos', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }
}
module.exports = new Favoritos();