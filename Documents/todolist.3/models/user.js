'use strict';
//import Sequelize from 'sequelize';
const bcrypt = require ('bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.tasks.hasMany(models.User)
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('lastName');
        return rawValue ? rawValue.toUpperCase() : null
      }},
    email: {
      type: DataTypes.STRING,
      is: ["^[a-z]+$",'i'],
      isEmail: true
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    role: DataTypes.STRING,
    creation_times_tamp: DataTypes.DATE
  }, /*{
    instanceMethods: {
      generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
      },
      validPassword: function (password) {
        return bcrypt.compareSync(password, this.password)
      }
    },
  
  },*/
   
  {
    sequelize,
    modelName: 'users',
    createdAt: 'creation_times_tamp',
    updatedAt: false
  });
  return User;
};