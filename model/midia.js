const sql = require('../config/connection');

class Midia{

    store(nome, local, tipo, res){
        local = local.toLowerCase();
        sql.query('insert into arquivo (nome, local, tipo) values ("'+nome+'", "'+local+'",'+tipo+')', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }

    index(tipo, res){
        sql.query('select id, nome, local, tipo from arquivo where tipo = ' + tipo +' order by nome', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }

    random(res){
        sql.query('select id from arquivo where tipo = 1 or tipo = 4 order by RAND()', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }

    like(nome, res){
        nome = encodeURI(nome);
        sql.query('select id, nome, local, tipo from arquivo where nome like "%' + nome +'%" order by nome', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }
    like_folder(local, tipo, res){
		local = encodeURI(local);
        sql.query('select id, nome, local, tipo from arquivo where local like "%/' + local +'/%"'+
		' and local not like "%/' + local +'/%/%" and tipo='+tipo+' order by nome', (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }
	
	index_folder(tipo, res){
        sql.query("SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(`local`, '/', -2),'/',1) AS 'local' FROM arquivo WHERE tipo="+tipo+" ORDER BY local", (err, r) => {
            if(err)throw err;
            return res(r);
        });
	}

    show(id, res){
        sql.query('select nome, local from arquivo where id='+id, (err, r) => {
            if(err)throw err;
            return res(r);
        });
    }

    check(local, res){
        local = local.toLowerCase();
        sql.query('select id from arquivo where local = "'+local+'"', (err, r) => {
            if(err)throw err;
            return res(r);
        })
    }

    update(id, nome, local, tipo){
        sql.query('UPDATE arquivo SET nome = "'+nome+'", local = "'+local+'", tipo='+tipo+' WHERE id='+id, (err, r) => {
            if(err)throw err;
			return r;
        })
    }

    delete(id, res){
        sql.query('delete from arquivo where id ='+id, (err, r) => {
            if(err)throw err;
            return res(r);
        })
    }
}
module.exports = new Midia();