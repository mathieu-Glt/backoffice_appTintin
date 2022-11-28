const fs = require('fs');
const withAuth = require('../middlewares/withAuth');
const slug = require('slug')


module.exports = (app, db) => {


    module.exports = (app, db)=>{
        const userModel = require('../models/UserModel')(db);
        // vérification si un utilisateur existe
       app.get('/api/v1/auth/checkToken', withAuth, async (req, res, next)=>{
            // si tout roule on envoie status 200 au front
            let user = await userModel.getOneUser(req.id);
            if(user.code) {
                res.json({status:500, msg: "aucun user associé", err: user})
            }
            res.json({status: 200, msg: "token ok", user: user[0]})
        })
      
        
    }
}