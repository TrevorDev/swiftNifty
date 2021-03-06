var Promise = require("bluebird");
var Database = require('./../lib/database');
var Sequelize = Database.getSequelize();
var sequelize = Database.getSequelizeInstance();

var Purchase = require("./purchase.js")
var OrderItem = require("./orderItem.js")

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

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product)
module.exports = Product;