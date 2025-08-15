# Etapa 1: build do Angular
FROM node:20-alpine AS build
WORKDIR /app

# Copia lock e package para aproveitar cache
COPY package*.json ./

# Aceita peer deps legados para contornar o conflito com Angular 15
ENV npm_config_legacy_peer_deps=true
RUN npm ci --legacy-peer-deps

# Copia o resto do projeto e builda
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Nginx para servir SPA
FROM nginx:1.27-alpine

# Remove default e aplica nossa config (sem brotli)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os artefatos do Angular
# >>> ajuste <app-name> conforme seu angular.json (outputPath)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
