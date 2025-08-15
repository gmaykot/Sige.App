# Etapa 1: build do Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# ajuste o --configuration se usar outro (ex.: production)
RUN npm run build -- --configuration=production

# Etapa 2: Nginx para servir SPA
FROM nginx:1.27-alpine
# Gzip/Brotli (brotli é opcional; requer módulos)
RUN apk add --no-cache brotli
# Apaga config padrão e copia a custom
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os artefatos Angular
# Ajuste 'dist/<app-name>' para o nome da sua pasta de build
COPY --from=build /app/dist/<app-name> /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
