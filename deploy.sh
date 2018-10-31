#!/bin/sh
npm run build
gcloud config set project sharelink-min
gcloud app deploy --quiet