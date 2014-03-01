var Promise = require("bluebird");
var Database = require('./../lib/database');
var Sequelize = Database.getSequelize();
var sequelize = Database.getSequelizeInstance();

var Product = require("./product.js")

var Purchase = sequelize.define('Purchase', 
	{
	  customerTag: {
	  	type:Sequelize.STRING
	  },
	  message: Sequelize.TEXT,
	  totalPrice: Sequelize.FLOAT,
	  paid: Sequelize.BOOLEAN
	}, {
		classMethods: {
    	
	  },
	  instanceMethods: {
	  }
	}
)

Purchase.hasMany(Product)
Product.hasMany(Purchase)

module.exports = Purchase;