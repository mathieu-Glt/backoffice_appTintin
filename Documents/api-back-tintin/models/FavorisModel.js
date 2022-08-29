module.exports = (_db) => {
    db = _db;
    return FavorisModel;
}

class FavorisModel {
    //enregistrement d'un film en liste de favoris
    static saveOneMovieToFavoris(userId, tintinId) {
        return db.query('INSERT INTO Favoris (userId, tintinId, creationTimestamp) VALUES (?,?, NOW())', [userId, tintinId])
            .then((result) => {
                return result;
            })
            .catch((err) => {
                return err;
            })
    }
}
