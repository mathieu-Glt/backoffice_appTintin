const fs = require('fs');
const { withAuthPass } = require('../middlewares/withAuth');
const { withAuth } = require('../middlewares/withAuth');
const slug = require('slug');
const parseurl = require('parseurl');
const UserModel = require('../models/UserModel');
const FavorisModel = require('../models/FavorisModel');


module.exports = (app, db) => {
    const TintinModel = require('../models/TintinModel')(db);
    const UserModel = require('../models/UserModel')(db);
    const FavorisModel = require('../models/FavorisModel')(db);

    // route our récupérer un film aléatoirement 
    app.get('/api/v1/random_movie', getMovieRandom)
    // route pour récupérer tous les films de la table
    app.get('/api/movies', withAuth, getAllMovies)
    // route qui renvoie tous les films de tintin pour les utilisateurs non inscrits
    app.get('/api/unknowuser/movies', getAllMovies)
    // route qui récupère un film par son titre
    app.get('/api/movies/search/:value', getMovieSearch)
    // route qui récupère un film par son slug
    app.get('/api/v1/movies/:slug', getMovieBySlug)
    // route qui récupère les films les mieux notés jusqu'a 7 films
    app.get('/api/v1/movie/rating', withAuth, getMovieRating)
    // route qui récupère un film en fonction des paramètre données à l'url
    app.get('/api/v1/movie', getMovieWithParam)
    // rout qui enregistre un film
    app.post('/api/v1/movie/save', withAuth, postMovie)
    // route qui modifie un film
    app.put('/api/v1/movie/update/:id', withAuth, putMovieById)
    // route qui supprime in film par son identifiant
    app.delete('/api/v1/movie/delete/:id', withAuth, deleteMovieById)
    // route qui qjoute une image pour un film
    app.post('/api/v1/upload/pict', withAuth, uploadPicture)
    // route qui permet de poster une note sur un film
    app.post('/api/v1/movie/rate', withAuth, updateRateMovie)
    // route qui récupère tous les films mis en favoris
    app.get('/api/favories', withAuth, getAllMoviesFavories)
    // route qui permet de récupèrer la moyenne des notes attribué pour chaque film (pas encore terminer)
    app.get('/api/movie/note', getAverageRateMovie)
    // app.get('/api/movie/rate', getMovieRate)
    // app.get('/api/v1/movies/then', getMoviesLimit)


    async function getAverageRateMovie(req, res) {
        try {
            let averageMovie = await TintinModel.getMovieAverageRate();
            console.log({ averageMovie });
            if (averageMovie.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: averageMovie
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: averageMovie
                })
            }


        } catch (error) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }

    }

    async function getMovieRandom(req, res) {
        try {
            let movieRandom = await TintinModel.getRandomMovies(1);
            console.log({ movieRandom });
            if (movieRandom.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: movieRandom
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: movieRandom
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })


        }
    }

    async function getAllMoviesFavories(req, res) {
        console.log(req.id);
        try {

            console.log('ici favoris', req.id);
            let favoriesAll = await TintinModel.getAllFavories(req.id);
            console.log(favoriesAll);
            if (favoriesAll.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: favoriesAll
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: favoriesAll

                })

            }

        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }

    }

    async function getAllMovies(req, res) {
        console.log('access token user: ', req.id);
        try {
            let tintinsAll = await TintinModel.getAllMovies(req.id);

            if (tintinsAll.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: tintinsAll
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: tintinsAll
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })


        }
    }

    async function getMovieSearch(req, res) {
        try {
            console.log(req.params.value);
            let results = await TintinModel.searchMovieByName(req.params.value);
            console.log('resultats', results);
            if (results.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: results
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: results
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })


        }
    }

    async function getMovieBySlug(req, res) {
        try {
            let slug = req.params.slug;
            // let slug = slug(name, ' ')
            let results = await TintinModel.getMovieBySlug(slug);
            console.log('le resultat', results);
            // affiche l'élément de l'url pathname : api/tintins/5
            //console.log(parseurl(req).pathname)

            if (results.length === 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: results
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: results
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })

        }

    }

    async function getMovieRating(req, res) {

        console.log('user id: ', req.id);
        let user = await UserModel.getRoleUser(req.id)
        console.log(user);
        if (user[0].role === 'admin' || user[0].role === 'user') {
            console.log(`Je suis ${user[0].role}`);
            try {
                const tintinsRate = await TintinModel.getMovieRate();
                console.log(tintinsRate)

                if (tintinsRate.length == 0) {
                    res.status(404).json({
                        status: 404,
                        msg: 'Results not found',
                        results: tintinsRate
                    })
                } else {
                    res.status(200).json({
                        status: 200,
                        results: tintinsRate
                    })
                }


            } catch (err) {
                console.log('error register route', err.message);
                res.status(500).json({ status: 500, msg: 'error occurred' })

            }
        } else {
            res.json({ status: 500, msg: 'vous n\'avez pas de droit d\'acces !' });

        }
    }

    async function getMovieWithParam(req, res) {
        try {
            let queryParameter = req.query;
            //console.log(queryParameter.title)
            let queryParameterTitle = queryParameter.title;

            console.log(queryParameterTitle)
            let tintin = await TintinModel.getMovieByName(queryParameterTitle)
            console.log(tintin)

            if (tintin.length == 0) {
                res.status(404).json({
                    status: 404,
                    msg: 'Results not found',
                    results: tintin
                })
            } else {
                res.status(200).json({
                    status: 200,
                    results: tintin
                })
            }


        } catch (err) {
            console.log('error register route', err.message);
            res.status(500).json({ status: 500, msg: 'error occurred' })


        }
    }

    async function putMovieById(req, res) {
        console.log(req.body);
        console.log('id user', req.id);
        let user = await UserModel.getRoleUser(req.id)
        console.log(user[0].role);
        const id = req.params.id;
        console.log('movie id :', id);
        if (user[0].role) {
            try {
                let editMovie = await TintinModel.updateOneMovie(req, id)
                console.log(editMovie);
                console.log('youpi');
                if (editMovie.code) {
                    res.json({ status: 500, msg: 'il y a eu un problème !', result: editMovie });
                } else {
                    res.json({ status: 200, msg: `le film ${req.body.title} a bien été enregistrée`, result: editMovie });
                }

            } catch (error) {
                console.log(error.message);
            }

        } else {
            res.json({ status: 500, msg: 'vous n\'avez pas de droit d\'acces !' });

        }



        // try {
        //     const id = req.params.id;
        //     let movie = await TintinModel.updateOneMovie(req, id);
        //     console.log(movie);
        //     if (movie.length == 0) {
        //         res.status(404).json({
        //             status: 404,
        //             msg: 'Modification failed',
        //             results: movie
        //         })
        //     } else {
        //         res.status(200).json({
        //             status: 200,
        //             msg: 'The change was successfully',
        //             results: movie
        //         })
        //     }


        // } catch (err) {
        //     console.log('error register route', err.message);
        //     res.status(500).json({ status: 500, msg: 'error occurred' })

        // }

    }

    async function deleteMovieById(req, res) {
        console.log(req.body);
        console.log('id user', req.id);
        let user = await UserModel.getRoleUser(req.id)
        if (user[0].role === 'admin') {
            console.log('je suis admin');
            const id = req.params.id;
            console.log({ id });

            let deleteMovie = await TintinModel.deleteOneMovie(id);
            console.log(deleteMovie);
            if (deleteMovie.code) {
                res.json({ status: 500, msg: 'il y a eu un problème !', result: deleteMovie });
            } else {
                res.json({ status: 200, msg: `le film  a bien été supprimé`, result: deleteMovie });
            }

        } else {
            res.json({ status: 500, msg: 'vous n\'avez pas de droit d\'acces !' });

        }


    }

    async function postMovie(req, res) {
        console.log('id user', req.id);
        let user = await UserModel.getRoleUser(req.id)
        // console.log(user[0].role);
        if (user[0].role === 'admin') {
            console.log(req.body);
            let movie = await TintinModel.saveOneMovie(req);
            console.log(movie);
            if (movie.code) {
                res.json({ status: 500, msg: 'il y a eu un problème !', result: movie });
            } else {
                res.json({ status: 200, msg: `le film ${req.body.title} a bien été enregistrée`, result: movie });
            }

        } else {
            res.json({ status: 500, msg: 'vous n\'avez pas de droit d\'acces !' });

        }
    }

    async function uploadPicture(req, res, next) {
        console.log(req.files);
        //si il n'y a aucune file envoyé ou que cette file est un objet vide on retourne une erreur
        if (!req.files || Object.keys(req.files).length === 0) {
            res.json({ status: 400, msg: "La photo n'a pas pu être récupérée" });
        } else {
            //on sauvegarde notre image dans le dossier que l'on souhaite
            req.files.image.mv('public/images/' + req.files.image.name, function (err) {
                console.log('ça passe', '/public/images/' + req.files.image.name)
                if (err) {
                    res.json({ status: 500, msg: "La photo n'a pas pu être enregistrée" })
                } else {
                    res.json({ status: 200, msg: 'ok', url: req.files.image.name });
                }
            });
        }

    }

    async function updateRateMovie(req, res) {
        console.log('ici user', req.id);
        console.log('id du film', req.body.movieId);
        console.log('rate', req.body.rate);
        const userId = req.id;
        const tintinId = req.body.movieId;
        const rate = req.body.rate;
        let user = await UserModel.getRoleUser(req.id)
        console.log(user);
        if (user[0].role === 'admin' || user[0].role === 'user') {
            console.log(`Je suis ${user[0].role}`);
            try {
                let rateMovie = await FavorisModel.saveOneRateMovieToFavoris(rate, userId, tintinId)
                console.log(rateMovie);
                if (rateMovie.code) {
                    res.json({ status: 500, msg: 'il y a eu un problème !', result: rateMovie });
                } else {
                    res.json({ status: 200, msg: `la note pour le film ${req.body.title} a bien été enregistrée`, result: rateMovie });
                }

            } catch (error) {
                console.log(error.message);
            }
        } else {
            res.json({ status: 500, msg: 'vous n\'avez pas de droit d\'acces !' });

        }
    }

    // async function getMoviesLimit(req, res) {
    //     try {
    //         let tintinsAll = await TintinModel.getMoviesLimitThen();

    //         if (tintinsAll.length == 0) {
    //             res.status(404).json({
    //                 status: 404,
    //                 msg: 'Results not found',
    //                 results: tintinsAll
    //             })
    //         } else {
    //             res.status(200).json({
    //                 status: 200,
    //                 results: tintinsAll
    //             })
    //         }


    //     } catch (err) {
    //         console.log('error register route', err.message);
    //         res.status(500).json({ status: 500, msg: 'error occurred' })


    //     }
    // }

    /**
     * other function
     */

    // async function getMovieById(req, res) {
    //     try {
    //         const id = req.params.id;
    //         console.log(id);
    //         let tintinId = await TintinModel.getOneMovie(id);
    //         console.log(tintinId)
    //         // affiche l'élément de l'url pathname : api/tintins/name
    //         console.log(parseurl(req).pathname)

    //         if (tintinId.length == 0) {
    //             res.status(404).json({
    //                 status: 404,
    //                 msg: 'Results not found',
    //                 results: tintinId
    //             })
    //         } else {
    //             res.status(200).json({
    //                 status: 200,
    //                 results: tintinId
    //             })
    //         }

    //     } catch (err) {
    //         console.log('error register route', err.message);
    //         res.status(500).json({ status: 500, msg: 'error occurred' })

    //     }



    // }



}