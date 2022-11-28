const fs = require('fs');
const { withAuth } = require('../middlewares/withAuth');
const slug = require('slug')


module.exports = (app, db) => {
    const TintinModel = require('../models/TintinModel')(db);
    const FavorisModel = require('../models/FavorisModel')(db);
    const UserModel = require('../models/UserModel')(db);

    // route de suppression d'un film en favoris pour utilisateur
    app.delete('/api/user/favories_delete/:id', withAuth, deleteFavoriesByIdUser)
    // route pour poster un film dans sa liste de favoris en tant que utilisateur connecté
    app.post('/api/v1/favories', withAuth, postSaveMovieFavories)
    // route de suppression d'un film en favoris pour administrateur
    app.delete('/api/v1/favories_delete/:id', withAuth, deleteFavoriesByIdAdmin)


    async function postSaveMovieFavories(req, res) {
        // console.log('ajout favoris', req.id);
        //console.log(req.body.movieTitle);
        const titleMovie = req.body.movieTitle;
        // console.log('id du film en question', req.body.id);
        const userId = req.id;
        const tintinId = req.body.id;
        let MovieIdFavoris = await FavorisModel.getOneMovieListFavoris(userId, tintinId)
        // console.log('Packet row :', MovieIdFavoris);
        if (MovieIdFavoris.length > 0) {
            res.status(404).json({
                status: 404,
                msg: 'Movie already exists in your favories'
            })

        } else {
            let AddListFavoris = await FavorisModel.saveOneMovieToFavoris(userId, tintinId);
            console.log(AddListFavoris);
            if (AddListFavoris.code) {
                res.json({ status: 500, msg: 'il y a eu un problème !', result: AddListFavoris });
                console.log('Houston...We have a problem ..');
            }
            res.json({ status: 200, msg: `The movie ${titleMovie} has been registered in Favourite Liste `, result: AddListFavoris });
            console.log('succeded mission');

        }

    }

    async function deleteFavoriesByIdAdmin(req, res) {
        const tintinId = req.params.id;
        console.log(req.body);
        console.log('id user', req.id);
        let user = await UserModel.getRoleUser(req.id)
        console.log(user[0].role);
        if (user[0].role === 'admin') {
            console.log('je suis admin ou user');
            let deleteMovie = await FavorisModel.deleteOneMovieFavories(req.id, tintinId);
            console.log(deleteMovie);
            if (deleteMovie.code) {
                res.json({ status: 500, msg: 'il y a eu un problème !', result: deleteMovie });
            } else {
                res.json({ status: 200, msg: `le film  a bien été supprimé`, result: deleteMovie });
            }

        } else {
            console.log('je ne suis pas admin ou user');
            res.json({ status: 403, msg: `Vous n'avez pas de droits pour la suppression`, result: deleteMovie });
        }
    }

    async function deleteFavoriesByIdUser(req, res) {
        const tintinId = req.params.id;
        console.log(tintinId);
        console.log(req.body);
        console.log('id user', req.id);
        let user = await UserModel.getRoleUser(req.id)
        console.log(user[0].role);
        if (user[0].role === 'user') {
            console.log(`je suis  ${user[0].role}`);
            let deleteMovie = await FavorisModel.deleteOneMovieFavories(req.id, tintinId);
            console.log(deleteMovie);
            if (deleteMovie.code) {
                res.json({ status: 500, msg: 'il y a eu un problème !', result: deleteMovie });
            } else {
                res.json({ status: 200, msg: `le film  a bien été supprimé`, result: deleteMovie });
            }

        } else {
            console.log('je ne suis pas admin ou user');
            res.json({ status: 403, msg: `Vous n'avez pas de droits pour la suppression`, result: deleteMovie });
        }
    }

}






