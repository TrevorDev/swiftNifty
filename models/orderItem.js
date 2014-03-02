var Promise = require("bluebird");
var Database = require('./../lib/database');
var Sequelize = Database.getSequelize();
var sequelize = Database.getSequelizeInstance();

var Purchase = require("./purchase.js")


var OrderItem = sequelize.define('OrderItem', 
	{
	}, {
		classMethods: {
    	
	  },
	  instanceMethods: {
	  }
	}
)

module.exports = OrderItem;