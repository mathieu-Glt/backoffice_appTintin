module.exports = (_db) => {
    db = _db;
    return TintinModel;
}

class TintinModel {

    // récupération des infos table Tintin et de la moyenne des notes arrondies de la table Favoris 
    // SELECT t.*, ROUND(AVG(`rate`)) AS note FROM `Tintins` AS t JOIN `Favoris` AS f ON t.id = f.tintinId GROUP BY `tintinId`
    
    // récupération de la moyenne des notes attribués par les utilisateurs des films Tintin
    static getMovieAverageRate() {
        return db.query(`SELECT t.*, ROUND(AVG(rate)) AS note
                         FROM Tintins AS t
                         JOIN Favoris AS f
                         ON t.id = f.tintinId
                         GROUP BY tintinId`)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((err) => {
                return err;
            })

    }
    // récupération de tous les films Tintin
    static getAllMovies(tokenUserId, options = {
        favoriteOnly: false,
        limit: 0,
        orderBy: null,
        orderDirection: 1
    }) {
        console.log('tokenUserId :', tokenUserId);
        // si pas d'utilisateur récupérer tous les films 
        if (!tokenUserId) {
            return db.query('SELECT * FROM Tintins')
                .then((response) => {
                    console.log(response);
                    return response;
                })
                .catch((err) => {
                    return err;
                })
        }
        // si l'utilisateur est connécté récupérer tous les films avec l'indication de ceux que l'utilisateur a ajouté en favoris
        if (tokenUserId) {
            return db.query(`SELECT t.*,f.id AS favorite
            FROM Tintins AS t 
            LEFT JOIN Favoris AS f
            ON t.id = f.tintinId AND f.userId = ${tokenUserId}`)
                .then((response) => {
                    console.log(response);
                    return response;
                })
                .catch((err) => {
                    return err;
                })
        }
    }

    // sélection d'un film aléatoirement de façon ordonnée
    static getRandomMovies(limit) {
        return db.query(`SELECT * FROM Tintins
                         ORDER BY RAND()
                         LIMIT ${limit};`)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((err) => {
                return err;
            })
    }
    // récupération de plusieurs film dans une limite de 16 films (cette fonction n'est pas utilisé)
    static getMoviesLimitThen() {
        return db.query('SELECT * FROM Tintins LIMIT 16')
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
    static searchMovieByName(name) {
        return db.query(`SELECT * FROM Tintins WHERE title LIKE '%${name}%'`)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // récupération d'un film par son slug
    static getMovieBySlug(slug) {
        return db.query('SELECT * FROM Tintins WHERE slug = ?', [slug])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // sauvegarde d'un film Tintin
    static saveOneMovie(req) {
        return db.query('INSERT INTO Tintins (title, picture, synopsis, movie, rating, slug, creation_times_tamp) VALUES (?,?,?,?,?,?, NOW())', [req.body.title, req.body.picture, req.body.synopsis, req.body.movie, req.body.rating, req.body.slug])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })
    }

    // récupération des films les mieux évalués ordonné en descendance par note dans une limite de 7 films
    static getMovieRate() {
        // return this.getAllMovies(userId, { limit: 5, orderBy: "rating", orderDirection: -1 })
        return db.query('SELECT DISTINCT title, picture, synopsis, movie, rating FROM Tintins ORDER BY rating DESC LIMIT 7')
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    //récupération de la note d'un film (cette fonction n'est pas utlisé)
    // SELECT `rating` FROM `Tintins` WHERE `id` = 2
    static getMovieStars(id) {
        return db.query('SELECT rating FROM Tintins WHERE id=?', [id])
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }


    // SELECT t.* FROM `Tintins` AS t JOIN `Favoris` AS f ON t.id = f.tintinId AND `userId` = 97
    // récupération de tous les films placé en favoris de l'utilisateur
    static getAllFavories(userId) {
        console.log('user :', userId);
        return db.query(`SELECT t.* FROM Tintins AS t JOIN Favoris AS f ON t.id = f.tintinId AND userId = ${userId}`)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            })

    }

    // modification d'un film
    static updateOneMovie(req, id) {
        return db.query('UPDATE Tintins SET title=?, picture=?, synopsis=?, movie=?, rating=?, slug=? WHERE id = ?', [req.body.title, req.body.picture, req.body.synopsis, req.body.movie, req.body.rating, req.body.slug, id])
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