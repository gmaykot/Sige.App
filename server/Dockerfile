# =========================
# STAGE 1 — Build
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Cache de restore
COPY ./SIGE.sln ./
COPY ./src/SIGE/*.csproj ./src/SIGE/
COPY ./src/SIGE.Core/*.csproj ./src/SIGE.Core/
COPY ./src/SIGE.Services/*.csproj ./src/SIGE.Services/
COPY ./src/SIGE.Calculos/*.csproj ./src/SIGE.Calculos/
COPY ./src/SIGE.Database/*.csproj ./src/SIGE.Database/

RUN dotnet restore SIGE.sln -r linux-x64

# Código fonte
COPY . .

# Publica o projeto Web
RUN dotnet publish ./src/SIGE/SIGE.csproj \
    -c Release \
    -r linux-x64 \
    --no-restore \
    -o /app/publish \
    /p:UseAppHost=false

# =========================
# STAGE 2 — Runtime
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# curl p/ healthcheck
USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

# usuário não-root
RUN adduser --disabled-password --home /app appuser \
 && chown -R appuser /app
USER appuser

# artefatos
COPY --from=build /app/publish ./

# Porta padrão local; em produção o Coolify define PORT
ENV PORT=5000
EXPOSE 5000

# Healthcheck: tenta /health; se não existir, tenta /
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD sh -c 'curl -fsS "http://127.0.0.1:${PORT}/health" || curl -fsS "http://127.0.0.1:${PORT}/" || exit 1'

# Respeita $PORT (Coolify/Render/etc). Local sem PORT => 5000.
ENTRYPOINT ["sh", "-c", "exec dotnet SIGE.dll --urls http://0.0.0.0:${PORT:-5000}"]
