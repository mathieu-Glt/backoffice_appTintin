const fs = require('fs');
const withAuth = require('../middlewares/withAuth');
const slug = require('slug');
const parseurl = require('parseurl');


module.exports = (app, db) => {

    const PersoTintinModel = require('../models/PersoTintinModel')(db);

    // route qui récupère tous les données du personnage Tintin
    app.get('/api/tintins', getAllTintin)
    // route qui erécupère un seul perso de tintin
    app.get('/api/tintins/:id', getOneTintinById)


    async function getAllTintin(req, res) {
        try {
            let tintinAll = await PersoTintinModel.getAllTintin();
            console.log(tintinAll)

            if (tintinAll.length == 0) {
                res.status(404).json({
                    msg: 'Results not found',
                    results: tintinAll
                })
            } else {
                res.status(200).json({
                    results: tintinAll
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }
    }

    async function getOneTintinById(req, res) {
        try {
            const id = req.params.id;
            let tintinId = await PersoTintinModel.getOneTintin(id);
            console.log(tintinId)
            // affiche l'élément de l'url pathname : api/tintins/name
            console.log(parseurl(req).pathname)

            if (tintinId.length == 0) {
                res.status(404).json({
                    msg: 'Results not found',
                    results: tintinId
                })
            } else {
                res.status(200).json({
                    results: tintinId
                })
            }


        } catch (error) {
            console.log('error register route', err.message);
            res.status(500).json({ msg: 'error occurred' })

        }
    }

}
