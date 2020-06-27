const bcrypt = require('bcryptjs');

class pc_auth{
    async code(req, res, auth){
        const { login, senha } = req.params;
        auth(await bcrypt.hash(login + senha, 8));
        return res.json({"mensagem":"ok"});
    }
    async check(req, res){
        const { login, senha } = req.params;
        return res.json({"code" : await bcrypt.hash(login + senha, 8)});
    }
}
module.exports = new pc_auth();