const fs = require('fs');
const withAuth = require('../withAuth');
const slug = require('slug');
const parseurl = require('parseurl');

module.exports = (app, db) => {
    const TintinModel = require('../models/TintinModel')(db);

    app.get('/test/movie', (req, res) => {
        console.log(slug('Tintin à l\'Ouest d\'Eden', '_'))
        res.status(200).json({
            status: 1,
            msg: "Welcome to endpoint movies test"
        })
    })




    app.get('/api/movies', async (req, res) => {
        let tintinsAll = await TintinModel.getAllMovies();

        if (tintinsAll.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: tintinsAll
            })
        } else {
            res.status(200).json({
                status: 200,
                results: tintinsAll
            })
        }
    })

    app.get('/api/movies/:name', async (req, res) => {
        let name = req.params.name;
        let tintinName = await TintinModel.getMovieByName(name);
        console.log(tintinName)
        // affiche l'élément de l'url pathname : api/tintins/5
        //console.log(parseurl(req).pathname)

        if (tintinName.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: tintinName
            })
        } else {
            res.status(200).json({
                status: 200,
                results: tintinName
            })
        }


    })

    app.get('/api/v1/movies/:id', async (req, res) => {
        const id = req.params.id;
       let tintinId = await TintinModel.getOneMovie(id);
        console.log(tintinId)
        // affiche l'élément de l'url pathname : api/tintins/name
        console.log(parseurl(req).pathname)

        if (tintinId.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: tintinId
            })
        } else {
            res.status(200).json({
                status: 200,
                results: tintinId
            })
        }

        
    })

    app.get('/api/v1/movie', async(req, res) => {
        let queryParameter = req.query;
        //console.log(queryParameter.title)
        let queryParameterTitle = queryParameter.title;

        console.log(queryParameterTitle)
        let tintin = await TintinModel.getMovieByName(queryParameterTitle)
        console.log(tintin)

        if (tintin.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: tintin
            })
        } else {
            res.status(200).json({
                status: 200,
                results: tintin
            })
        }
    })

    app.get('/api/v1/movie/rating', async (req, res) => {
        const tintinsRate = await TintinModel.getMovieRate();
        console.log(tintinsRate)

        if (tintinsRate.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: tintinsRate
            })
        } else {
            res.status(200).json({
                status: 200,
                results: tintinsRate
            })
        }
    })

    app.put('/api/v1/movie/update/:id', async (req, res) => {
        const id = req.params.id;
        let movie = await TintinModel.updateOneMovie(req, id);

        if (movie.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Modification failed',
                results: movie
            })
        } else {
            res.status(200).json({
                status: 200,
                msg: 'The change was successfully',
                results: movie
            })
        }

    })

    app.delete('/api/v1/movie/delete/:id', async (req, res) => {
        const id = req.params.id;
        let movie = await TintinModel.getOneMovie(id)
        console.log(movie)

        let movieDelete = await TintinModel.deleteOneMovie(id)
        console.log(movie)
        if (movieDelete.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Deletion failed',
                results: movie
            })
        } else {
            res.status(200).json({
                status: 200,
                msg: `The movie ${movie[0].title}, has been deleted`,
                results: movie
            })
        }

    })





}