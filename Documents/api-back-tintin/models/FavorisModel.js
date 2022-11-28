module.exports = (_db) => {
    db = _db;
    return FavorisModel;
}

class FavorisModel {
    //enregistrement d'un film en liste de favoris
    static saveOneMovieToFavoris(userId, tintinId) {
        return db.query('INSERT INTO Favoris (userId, tintinId, creation_times_tamp) VALUES (?,?, NOW())', [userId, tintinId])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }

    //enregistrement de la note d'un film de la liste de favoris de l'utilisateur
    static saveOneRateMovieToFavoris(rate, userId, movieId) {
        console.log(rate);
        console.log(userId);

        return db.query('UPDATE Favoris SET rate=? WHERE userId=? AND tintinId=?', [rate, userId, movieId])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }

    // SELECT `tintinId`, `userId` FROM `Favoris` WHERE `userId` = 98 AND `tintinId` = 2
    // récupération d'un film de sa liste de favoris par son id
    static getOneMovieListFavoris(userId, tintinId) {
        // console.log(userId);
        return db.query('SELECT tintinId, userId FROM Favoris WHERE userId = ? AND tintinId = ?', [userId, tintinId])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    //suppression d'un film dans sa liste Favoris
    // DELETE FROM Favoris WHERE `userId` = 98 AND `tintinId` = 22
    static deleteOneMovieFavories(userId, tintinId) {
        return db.query('DELETE FROM Favoris WHERE userId = ? AND tintinId = ?', [userId, tintinId])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })
    }


}
