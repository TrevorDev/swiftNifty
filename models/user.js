var crypto = require('./../lib/crypto');
var Promise = require("bluebird");
var Database = require('./../lib/database');
var Sequelize = Database.getSequelize();
var sequelize = Database.getSequelizeInstance();

var Store = require("./store.js")

var User = sequelize.define('User', 
	{
	  email: {
	  	type:Sequelize.STRING,
	  	validate: {
	  		isEmail: true
	  	},
	  	unique: true
	  },
	  password: Sequelize.STRING
	}, {
		classMethods: {
    	buildEncrypted: Promise.coroutine(function*(attributes){ 
    		return User.build({
								  email: attributes.email,
								  password: yield crypto.crypt(attributes.password)
								})
			}),
			authenticate: Promise.coroutine(function*(email, password){
				var user = yield User.find({where: {email: email}});
				if(yield crypto.compareStringHash(password, user.password)){
					return user.id;
				}else{
					return 0;
				}
			})
	  },
	  instanceMethods: {
	    method2: function() { return 'foo' }
	  }
	}
)
User.hasMany(Store)
module.exports = User;

//console.log(User.findAll())


// var createDB = Promise.coroutine(function*(){
// 	var user = yield User.buildEncrypted({
// 	  email: 'test@gffg.com',
// 	  password: 'sdafadsfsd'
// 	})
// 	console.log(user)
// 	yield sequelize.sync();
// 	yield user.save();
// })
// createDB();

