const { Sequelize, DataTypes } = require('sequelize')
const User = require('../models/user');


module.exports = (app, db) => {
    app.get('/todo', (req, res)=> {
        res.json({status: 200, msg: "Todo bien"})   
    })

    app.get('/api/users', (req, res)=> {
        User.findAll()
        .then(users => {
            const msg = "The list'users has been successfully recovered."
            res.json({status: 200, data: users})
        })
    }) 
        
}

    