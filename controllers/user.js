var parse = require('co-body');
var sessionHelper = require('./../lib/sessionHelper');
var User = require('./../models/user');


exports.createAccount = function *() {
	try {
		var params = yield parse(this)
		if(params.email.length > 255 || params.password.length > 45){
			this.jsonResp(400,{message: "Email or Password is too long"})
		}else if(params.password.length < 6){
			this.jsonResp(400,{message: "Password must be longer than 6 characters"})
		}else{
			var ret = yield User.buildEncrypted({
				email: params.email,
		  	password: params.password
			});
			console.log(ret)
			yield ret.save();
			sessionHelper.setLoggedIn(this.session,ret.email,ret.id);
			this.jsonResp(201,{message: "Account created"})
		}
	} catch (err) {
		console.log(err)
		this.jsonResp(409,{message: "Account already exists"})
	}
}

exports.login = function *() {
	try {
		var params = yield parse(this)
		var valid = yield User.authenticate(params.email, params.password)
		if (!valid) {
			this.jsonResp(400,{message: "Invalid username/password"})
		}else{
			sessionHelper.setLoggedIn(this.session,params.email,valid);
			this.jsonResp(200,{message: "Logged in"})
		}
	} catch (err) {
		console.log(err)
		this.jsonResp(400,{message: "Invalid username/password"})
	}
}