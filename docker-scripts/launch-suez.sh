#!/bin/sh

# This is a wrapped to determine if we launch via PM2 (watching) or nodejs
if [ "$WATCH" = "true" ]; then
  DOCKER=true pm2-runtime /app/suez/app.js --watch;
else
  DOCKER=true node /app/suez/app.js docker
fi
