var render = require('./lib/render');
var http = require('http');
var config = require('./lib/config');
var sessionHelper = require('./lib/sessionHelper');
var jsonResp = require('./lib/jsonResp');
var socketMaster = require('./lib/socketMaster');
var logger = require('koa-logger');
var router = require('koa-router');
var serve = require('koa-static');
var session = require('koa-session');
var views = require('co-views');
var parse = require('co-body');
var koa = require('koa');
var swig = require('swig');
var app = koa();
var Database = require('./lib/database');
var sequelize = Database.getSequelizeInstance();

var user  = require('./controllers/user');
var store  = require('./controllers/store');

//MODELS
var Store  = require('./models/store');
var Product  = require('./models/product');
var Purchase  = require('./models/purchase');
var User  = require('./models/user');
var OrderItem  = require('./models/orderItem');

//REMOVE IN PRODUCTION??
swig.setDefaults({ cache: false })

//ROUTES
app.keys = [config.sessionSecret];
app.use(session());
app.use(jsonResp());
app.use(router(app));

//PAGE ROUTES
app.get('/', index);
app.get('/login', login);
app.get('/logout', logout);
app.get('/createStore', create);
app.get('/browse', browse);
app.get('/store/:id', showStore);
app.get('/faq', faq);
app.get('/thanks', thanks);
app.get('/howThisWorks', howThisWorks);
app.get('/dashboard', dashboard);
app.get('/dashboard/:id', storeDashboard);
app.get('/public/*', serve('.'));

//API ROUTES
app.post('/api/createAccount', user.createAccount);
app.post('/api/login', user.login);

app.post('/api/store', store.create);
app.post('/api/store/:id/order', store.order);
app.get('/api/store', store.get);

//PAGE HANDLERS
function *index() {
	this.body = yield render('index', sessionHelper.commonTemplate(this.session));
}

function *thanks() {
	this.body = yield render('thankYou', sessionHelper.commonTemplate(this.session));
}

function *howThisWorks() {
	this.body = yield render('howThisWorks', sessionHelper.commonTemplate(this.session));
}

function *dashboard() {
	if(sessionHelper.isLoggedIn(this.session)){
		var userID = sessionHelper.getUserID(this.session)
		var currentUser = yield User.find(userID, {include: [Store]});
		var temp = sessionHelper.commonTemplate(this.session);
		temp.stores = yield currentUser.getStores()
		this.body = yield render('dashboard', temp);
	}else{
		var redirectUrl = "/login?redirect="+encodeURIComponent('/dashboard')+"&message="+encodeURIComponent("You must login and have a store to use the dashboard")
		this.redirect(redirectUrl);
	}
}

function *storeDashboard() {
	if(sessionHelper.isLoggedIn(this.session)){
		var store = yield Store.find(this.params.id)
		if(store.UserId == sessionHelper.getUserID(this.session)){
			var temp = sessionHelper.commonTemplate(this.session);
			temp.purchases = yield store.getPurchases({order: 'createdAt DESC', include: [{model:OrderItem, include: Product}]})
			temp.store = store;
			//console.log(temp.purchases[0].createdAt)

			this.body = yield render('storeDashboard', temp);
		}else{
			this.redirect('/');
		}
	}else{
		this.redirect('/login');
	}
}

function *create() {
	if(sessionHelper.isLoggedIn(this.session)){
		this.body = yield render('createStore', sessionHelper.commonTemplate(this.session));
	}else{
		var redirectUrl = "/login?redirect="+encodeURIComponent('/createStore')+"&message="+encodeURIComponent("You must login to create a store")
		this.redirect(redirectUrl);
	}
}

function *browse() {
	var temp = sessionHelper.commonTemplate(this.session);
	temp.stores = yield Store.findAll({limit:100});
	this.body = yield render('browse', temp);
}

function *showStore() {
	var temp = sessionHelper.commonTemplate(this.session);
	temp.store = yield Store.find(this.params.id, {include: [Product]});
	temp.products = yield temp.store.getProducts();
	temp.public_stripe_api_key = config.public_stripe_api_key
	this.body = yield render('store', temp);
}

function *logout() {
	this.session = null;
	this.redirect('/');
}

function *login() {
	this.body = yield render('login',sessionHelper.commonTemplate(this.session));
}

function *faq() {
	this.body = yield render('faq',sessionHelper.commonTemplate(this.session));
}

// function *browse() {
// 	var temp = sessionHelper.commonTemplate(this.session);
// 	temp.projects = yield projectM.getAllProjects();
// 	this.body = yield render('browse',temp);
// }

//sequelize.sync({ force: true });


//app.listen(3007);
var server = http.createServer(app.callback());
server.listen(3007);
socketMaster.init(server);

console.log('Started ----------------------------------------------');