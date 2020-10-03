const Favorito = require('../model/favoritos')
const shell = require('shelljs')

class FavoritoController{

    index(req, res){
        Favorito.index((r) => {
            return res.json(r);
        });
    }
    random(req, res){
        Favorito.random((r) => {
            return res.json(r);
        });
    }

    store(req, res){
        const { midia } = req.body;
        Favorito.store(midia, (r) => {
            return res.json(r);
        })
    }

    update(req, res){
        const { midia } = req.params;
        const { numero_novo } = req.body;
		Favorito.update(midia, numero_novo, (r) => {
            return res.json(r);
        })
    }
    delete(req, res){
        const { midia } = req.body;
        Favorito.delete(midia, (r) => {
            return res.json(r)
        });
    }
    counter(req, res){
        Favorito.counter((r)=>{
            return res.json(r);
        })
    }
}

module.exports = new FavoritoController();