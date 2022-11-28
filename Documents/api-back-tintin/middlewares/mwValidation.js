const { validateRegister } = require("../utils/appValidate");

function mwValidateRegister(req, res, next) {
    // reception les requêtes de  body
    console.log(req.body);
    const {firstName, lastName, email, password} = req.body

    // verification de tous les champs
    const results = validateRegister({firstName, lastName, email, password})
    console.log(results);
    // si echec je renvoie une erreur
    if (results.success === false) {
        res.status(400).json({errors: results.errors})
        return 
    }
    // si success je continue avec next
    next()
}

module.exports = {mwValidateRegister}