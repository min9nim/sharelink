#!/bin/sh
str=`git branch | grep "*"`
echo "Current branch : " "$str"

npm run build

if [ "$str" == "* master" ];then
    gcloud config set project sharelink-nextjs
else
    gcloud config set project sharelink-dev
fi

gcloud app deploy --quiet


