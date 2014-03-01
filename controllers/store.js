var parse = require('co-body');
var sessionHelper = require('./../lib/sessionHelper');
var User = require('./../models/user');
var Store = require('./../models/store');
var Product = require('./../models/product');


exports.create = function *() {
	try{
		var params = yield parse(this);
		console.log(params)
		var currentUser = yield User.find(sessionHelper.getUserID(this.session))
		var store = yield Store.create({name: params.name, location: params.location, slogan: params.slogan, description: params.description});
		console.log(store)
		console.log(currentUser)
		yield currentUser.addStore(store)
		for (var i in params.products){
			var p = params.products[i]
			var price = parseFloat(p.price.replace(/\$/g,"2"))
			var product = yield Product.create({name:p.name,description:p.description,price:price})
			yield store.addProduct(product);
		}
		this.jsonResp(200,{message: "Success"})
	} catch (err) {
		console.log(err)
		this.jsonResp(400,{message: "Store with that name already exists"})
	}

}

exports.get = function *() {
	// try {
	// 	var params = yield parse(this)
	// 	var valid = yield User.authenticate(params.email, params.password)
	// 	if (!valid) {
	// 		this.jsonResp(400,{message: "Invalid username/password"})
	// 	}else{
	// 		sessionHelper.setLoggedIn(this.session,params.email,valid);
	// 		this.jsonResp(200,{message: "Logged in"})
	// 	}
	// } catch (err) {
	// 	console.log(err)
	// 	this.jsonResp(400,{message: "Invalid username/password"})
	// }
}