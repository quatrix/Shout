FROM node:8.4.0

RUN curl https://install.meteor.com/ | sh

ADD package.json /opt/shout/package.json
ADD yarn.lock /opt/shout/yarn.lock

WORKDIR /opt/shout
RUN yarn install

ADD client /opt/shout/client
ADD server /opt/shout/server
ADD collections.js /opt/shout/collection.js
ADD .meteor /opt/shout/.meteor

RUN useradd -ms /bin/bash meteor
RUN chown -Rh meteor .meteor
USER meteor
RUN meteor update

ENTRYPOINT ["yarn", "run"]
