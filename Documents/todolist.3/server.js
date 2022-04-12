const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require('sequelize');
const TaskModel = require('./models/task');
const UserModel = require('./models/user');
const usersRoutes = require('./routes/usersRoutes');
const tasksRoutes = require("./src/controller/tasksRoutes");
const user = require("./models/user");
const task = require("./models/task");

const sequelize = new Sequelize('mathieugillet_todo', 'mathieugillet', '379a46404e062e0b0e8b7799b58095a4', {
    host: 'db.3wa.io',
    dialect: 'mysql',
})

sequelize.authenticate()
  .then(_ => console.log('Connection has been established successfully.'))
  .catch(error => console.error('Unable to connect to the database: ${error}'));

const Task = TaskModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
/*
const initDb = () => {
  
}*/
sequelize.sync()
  .then(_ => {
    console.log('the "Task" database has been synchronized.'),
    Task.create({
      description: task.description
    }).then(tâche => console.log(tâche.toJSON()))
      console.log("The database 'Task' initialized")
  })
  .then(_ => { 
    console.log('the "User" database has been synchronized.'),
    User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role
    }).then(user => console.log(user.toJSON()))
    console.log("The database 'User' initialized")
})
.then((db) => {
    app.get('/', (req, res)=>{
      res.json({status: 200, msg: "Welcome to API REST"})
    })
      

    //toutes les routes
    usersRoutes(app, db);
    tasksRoutes(app, db);
    
})


const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
