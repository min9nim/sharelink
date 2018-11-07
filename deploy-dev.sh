#!/bin/sh
echo "Deploy development.."

npm run build
gcloud config set project sharelink-dev
gcloud app deploy --quiet