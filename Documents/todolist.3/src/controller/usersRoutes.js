const { User } = require('../../db/sequelize')


module.exports = (app) => {
    app.get('/', (req, res)=> {
        resjson({status: 200, msg: "Todo bien"})   
    })



    
}