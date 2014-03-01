var bcrypt = require('bcryptjs');
var Q = require('q');

exports.crypt = function(string){
    var def = Q.defer();
    bcrypt.genSalt(10, function(err, salt) {
        if(err){
            def.reject(err);
        }else{
            bcrypt.hash(string, salt, function(err, hash) {
                if(err){
                    def.reject(err);
                }else{
                    def.resolve(hash);
                }
            });
        }
    });
    return def.promise;
}
exports.compareStringHash = function(string, hash){
    var def = Q.defer();
    bcrypt.compare(string, hash, function(err, res) {
        if(err){
            def.reject(err);
        }else{
            if (res) {
                def.resolve(true);
            } else {
                def.resolve(false);
            }
        }
    });
    return def.promise;
}