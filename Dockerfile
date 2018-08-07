# Original source from https://hub.docker.com/_/node/
FROM node:alpine
MAINTAINER Martin DSouza <martin@talkapex.com>


# ENV TZ="GMT" \
WORKDIR /app
USER root
RUN apk add \
  git && \
  chmod 777 /app

  
USER node
# RUN TODO RESTORE git clone https://github.com/fuzziebrain/suez.git && \
RUN git clone https://github.com/martindsouza/suez.git && \
  cd suez && \
  rm -rf config && \
  npm install
  
# Volumes:
VOLUME ["/app/suez/config"]

# Ports
EXPOSE 3000

# Enable this if you want the container to permanently run
# CMD ["/bin/sh"]
CMD node /app/suez/app.js docker

# ENTRYPOINT pm2 start suez/app.js -- --docker --watch
# CMD ["run"]
# pm2 start suez/app.js --watch
