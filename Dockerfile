FROM node:10-alpine
# Remember to use the `--squash` option with Docker.

WORKDIR /app
ADD . /app
ENV NODE_ENV production
RUN npm install
RUN touch /var/log/access.log

ENTRYPOINT ["node", "cli.js"]
CMD ["tail"]
