'use strict';

var winston = require('../config/winston');
var morgan = require('morgan');
var middleware = require('../middleware/checktoken');
var suppliers = require('../controllers/suppliers');
var users = require('../controllers/users');
var products = require('../controllers/products')


module.exports = exports = function(server){
    //cors
    var corsMiddleware = require('restify-cors-middleware');
    
    var cors = corsMiddleware({
        origin : ['*'],
        allowHeaders: ['authorization']
    });

    server.pre(cors.preflight);
    server.use(cors.actual);

    // supplirs route
    server.get('/api/suppliers/', middleware.checkToken, suppliers.getAllSuppliers);
    server.get('/api/suppliers/:id', middleware.checkToken, suppliers.getAllById);
    server.post('/api/suppliers/', middleware.checkToken, suppliers.CreatedSuppliers);
    server.put('/api/suppliers/:id', middleware.checkToken, suppliers.UpdateSupplier);
    server.del('/api/suppliers/:id', middleware.checkToken, suppliers.DeleteSupplier);

    //Products
    server.get('/api/products/', middleware.checkToken, products.getAllProducts);
    server.get('/api/products/:id', middleware.checkToken, products.getAllProductsById);
    server.post('/api/products/', middleware.checkToken, products.CreatedProducts);
    server.put('/api/products/:id', middleware.checkToken, products.UpdateProducts);
    server.del('/api/products/:id', middleware.checkToken, products.DeleteProducts);

    //users
    server.post('/api/login', users.Login);
    server.get('/api/logout', middleware.checkToken, users.Logout);
    server.post('/api/users/', users.CreateUsers);


    server.use(function(err, req, res, next){
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        
        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        if (err.name === 'UnauthorizedError') {
            res.status(401).json({ status: 0, code: 401, type: "unauthorised", message: err.name + ": " + err.message });
        } else {
            res.status(404).json({ status: 0, code: 404, type: "ENOENT", message: "file not found" });
        }

        res.status(err.status || 500);
        res.render('error');
    });

    server.use(morgan('combined', { stream: winston.stream}));
}