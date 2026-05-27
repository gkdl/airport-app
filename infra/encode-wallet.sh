#!/bin/bash
# Oracle Wallet 파일을 base64로 인코딩해서 출력합니다.
# GCP Secret Manager에 등록하기 전 값을 확인하거나 수동으로 등록할 때 사용합니다.
#
# 사용법:
#   bash infra/encode-wallet.sh ./wallet
#   bash infra/encode-wallet.sh ./wallet > wallet-secrets.txt  # 파일로 저장 (주의: 민감 정보)

set -e

WALLET_DIR=${1:-./wallet}

if [ ! -d "$WALLET_DIR" ]; then
  echo "❌ wallet 디렉토리가 없습니다: $WALLET_DIR"
  echo "   사용법: bash infra/encode-wallet.sh <wallet-directory>"
  exit 1
fi

required_files=("cwallet.sso" "ewallet.p12" "tnsnames.ora" "sqlnet.ora")
for f in "${required_files[@]}"; do
  if [ ! -f "$WALLET_DIR/$f" ]; then
    echo "❌ 필수 파일 없음: $WALLET_DIR/$f"
    exit 1
  fi
done

echo "# Oracle Wallet base64 인코딩 결과"
echo "# Secret Manager 등록 명령어 (PROJECT_ID 를 실제 값으로 교체)"
echo ""

for f in cwallet.sso ewallet.p12 tnsnames.ora sqlnet.ora; do
  secret_name="airport-oracle-wallet-$(echo "$f" | tr '.' '-')"
  encoded=$(base64 -w0 "$WALLET_DIR/$f")
  echo "# $f"
  echo "echo '$encoded' | gcloud secrets versions add $secret_name --data-file=-"
  echo ""
done

echo "# tnsnames.ora 의 alias (DB_CONNECT_STRING) 확인:"
grep -oP '^\s*\K[A-Za-z0-9_]+(?=\s*=\s*\()' "$WALLET_DIR/tnsnames.ora" 2>/dev/null \
  | sed 's/^/  /' || echo "  (tnsnames.ora 파싱 불가 — 직접 확인 필요)"
