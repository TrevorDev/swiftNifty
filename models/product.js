var Promise = require("bluebird");
var Database = require('./../lib/database');
var Sequelize = Database.getSequelize();
var sequelize = Database.getSequelizeInstance();

var Purchase = require("./purchase.js")

var Product = sequelize.define('Product', 
	{
	  name: {
	  	type:Sequelize.STRING
	  },
	  description: Sequelize.TEXT,
	  price: Sequelize.FLOAT
	}, {
		classMethods: {
    	
	  },
	  instanceMethods: {
	  }
	}
)

module.exports = Product;