const bcrypt = require('bcryptjs');
var IP = require('ip');

class pc_auth{
    async code(req, res, auth){
        const { login, senha } = req.params;
        var log = '"'+login+senha+'"'
        auth(await bcrypt.hash(log, 8));
        return res.json({"mensagem":"ok", "ip": IP.address()});
    }
    
    async check(req, res, code, auth){
        const { login, senha } = req.params;
        var newCode;
        var log = '"'+login+senha+'"'

        if(isNaN(code)){
            if(bcrypt.compare(log, code)){
                newCode = Date.now();
                res.json({"code":newCode});
                return auth(newCode);
            }else res.json({"code": "1"});
        }else{
            res.json({"code": "1"});
            return auth(0);
        } 
    }
}
module.exports = new pc_auth();