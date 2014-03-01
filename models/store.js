var Promise = require("bluebird");
var Database = require('./../lib/database');
var Sequelize = Database.getSequelize();
var sequelize = Database.getSequelizeInstance();

var Purchase = require("./purchase.js")
var Product = require("./product.js")
var Store = sequelize.define('Store', 
	{
	  name: {
	  	type:Sequelize.STRING,
	  	unique: true
	  },
	  slogan: Sequelize.STRING,
	  description: Sequelize.TEXT,
	  location: Sequelize.STRING
	}, {
		classMethods: {
    	
	  },
	  instanceMethods: {
	  }
	}
)

Store.hasMany(Product)
Store.hasMany(Purchase)

module.exports = Store;