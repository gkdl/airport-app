-- 최초 관리자 계정 생성 스크립트
-- 실행 전: PASSWORD_HASH 값을 bcrypt로 생성한 해시로 교체
--   node -e "const b=require('bcrypt'); b.hash('YOUR_PASSWORD',10).then(console.log)"
--
-- 예) 비밀번호 "admin1234" 의 bcrypt 해시(rounds=10):
--   $2b$10$...

INSERT INTO ADMIN_USER (
  ADMIN_ID,
  EMAIL,
  PASSWORD_HASH,
  NAME,
  ROLE,
  IS_ACTIVE
) VALUES (
  SYS_GUID(),
  'admin@airport.local',
  '$2b$10$REPLACE_WITH_BCRYPT_HASH',
  '시스템 관리자',
  'ADMIN',
  1
);

COMMIT;
