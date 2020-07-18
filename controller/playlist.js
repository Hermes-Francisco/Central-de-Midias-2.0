const Playlist = require('../model/playlist');
const Tipo = require('../model/tipo');
const shell = require('shelljs')

class PlaylistController{

    index(req, res){
        Playlist.index((r) => {
            return res.json(r);
        });
    }
    /*search(req, res){
        const { query } = req.params;
        Arquivo.like(query, (r) => {
            return res.json(r);
        })
    }*/

    show(req, res){
        const { id } = req.params;
        Playlist.show(id, (r) => {
            return res.json(r);
        })
    }

    store(req, res){
        let { nome } = req.body;

        Playlist.check(nome, (lista)=>{
            if(!lista[0]){
                Playlist.store(nome, (r)=>{
                    return res.json(r);
                });
            }else return res.status(400).json({erro: 'Playlist já existe'})
        });

    }
//Parei aqui
    update(req, res){
        const { id } = req.params;
        let { nome, local, tipo } = req.body;
		tipo = tipo.toLowerCase();
		local = local.toLowerCase();
		
		Tipo.showId(tipo, (resposta) => {
            if(resposta[0]){
                Arquivo.update(id, nome, local, resposta[0].id);
				Tipo.clear();				
            }else{ 
			    Tipo.store(tipo, (r) => {
                 Arquivo.update(id, nome, local, r.insertId);
				})
				Tipo.clear();
			}
        })
		
		return res.status(200).json({"id":id});
    }
    delete(req, res){
        const { id } = req.body;
        Arquivo.delete(id, (r) => {
			Tipo.clear();
            return res.json(r)
        });
    }
}

module.exports = new PlaylistController();