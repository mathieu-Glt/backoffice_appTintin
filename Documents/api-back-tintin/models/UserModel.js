const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (_db) => {
    db = _db;
    return UserModel;
}


class UserModel {
    // récupération de tous les utilisateurs
    static getAllUsers() {
        return db.query('SELECT * FROM Users')
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })
    }


    // récupération d'un utilisateur par son id
    static getOneUser(id) {
        return db.query('SELECT * FROM Users WHERE id = ?', [id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // récupération d'un utilisateur par son id
    static getUserByMail(email) {
        return db.query('SELECT * FROM Users WHERE email = ?', [email])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // suavegarde d'un utilisateur
    static async saveOneUser(req) {
        let hash = await bcrypt.hash(req.body.hashPassword, saltRounds);
        return db.query('INSERT INTO Users (firstName, lastName, email, hashPassword, role, creation_times_tamp) VALUES(?,?,?,?,"user", NOW())', [req.body.firstName, req.body.lastName, req.body.email, hash])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }




}
