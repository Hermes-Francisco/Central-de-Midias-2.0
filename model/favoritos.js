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
        sql.query('SET @num = (SELECT COUNT(*) FROM favoritos) + 1;')
        sql.query('INSERT INTO favoritos (midia, numero) VALUES'
                +'('+midia+', @num);', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }

    update(midia, numero_novo, res){
        sql.query('SET @alterar = '+midia+';')
        sql.query('SET @novo = '+numero_novo+';')
        sql.query('SET @velho = (SELECT numero FROM favoritos WHERE midia = @alterar);')
        sql.query('UPDATE favoritos SET numero = numero -1 WHERE numero > @velho;')
        sql.query('UPDATE favoritos SET numero = numero +1 WHERE numero >= @novo;')
        sql.query('UPDATE favoritos SET numero = @novo WHERE midia = @alterar;', (err, r) =>{
                     if(err)throw err;
                     return res(r);
                 });
    }

    delete(midia, res){
        sql.query('SET @deletar ='+midia+';')
        sql.query('SET @velho = (SELECT numero FROM favoritos WHERE midia = @deletar);')
        sql.query('UPDATE favoritos SET numero = numero - 1 WHERE numero > @velho;')
        sql.query('DELETE FROM favoritos WHERE midia = @deletar;', (err, r) =>{
                    if(err)throw err;
                    return res(r);
                 });
    }
    
    counter(res){
        sql.query('select count(*) as "quantidade" from favoritos', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }
    check(midia, res){
        sql.query('select a.nome, f.numero from favoritos f join arquivo a where f.midia = '+midia+' and a.id = '+midia, (err, r) => {
            if (err)throw err;
            return res(r);
        })
    }
}
module.exports = new Favoritos();