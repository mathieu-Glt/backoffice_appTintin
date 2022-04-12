//const { User } = require('../db/sequelize')


module.exports = (app, db) => {
    app.get('/test', (req, res)=> {
        res.json({status: 200, msg: "Test"})   
    })

        
}

    