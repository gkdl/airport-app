#!/bin/bash
# GCP Secret Manager 초기화 스크립트
# 실행 전: gcloud auth login && gcloud config set project YOUR_PROJECT_ID

set -e

PROJECT_ID=$(gcloud config get-value project)
echo "Project: $PROJECT_ID"

create_secret() {
  local name=$1
  local value=$2
  if gcloud secrets describe "$name" --project="$PROJECT_ID" &>/dev/null; then
    echo "  [UPDATE] $name"
    echo -n "$value" | gcloud secrets versions add "$name" --data-file=- --project="$PROJECT_ID"
  else
    echo "  [CREATE] $name"
    echo -n "$value" | gcloud secrets create "$name" --data-file=- --project="$PROJECT_ID" --replication-policy=automatic
  fi
}

echo "=== Creating Airport App Secrets ==="

# DB 접속 정보 — 실제 값으로 교체
create_secret "airport-db-host"     "YOUR_ORACLE_DB_HOST"
create_secret "airport-db-user"     "airport_user"
create_secret "airport-db-password" "YOUR_DB_PASSWORD"

# Redis (Cloud Memorystore)
create_secret "airport-redis-host"     "YOUR_REDIS_HOST"
create_secret "airport-redis-password" "YOUR_REDIS_PASSWORD"

# JWT
create_secret "airport-jwt-secret" "$(openssl rand -base64 32)"

# 공공데이터포털 API 키 (3개 서비스 동일한 키)
DATA_GO_KR_KEY="72c38aa5702634c276f66dfe788ef1a0d73de7625e521dc79c680107bacbea39"
create_secret "airport-incheon-api-key" "$DATA_GO_KR_KEY"
create_secret "airport-kac-api-key"     "$DATA_GO_KR_KEY"
create_secret "airport-kma-api-key"     "$DATA_GO_KR_KEY"

# Firebase
create_secret "airport-firebase-project-id"    "YOUR_FIREBASE_PROJECT_ID"
create_secret "airport-firebase-client-email"  "YOUR_FIREBASE_CLIENT_EMAIL"
create_secret "airport-firebase-key"           "YOUR_FIREBASE_PRIVATE_KEY"

# Slack
create_secret "airport-slack-webhook" "YOUR_SLACK_WEBHOOK_URL"

echo ""
echo "=== Secret Manager 등록 완료 ==="
echo "Cloud Run 서비스 계정에 roles/secretmanager.secretAccessor 권한 부여 필요:"
echo "  gcloud projects add-iam-policy-binding $PROJECT_ID \\"
echo "    --member='serviceAccount:SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com' \\"
echo "    --role='roles/secretmanager.secretAccessor'"
