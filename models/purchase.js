var Promise = require("bluebird");
var Database = require('./../lib/database');
var Sequelize = Database.getSequelize();
var sequelize = Database.getSequelizeInstance();

var OrderItem = require("./orderItem.js")

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

Purchase.hasMany(OrderItem)
// Product.hasMany(Purchase)

module.exports = Purchase;