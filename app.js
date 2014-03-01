var render = require('./lib/render');
var config = require('./lib/config');
var sessionHelper = require('./lib/sessionHelper');
var jsonResp = require('./lib/jsonResp');
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

var Store  = require('./models/store');
var Product  = require('./models/store');

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
app.get('/public/*', serve('.'));

//API ROUTES
app.post('/api/createAccount', user.createAccount);
app.post('/api/login', user.login);

app.post('/api/store', store.create);
app.get('/api/store', store.get);

//PAGE HANDLERS
function *index() {
	this.body = yield render('index', sessionHelper.commonTemplate(this.session));
}

function *create() {
	if(sessionHelper.isLoggedIn(this.session)){
		this.body = yield render('createStore', sessionHelper.commonTemplate(this.session));
	}else{
		this.redirect('/login');
	}
}

function *browse() {
	var temp = sessionHelper.commonTemplate(this.session);
	temp.stores = yield Store.findAll({limit:100});
	console.log(temp.stores);
	this.body = yield render('browse', temp);
}

function *showStore() {
	var temp = sessionHelper.commonTemplate(this.session);
	temp.store = yield Store.find(this.params.id, {include: [Product]});
	temp.products = yield temp.store.getProducts();
	console.log(temp.products)
	console.log(temp.store)
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


app.listen(3007);
console.log('Started ----------------------------------------------');