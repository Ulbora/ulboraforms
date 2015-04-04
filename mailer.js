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
var nodemailer = require('nodemailer');

exports.sendMail = function (reqBody, callback) {
    var name = reqBody.name;
    var emailAddress = reqBody.email;
    var phone = reqBody.phone;
    var message = reqBody.message;
    createTransport(function (transporter) {
        var mailOptions = {
            from: emailAddress, // sender address
            to: "sendToEmail", // list of receivers
            subject: "contact form message", // Subject line
            text: "Message from: " + name + " Phone: " + phone + " Message: " + message,
            html: '' // html body
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("email error message:" + error);
                callback(false);
            } else {
                console.log('Message sent: ' + info.response);
                callback(true);
            }
        });

    });

};


createTransport = function (callback) {
    var tpOpt = {
        host: "mail.somedomain.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 415, // port for secure SMTP
        debug: true,
        auth: {
            user: "username",
            pass: "password"
        },
        tls: {
            rejectUnauthorized: false
        }
    };
    console.log("mail server options: " + JSON.stringify(tpOpt));
    var transport = nodemailer.createTransport(tpOpt);
    callback(transport);

};
