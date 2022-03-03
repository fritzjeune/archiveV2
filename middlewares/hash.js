// jshint esversion:9

const bcrypt = require('bcryptjs');

bcrypt.genSalt(10, (err, salt) => {
    console.log(salt);
    if (err) return next(err);

    bcrypt.hash('password', salt , (err, hash) => {
        if(err) return next(err);
        console.log(hash);
    });
}); 