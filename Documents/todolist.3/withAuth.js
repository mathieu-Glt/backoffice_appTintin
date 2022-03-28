const jwt = require('jsonwebtoken');
const secret = 'pitichat';

const withAuth = (req, res, next)=>{
    // on récupère notre token dans le header de la requête HTTP
    const token = req.headers['x-access-token'];
    //si il ne le trouve pas
    if ( token === undefined) {
        //renvoi d'une erreur
        res.json({
            status: 404,
            msg: "token not found"
        })

    } else {
        //sinon (si trouvé) utilisation de la fonction de vérification de jsonwebtoken
        jwt.verify(token, secret, (err, decode)=>{
            //si il y a une erreur envoi une reponse erreur
            if(err) {
                res.json({
                    status: 401,
                    msg: "error, your token is invalid"
                })
                //sinon envoi de l'id décodé dans le payload du token
                req.id = decoded.id;
                //on sort de la fonction
                next();
            }
        })
     
    }
}

module.exports = withAuth;