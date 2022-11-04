# pull the base image
FROM node:alpine as build

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY package-lock.json ./

RUN npm install

# add app
COPY . ./
RUN npm run build
FROM nginx:stable-alpine
COPY ["./nginx/env.sh", "/docker-entrypoint.d/env.sh"]
RUN mkdir -p /etc/nginx/templates
COPY ./nginx/default.conf.template /etc/nginx/templates
RUN chown nginx:nginx /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html
# start app
#CMD ["npm", "start"]
