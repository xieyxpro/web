var validator = require('../public/javascripts/validator');
var bcrypt = require('bcrypt-nodejs-as-promised');
var debug = require('debug')('blog:userController');
var ObjectID = require('mongodb').ObjectID;

function isEmpty(obj) {
    for (var name in obj) {
    	return false;
    }
    return true;
}

module.exports = function(db) {
	var users = db.collection('users');

	var userController = {
		signinUser: function(user) {
			console.log('signinUser');
			return new Promise(function(resolve, reject) {
				userController.getUserByUserName(user.name).then(function(foundUser) {
					bcrypt.compare(user.pwd, foundUser.pwd).then(function() {
						resolve(foundUser);
					}).catch(function(error) {
						reject({pwd: "Incorrect password"});
					});
				}).catch(function(error) {
					reject({name: 'No such user exists'});
				})
			});
		},
		signupUser: function(user) {
			console.log('signupUser');
			return userController.checkUser(user).then(function() {
				return bcrypt.hash(user.pwd, 10).then(function(pwd) {
					user.pwd = pwd;
					if (user.rpwd) delete user.rpwd;
					return users.insert(user).then(function(resultArr) {
						user._id = resultArr.insertedIds[1];
						return Promise.resolve(user);
					});
				});
			});
		},
		getUserById: function(userId) {
			console.log('getUserById');
			return new Promise(function(resolve, reject) {
				userId = ObjectID(userId);
				users.findOne({_id: userId}, {name: true, email: true}).then(function(foundUser) {
					foundUser ? resolve(foundUser) : reject('No such user exists');
				});
			});
		},
		getUserByUserName: function(username) {
			console.log('getUserByUserName');
			return new Promise(function(resolve, reject) {
				return users.findOne({name: username}).then(function(foundUser) {
					foundUser ? resolve(foundUser) : reject('No such user exists');
				});
			});
		},
		checkUser: function(user) {
			console.log('checkUser');
			var error = {};
			for (var item in validator.finalCheck) {
				if (!validator.finalCheck[item](user[item])) {
					error[item] = "Invalid format";
				}
			}
			return users.findOne({name: user.name}).then(function(foundUser) {
				if (foundUser) {
					error['name'] = "'" + user.name + "' has been taken";
				}
				return Promise.resolve();
			}).then(function() {
				return isEmpty(error) ? Promise.resolve() : Promise.reject(error);
			});
		}
	}
	return userController;
}