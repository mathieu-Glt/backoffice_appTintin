const fs = require('fs');
const withAuth = require('../withAuth');
const slug = require('slug')


module.exports = (app, db) => {
    const TintinModel = require('../models/TintinModel')
    const FavorisModel = require('../models/FavorisModel')

    app.get('/test/favories', (req, res) => {
        console.log(slug('Character à l\'Ouest d\'Eden', '_'))
        res.status(200).json({
            status: 1,
            msg: "Welcome to endpoint favories test"
        })
    })

    app.post('/api/favoris/movie/:id',  async (req, res) => {
        let id= req.params.id
        let movie = await TintinModel.getOneMovie(id)
        let favoris = await FavorisModel.saveOneMovieToFavoris(user_id, id)
    })



}