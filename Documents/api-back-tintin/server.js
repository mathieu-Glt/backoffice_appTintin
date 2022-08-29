const express = require('express');
const app = express();

const mysql = require('promise-mysql');
const cors = require('cors');
app.use(cors());
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    createParentPath: true
}));

//parse les url
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(__dirname + '/public'));

//test de middleware
const myModule = require('./testModule');
myModule();

//on check si il l'api est en ligne ou non et on décide quelle bdd on récupère
const config = require('./config')



//récup de toutes mes routes
const moviesRoutes = require('./routes/moviesRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const favorisRoutes = require('./routes/favorisRoutes');
const authorRoutes = require('./routes/authorRoutes');
const characterRoutes = require('./routes/characterRoutes');
const tintinRoutes = require('./routes/tintinRoutes');

// connexion BDD
const host = process.env.HOST_DB || config.db.host;
const database = process.env.DATABASE_DB || config.db.database;
const user = process.env.USER_DB || config.db.user;
const password = process.env.PASSWORD_DB || config.db.password;
const port = process.env.PORT_DB || config.db.port;

console.log(host, database, user, password, port)


mysql.createConnection({
	host: host,
	database: database,
	user: user,
	password: password,
	port: port
}).then((db) => {
    console.log('connecté bdd');
	setInterval(async function () {
		let res = await db.query('SELECT 1');
	}, 10000);
	
	app.get('/', (req, res, next)=>{
		res.json({status: 200, results: "welcome to api"})
	});
	
	// toutes les routes sont dans des modules 
	moviesRoutes(app, db);
	userRoutes(app, db);
	tintinRoutes(app, db);
	authRoutes(app, db);
	favorisRoutes(app, db);
    authorRoutes(app, db);
    characterRoutes(app, db);


})
.catch(err=>console.log("Echec connexion BDD: ", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
	console.log('listening port '+PORT+' all is ok');
})