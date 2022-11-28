const fs = require('fs');
const withAuth = require('../middlewares/withAuth');
const slug = require('slug')


module.exports = (app, db) => {
    const AuthorModel = require('../models/AuthorModel')(db);

    // route pour récupérer tous les données sur  Herge
    app.get('/api/herges', getAllHerge)
    // route pour récupérer un seul auteur Herge
    app.get('/api/herges/:id', getHergeById)

    async function getAllHerge(req, res) {
        try {
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
    
            
        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({status: 500, msg: 'error occurred'})

            
        }

    }

    async function getHergeById(req, res) {
        try {
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
    
            
        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({status: 500, msg: 'error occurred'})

        }
    }

}