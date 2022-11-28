module.exports = (_db) => {
    db = _db;
    return CharacterModel;
}

class CharacterModel {

    // récupération de tous les personnages de  Tintin
    static getAllCharacters() {
        return db.query('SELECT * FROM Series')
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })
    }

    // récupération d'un personnage par son nom
    static getCharacterByName(name) {
        return db.query('SELECT * FROM Series WHERE nom = ?', [name])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // récupération d'un personnage par son slug
    static getCharacterBySlug(slug) {
        return db.query('SELECT * FROM Series WHERE slug = ?', [slug])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }


    // récupération d'un personnage par son id
    static getOneCharacter(id) {
        return db.query('SELECT * FROM Series WHERE id = ?', [id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // sauvegarde d'un personnage Tintin
    static saveOneCharacter(req) {
        return db.query('INSERT INTO Series (nom, prenom, picture, profession, personnage, personnage_suite, slug, creation_times_tamp) VALUES (?,?,?,?,?,?,?, NOW())', [req.body.nom, req.body.prenom, req.body.picture, req.body.profession, req.body.personnage, req.body.parsonnage_suite, req.body.slug])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })
    }


    // modification d'un personnage
    static updateOneCharacter(req, id) {
        return db.query('UPDATE Series SET nom=?, prenom=?, personnage=?, personnage_suite=? WHERE id = ?', [req.body.nom, req.body.prenom, req.body.personnage, req.body.personnage_suite, id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    //suppression d'un personnage
    static deleteOneCharacter(id) {
        return db.query('DELETE FROM Series WHERE id = ?', [id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }







}