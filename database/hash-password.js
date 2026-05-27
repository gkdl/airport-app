#!/usr/bin/env node
// 사용법: node database/hash-password.js <비밀번호>
// 출력된 해시를 seed-admin.sql 의 PASSWORD_HASH 에 붙여넣기

const bcrypt = require('bcrypt');
const password = process.argv[2];

if (!password) {
  console.error('Usage: node hash-password.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log(hash);
});
