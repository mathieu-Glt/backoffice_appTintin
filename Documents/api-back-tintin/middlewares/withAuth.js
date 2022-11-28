const jwt = require('jsonwebtoken');
const secret = 'pitichat';

const withAuth = withAuthCore();
const withAuthPass = withAuthCore(true);


// middleware permettant de contrôler la validité du token
function withAuthCore (pass = false) {
    return (req, res, next)=>{
        console.log('headers ici :', req.headers);
    // je récupère les information du token stockées dans la partie headers de la requete axios
    const token = req.headers['x-access-token'];
    // const idMovie = req.headers['id movie'];
    console.log({token})
    console.log(pass);
    // console.log(idMovie);
    // si pas de token, pas d'autorisation
    if(token === undefined) {
        console.log(pass);
        if(pass) {
            next();
        } else {
            res.status(401).json({status: 401, msg:"Pas de token"});
        }
    } else {
        //si il y a un token je vérifie qu'il est bon
        jwt.verify(token, secret, (err, decode)=>{
            if(err){
                // mauvais token !
                res.status(401).json({status: 401, msg: "attention Token non valide"})
            } else {
                // bon token on passe à la suite
                
                // le token est bon, je peux récupérer l'id de l'utilisateur dans le token
                // je l'ai enregisté lors du login
                // je le stock dans le req de la fonction suivante
                req.id = decode.id;
                console.log(req.id)
                next();
            
            }
        })
        
        
    }
}   
    
}
// j'exporte le middleware
module.exports = {withAuth, withAuthPass};