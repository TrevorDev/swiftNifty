var parse = require('co-body');
var sessionHelper = require('./../lib/sessionHelper');
var socketMaster = require('./../lib/socketMaster');
var User = require('./../models/user');
var Store = require('./../models/store');
var Product = require('./../models/product');
var Purchase = require('./../models/purchase');
var OrderItem = require('./../models/orderItem');


exports.create = function *() {
	try{
		var params = yield parse(this);
		if(!params.name||!params.location||!params.slogan||!params.description||!params.products){
			this.jsonResp(400,{message: "Please fill in all fields."})
			return
		}
		for(var i in params.products){
			if(!params.products[i].name){
				this.jsonResp(400,{message: "Product "+(parseInt(i)+1)+" is missing a name"})
				return
			}
			if(!params.products[i].price || isNaN(parseFloat(params.products[i].price)) ){
				this.jsonResp(400,{message: "Product "+(parseInt(i)+1)+" has an invalid price"})
				return
			}
		}
		var currentUser = yield User.find(sessionHelper.getUserID(this.session))
		var store = yield Store.create({name: params.name, location: params.location, slogan: params.slogan, description: params.description});
		yield currentUser.addStore(store)
		for (var i in params.products){
			var p = params.products[i]
			var price = parseFloat(p.price.replace(/\$/g,"2"))
			var product = yield Product.create({name:p.name,description:p.description,price:price})
			yield store.addProduct(product);
		}
		this.jsonResp(200,{message: "Success", id: store.id})
	} catch (err) {
		console.log(err)
		this.jsonResp(400,{message: "Store with that name already exists"})
	}

}

exports.order = function *() {
	try {
		var params = yield parse(this)
		var store = yield Store.find(this.params.id)
		//console.log(store)
		var purchase = yield Purchase.create({customerTag:params.name,message:params.message,totalPrice:params.total,paid:params.payWhen=="now"?true:false})
		yield store.addPurchase(purchase);

		for(var i in params.orders){
			var orderItem = yield OrderItem.create({})
			var product = yield Product.find(params.orders[i].id)
			yield product.addOrderItem(orderItem)
			yield purchase.addOrderItem(orderItem)
		}
		var io = socketMaster.getIO();
		io.sockets.in(store.id).emit('purchase', {test: 1});
		//console.log(params)
		this.jsonResp(200,{message: "Success", id: purchase.id})
	} catch (err) {
		console.log(err)
		this.jsonResp(400,{message: "Error occured"})
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