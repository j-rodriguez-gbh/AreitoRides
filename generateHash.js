const bcrypt = require('bcrypt');

const password = 'admin';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Hash para la contraseña "admin":', hash);
}); 