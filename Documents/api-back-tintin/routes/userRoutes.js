const fs = require('fs');
const withAuth = require('../middlewares/withAuth');
const slug = require('slug')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mwValidateRegister } = require('../middlewares/mwValidation');
const secret = "pitichat";
const saltRounds = 10;


module.exports = (app, db) => {
    const UserModel = require('../models/UserModel')(db);


    // route qui récupère tous les utilisateurs enregistré 
    app.get('/api/users', getAllUsers)
    // route qui récupère un seul utilisateur enregistré par son identifiant
    app.get('/api/v1/users/:id', getOneUserById)
    // route de connexion d'un utilisateur
    app.post('/api/v1/user/login', saveOneUser)
    // route de déconnexion 
    app.post('/logout', getLogoutUser)

    
    
    async function getAllUsers(req, res) {
        try {
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



        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }
    }

    async function getOneUserById(req, res) {
        try {
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


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }


    }

    async function saveOneUser(req, res) {

        try {
            //check si le mail existe dans la base de donnée
            let user = await UserModel.getUserByMail(req.body.email);
            console.log(user)
            if (user.length === 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Email does not exists, please register'
                })

            }
            // on compare les deux mots de passes
            //console.log('oki');
            let same = await bcrypt.compare(req.body.password, user[0].hashPassword);
            //console.log(same);
            if (same) {
                const {id, email, firstName: firstname, lastName: lastname, role} = user[0];
                let payload = { id, email, firstname, lastname, role};
                // let payload = { id: user[0].id, email: user[0].email, firstname: user[0].firstName, lastname: user[0].lastName, role: user[0] }
                console.log(payload);
                let token = jwt.sign(payload, secret);
                //console.log(token)
                req.session.firstname = `${payload.firstname}`
                    req.session.lastname = `${payload.lastname}`
                    req.session.email = `${payload.email}`
                    req.session.role = `${payload.role}`
                    req.session.token = `${token}`

                res.status(200).json({
                    status: 200,
                    firstname: `${payload.firstname}`,
                    lastname: `${payload.lastname}`,
                    msg: `You are well connected ${payload.firstname} ${payload.lastname}`,
                    token: token,
                    role: role,
                    session: JSON.stringify(req.session)

                })


            } else {
                res.status(401).json({
                    status: 401,
                    msg: 'bad password'
                })
            }

        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }
    }

    async function getLogoutUser(req, res, next) {
        req.session.destroy((err) => {
            // cannot access session here
            if (err) {
                return console.log(err);
                res.status(404).json({msg: "failure during logout "})
              }
              res.status(200).json({msg: " you're logged out"});
              console.log("you're logged out");
        })
    }

    // enregistrement d'un  utilisateur
    app.post('/api/v1/user', mwValidateRegister, async (req, res) => {
        try {
            console.log(req.body);

            let check = await UserModel.getUserByMail(req.body.email)
            if (check.length > 0) {
                res.status(400).json({ status: 400, msg: 'Email already exists' })
                return;
            }

            let user = await UserModel.saveOneUser(req);
            console.log(user)

            if (user.code) {
                throw new Error('Problem while recording')
            } else {
                res.status(201).json({
                    status: 201,
                    msg: `You are well registered ${req.body.firstName} ${req.body.lastName}`,
                    session: req.session
                })

                console.log(req.session);


            }






        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })
        }


    })





}