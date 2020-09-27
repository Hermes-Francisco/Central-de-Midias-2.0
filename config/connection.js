const shell = require('shelljs');
const mysql = require('mysql');
class Connection{

    // Configurações da conexão:
    
    host = 'localhost';
    user =  'root' ;
    password = "";
    database = 'midias2';

    constructor(){
       
        this.sql = mysql.connection = mysql.createConnection({
            host : this.host,
            user: this.user,
            password : this.password,
            database : this.database
        });

        this.sql.connect((err) => {
            if(err){
                if(err.code == 'ECONNREFUSED')console.log('Erro: Inicie o MySql');
                if(err.code == 'ER_BAD_DB_ERROR'){
                    shell.exec('start mysql --user="'+this.user+'" --password="'+this.password+'" -e "source ./config/database.sql"');
                    console.log('reinicie a aplicação');
                }
                process.exit();
            }else shell.exec('start http://localhost:3000')
        });
    }    
}
module.exports = new Connection().sql;