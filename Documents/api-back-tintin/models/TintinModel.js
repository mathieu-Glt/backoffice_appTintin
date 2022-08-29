module.exports = (_db) => {
    db = _db;
    return TintinModel;
}

class TintinModel {
    // récupération de tous les films Tintin
    static getAllMovies() {
        return db.query('SELECT * FROM Tintins')
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })
    }

    // récupération d'un film par son id
    static getOneMovie(id) {
        return db.query('SELECT * FROM Tintins WHERE id = ?', [id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // récupération d'un film par son titre
    static getMovieByName(name) {
        return db.query('SELECT * FROM Tintins WHERE title = ?', [name])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // récupération des films évalué à 5 dans la limite de  5 films
    static getMovieRate() {
        return db.query('SELECT DISTINCT title, picture, synopsis, movie, rating FROM Tintins ORDER BY rating DESC LIMIT 5')
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // modification d'un film
    static updateOneMovie(req, id) {
        return db.query('UPDATE Tintins SET title=?, synopsis=?, movie=?, rating=? WHERE id = ?', [req.body.title, req.body.synopsis, req.body.movie, req.body.rating, id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    //suppression d'un film
    static deleteOneMovie(id) {
        return db.query('DELETE FROM Tintins WHERE id = ?', [id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }


}