module.exports = (_db) => {
    db = _db;
    return AuthorModel;
}


class AuthorModel {

    // récupération de tous les datas de l'auteur Herge
    static getAllHerge() {
        return db.query('SELECT * FROM Herges')
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })
    }

            // récupération d'un auteur Herge
            static getOneHerge(id) {
                return db.query('SELECT * FROM Herges WHERE id = ?', [id])
                    .then((response) => {
                        return response;
                    })
                    .catch((err) => {
                        return err;
                    })
        
            }
    


}
