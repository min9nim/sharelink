#!/bin/sh
npm run build
gcloud config set project sharelink-nextjs
gcloud app deploy --quiet