#!/bin/env node
/*     
 Copyright (C) 2015 Driven Solutions (www.drivensolutions.com)
 All rights reserved.
 
 Copyright (C) 2015 Ken Williamson
 All rights reserved.
 Copyright (C) 2015 Chris Williamson
 All rights reserved.
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 
 
 Author: Ken Williamson (ken@ulboralabs.com) 
 */
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var logger = require('morgan');
var basicAuth = require('basic-auth');
var formproc = require('./formprocessor');




var ulboraIMS = function () {
    //  Scope.
    var self = this;
    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */
    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.ULBORACMS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || process.env.ULBORACMS_PORT || 3000;


        if (typeof self.ipaddress === "undefined") {
            //  Log errors but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No IP address defined, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
        ;
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                    Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
            process.on(element, function () {
                self.terminator(element);
            });
        });
    };

    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {

        self.app = express();
        self.app.use(logger('dev'));
        self.app.use(bodyParser.json());
        self.app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
        self.app.use(multer()); // for parsing multipart/form-data
        //self.app.use(express.cookieParser('7320s932h79993Ah4'));
        //self.app.use(express.cookieSession());
        self.app.use(express.static(__dirname + '/public'));
        


        //address
        //self.app.post('/rs/address', addressService.create);
       
        self.app.post('/rs/form/process', function (req, res) {            
            console.log("body in server" + JSON.stringify(req.body));
            formproc.process(req, res, function(urlValue){
                res.redirect(urlValue);
            });           

        });


        self.app.get('/rs/test', function (req, res) {
            var credentials = basicAuth(req);
            authenticate(credentials, function (success) {
                if (success) {
                    res.send([{code: 2, name: "ken"}, {name: 'wine2'}]);
                } else {
                    reject(res);
                }
            });

        });

        self.app.use(errorHander);

    };

    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.setupTerminationHandlers();
        // Create the express server and routes.
        self.initializeServer();
    };

    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                    Date(Date.now()), self.ipaddress, self.port);
        });
    };
};

var errorHander = function (req, res) {
    //res.status(404).send('Something broke!');
    res.status(404).sendfile("public/error.html");
};

var authenticate = function (creds, callback) {
    if (!creds || creds.name !== un || creds.pass !== pw) {
        callback(false);
    } else {
        callback(true);
    }
};

var reject = function (res) {
    res.status(401);
    res.send();
};

/**
 *  main():  Main code.
 */
var zapp = new ulboraIMS();
zapp.initialize();
zapp.start();