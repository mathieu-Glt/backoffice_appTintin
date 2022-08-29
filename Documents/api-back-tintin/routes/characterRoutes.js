const fs = require('fs');
const withAuth = require('../withAuth');
const slug = require('slug')
const parseurl = require('parseurl');

module.exports = (app, db) => {

    const CharacterModel = require('../models/CharacterModel')(db);


    app.get('/test/character', (req, res) => {
        console.log(slug('Character à l\'Ouest d\'Eden', '_'))
        res.status(200).json({
            status: 1,
            msg: "Welcome to endpoint character test"
        })
    })


    app.get('/api/characters', async (req, res) => {
        let charactersAll = await CharacterModel.getAllCharacters();

        if (charactersAll.length == 0) {
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
    })


    app.get('/api/characters/:name', async (req, res) => {
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


    })

    app.get('/api/v1/characters/:id', async (req, res) => {
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

        
    })


    app.put('/api/v1/character/update/:id', async (req, res) => {
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

    })

    app.delete('/api/v1/character/delete/:id', async (req, res) => {
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

    })

}