#!/bin/sh
# 컨테이너 시작 시 Oracle Wallet을 Secret Manager에서 복원합니다.
# 환경변수 ORACLE_WALLET_* 가 있으면 /tmp/wallet/ 에 디코딩하여 저장합니다.

if [ -n "$ORACLE_WALLET_CWALLET_SSO" ]; then
  mkdir -p /tmp/wallet
  printf '%s' "$ORACLE_WALLET_CWALLET_SSO"   | base64 -d > /tmp/wallet/cwallet.sso
  printf '%s' "$ORACLE_WALLET_EWALLET_P12"   | base64 -d > /tmp/wallet/ewallet.p12
  printf '%s' "$ORACLE_WALLET_TNSNAMES_ORA"  | base64 -d > /tmp/wallet/tnsnames.ora
  printf '%s' "$ORACLE_WALLET_SQLNET_ORA"    | base64 -d > /tmp/wallet/sqlnet.ora
  export TNS_ADMIN=/tmp/wallet
  echo "[entrypoint] Oracle Wallet restored → TNS_ADMIN=/tmp/wallet"
fi

exec node dist/main
