const fs = require('fs');
const withAuth = require('../withAuth');
const slug = require('slug')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = "pitichat";
const saltRounds = 10;


module.exports = (app, db) => {
    const UserModel = require('../models/UserModel')(db);


    app.get('/test/users', (req, res) => {
        console.log(slug('Users à l\'Ouest d\'Eden', '_'))
        res.status(200).json({
            status: 1,
            msg: "Welcome to endpoint users test"
        })
    })

    app.get('/api/users', async (req, res) => {
        let usersAll = await UserModel.getAllUsers();
        console.log(usersAll)

        if (usersAll.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: usersAll
            })
        } else {
            res.status(200).json({
                status: 200,
                results: usersAll
            })
        }
    })

    app.get('/api/v1/users/:id', async (req, res) => {
        const id = req.params.id;
        let userId = await UserModel.getOneUser(id);
        console.log(userId)

        if (userId.length == 0) {
            res.status(404).json({
                status: 404,
                msg: 'Results not found',
                results: userId
            })
        } else {
            res.status(200).json({
                status: 200,
                results: userId
            })
        }


    })
    // enregistrement d'un  ustilisateur
    app.post('/api/v1/user', async (req, res) => {
        let check = await UserModel.getUserByMail(req.body.email)
        if (check.length > 0) {
            if (check[0].email === req.body.email) {
                res.status(401).json({
                    status: 401,
                    msg: 'Email already exists'
                })
            }
        } let user = await UserModel.saveOneUser(req);
        console.log(user)

        if (user.code) {
            res.status(500).json({
                status: 500,
                msg: 'Problem while recording'
            })
        } else {
            res.status(200).json({
                status: 200,
                msg: `You are well registered ${req.body.firstName} ${req.body.lastName}`,
                results: user
            })
        }


    })

    // gestion de la connexion des membres (c'est ici qu'on va créer le token et l'envoyer vers le front)
    app.post('/api/v1/user/login', async (req, res) => {
        //check si le mail existe dans la base de donnée
        let user = await UserModel.getUserByMail(req.body.email);
        //console.log(user)
        if (user.length === 0) {
            res.status(404).json({
                status: 404,
                msg: 'Email does not exists, please register'
            })

        }
        // on compare les deux mots de passes
        let same = await bcrypt.compare(req.body.hashPassword, user[0].hashPassword);

        if (same) {
            let payload = { id: user[0].id, email: user[0].email, firstname: user[0].firstName, lastname: user[0].lastName }
            console.log(payload)
            let token = jwt.sign(payload, secret);
            console.log(token)

            res.status(200).json({
                status: 200,
                msg: `You are well connected ${payload.firstname} ${payload.lastname}`,
                token :token
            })
        } else {
            res.status(401).json({
                status: 401,
                msg: 'bad password'
            })
        }
    })
    // modification d'un utilisateur       





}