const fs = require('fs');
const withAuth = require('../withAuth');
const slug = require('slug')


module.exports = (app, db) => {
    const AuthorModel = require('../models/AuthorModel')(db);

    app.get('/test/author', (req, res) => {
        console.log(slug('Herge à l\'Ouest d\'Eden', '_'))
        res.status(200).json({
            status: 1,
            msg: "Welcome to endpoint author test"
        })
    })


    app.get('/api/herges', async (req, res) => {
        let hergeAll = await AuthorModel.getAllHerge();
        console.log(hergeAll)

        if (hergeAll.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: hergeAll
            })
        } else {
            res.status(200).json({
                status: 200,
                results: hergeAll
            })
        }
    })

    app.get('/api/herges/:id', async (req, res) => {
        const id = req.params.id
        let hergeId = await AuthorModel.getOneHerge(id);
        console.log(hergeId)

        if (hergeId.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: hergeId
            })
        } else {
            res.status(200).json({
                status: 200,
                results: hergeId
            })
        }
    })



}