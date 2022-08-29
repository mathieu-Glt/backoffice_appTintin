const fs = require('fs');
const withAuth = require('../withAuth');
const slug = require('slug');
const parseurl = require('parseurl');


module.exports = (app, db) => {
    
    const PersoTintinModel = require('../models/PersoTintinModel')(db);

    app.get('/test/tintinperso', (req, res) => {
        console.log(slug('TintinPerso à l\'Ouest d\'Eden', '_'))
        res.status(200).json({
            status: 1,
            msg: "Welcome to endpoint tintinPerso test"
        })
    })

    app.get('/api/tintins', async (req, res) => {
        let tintinAll = await PersoTintinModel.getAllTintin();
        console.log(tintinAll)

        if (tintinAll.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: tintinAll
            })
        } else {
            res.status(200).json({
                status: 200,
                results: tintinAll
            })
        }
    })


    app.get('/api/tintins/:id', async (req, res) => {
        const id = req.params.id;
       let tintinId = await PersoTintinModel.getOneTintin(id);
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



}
