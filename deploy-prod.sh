#!/bin/sh
echo "Deploy production.."

npm run build
gcloud config set project sharelink-nextjs
gcloud app deploy --quiet