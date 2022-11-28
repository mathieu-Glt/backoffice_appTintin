const fs = require('fs');
const { withAuth } = require('../middlewares/withAuth');
const slug = require('slug')
const parseurl = require('parseurl');

module.exports = (app, db) => {

    const CharacterModel = require('../models/CharacterModel')(db);
    const UserModel = require('../models/UserModel')(db);


    // route pour récupérer tous les personnages
    app.get('/api/characters', getAllCharacters)
    // route pour récupérer un personnage par son nom
    app.get('/api/characters/:name', getCharacterByName)
    // route pour récupérer un personnage par son slug
    app.get('/api/v1/characters/:slug', getCharacterBySlug)
    // route pour récupérer un personnage par son identifiant
    app.get('/api/v1/characters/:id', getCharacterById)
    // app.get('/api/v2/characters/:id', getCharacterV2ById)
    // route pour enregistrer un personnage
    app.post('/api/v1/character/save', withAuth, postCharacter)
    // route pour modifier un personnage
    app.put('/api/v1/character/update/:id', putCharacterById)
    // route pour supprimer un personnage
    app.delete('/api/v1/character/delete/:id', deleteCharacterById)



    async function getAllCharacters(req, res) {

        try {
            let charactersAll = await CharacterModel.getAllCharacters();
            console.log(charactersAll);
            if (charactersAll.length === 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: charactersAll
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: charactersAll
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }
    }

    async function getCharacterByName(req, res) {
        try {
            let name = req.params.name;
            let characterName = await CharacterModel.getCharacterByName(name);
            console.log(characterName)
            // affiche l'élément de l'url pathname : api/tintins/5
            //console.log(parseurl(req).pathname)

            if (characterName.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: characterName
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: characterName
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }


    }

    async function getCharacterBySlug(req, res) {
        try {
            let slug = req.params.slug;
            // let slug = slug(name, ' ')
            let results = await CharacterModel.getCharacterBySlug(slug);
            console.log('le resultat', results);
            // affiche l'élément de l'url pathname : api/tintins/5
            //console.log(parseurl(req).pathname)

            if (results.length === 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: results
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: results
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }

    }

    async function getCharacterById(req, res) {
        try {
            const id = req.params.id;
            let characterId = await CharacterModel.getOneCharacter(id);
            console.log(characterId)
            // affiche l'élément de l'url pathname : api/tintins/name
            console.log(parseurl(req).pathname)

            if (characterId.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: characterId
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: characterId
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }


    }

    async function getCharacterV2ById(req, res) {
        try {
            const id = req.params.id;
            let characterId = await CharacterModel.getOneCharacter(id);
            console.log(characterId)
            // affiche l'élément de l'url pathname : api/tintins/name
            console.log(parseurl(req).pathname)

            if (characterId.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: characterId
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: characterId
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }


    }

    async function putCharacterById(req, res) {
        try {
            const id = req.params.id;
            let character = await CharacterModel.updateOneCharacter(req, id);

            if (character.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Modification failed',
                    results: character
                })
            } else {
                res.status(200).json({
                    status: 200,
                    msg: 'The change was successfully',
                    results: character
                })
            }


        } catch (error) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }

    }

    async function deleteCharacterById(req, res) {
        try {
            const id = req.params.id;
            let character = await CharacterModel.getOneCharacter(id)
            console.log(character)

            let characterDelete = await CharacterModel.deleteOneCharacter(id)
            console.log(characterDelete)
            if (characterDelete.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Deletion failed',
                    results: character
                })
            } else {
                res.status(200).json({
                    status: 200,
                    msg: `The character ${character[0].nom} ${character[0].prenom}, has been deleted`,
                    results: character
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }

    }
    // SELECT `role` FROM Users WHERE `id` = 97
    async function postCharacter(req, res) {
        console.log('id user', req.id);
        let user = await UserModel.getRoleUser(req.id);
        console.log(user[0].role);
        if (user[0].role) {
            console.log(req.body);
            let character = await CharacterModel.saveOneCharacter(req);
            console.log(character);
            if (character.code) {
                res.json({ status: 500, msg: 'il y a eu un problème !', result: character });
            }
            res.json({ status: 200, msg: `le film ${req.body.title} a bien été enregistrée`, result: character });

        } else {
            res.json({ status: 500, msg: 'vous n\'avez pas de droit d\'acces !' });

        }




    }

}
