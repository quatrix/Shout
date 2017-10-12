FROM node:8.4.0

RUN useradd -ms /bin/bash meteor
RUN curl https://install.meteor.com/ | sh

ADD package.json /opt/shout/package.json
ADD yarn.lock /opt/shout/yarn.lock

WORKDIR /opt/shout
RUN yarn install

ADD .meteor .meteor
RUN chown -Rh meteor .meteor
USER meteor

RUN meteor update

ADD client client
ADD server server
ADD collections.js collections.js
ADD public public

ENTRYPOINT ["yarn", "run"]
