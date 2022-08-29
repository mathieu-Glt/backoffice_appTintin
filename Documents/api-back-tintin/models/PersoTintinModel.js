module.exports = (_db) => {
    db = _db;
    return PersoTintinModel;
}

class PersoTintinModel {

    // récupération de tous les caractéristiques du personnage de Tintin
    static getAllTintin() {
        return db.query('SELECT * FROM Personnages')
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })
    }

    // récupération d'un personnage Tintin
    static getOneTintin(id) {
        return db.query('SELECT * FROM Personnages WHERE id = ?', [id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }



}