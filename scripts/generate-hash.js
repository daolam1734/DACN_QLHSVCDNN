const bcrypt = require('bcryptjs');

// Tạo hash cho password
const password = '123456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nCopy hash này vào SQL script:');
  console.log(hash);
});
