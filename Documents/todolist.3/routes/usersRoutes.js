const bcrypt = require('bcrypt');
const { response } = require('express');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const users = require('../src/models/users');
const secret = "pitichat";
const withAuth = require('../../withAuth');


module.exports = (app, db)=>{

    const userModel = require('../src/models/users')(db);

    app.get('/', (req, res, next)=>{
		res.json({status: 200, results: "welcome to api"})
	});


    app.post('/api/v1/user', async (req, res, next)=>{
        const [user, created] = await users.findOrCreate({
            where: { username: req.body.email }
        });
        if(!created) {
            res.json({status: 401, msg: "Email déja utilisé!"})
        }
        
    })
}