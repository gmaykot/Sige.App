# Build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
ENV npm_config_legacy_peer_deps=true
RUN npm ci --legacy-peer-deps
COPY . .

# substitui placeholder pelo valor da env do Coolify
RUN sed -i "s|\${BASE_API_URL}|${BASE_API_URL}|g" src/environments/environment.prod.ts

RUN npm run build -- --configuration=production

# Nginx
FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# seu angular.json já solta em dist (sem subpasta)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
# ajuda o Coolify/Traefik a saber quando está pronto
RUN apk add --no-cache wget
HEALTHCHECK --interval=20s --timeout=3s --retries=3 CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
