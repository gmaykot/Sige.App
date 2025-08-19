# =========================
# STAGE 1 — Build
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia apenas a solution e os csproj para aproveitar cache no restore
COPY ./SIGE.sln ./
COPY ./src/SIGE/*.csproj ./src/SIGE/
COPY ./src/SIGE.Core/*.csproj ./src/SIGE.Core/
COPY ./src/SIGE.Services/*.csproj ./src/SIGE.Services/
COPY ./src/SIGE.Calculos/*.csproj ./src/SIGE.Calculos/
COPY ./src/SIGE.Database/*.csproj ./src/SIGE.Database/

# Restore na solution (resolve todas as dependências)
RUN dotnet restore SIGE.sln -r linux-x64

# Copia o restante do código
COPY . .

# Publica apenas o projeto principal (ajuste o caminho se necessário)
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

# (Opcional) Instala curl pro healthcheck
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Cria usuário não-root
RUN adduser --disabled-password --home /app appuser \
    && chown -R appuser /app
USER appuser

# Copia os artefatos publicados
COPY --from=build /app/publish ./

# Porta "padrão" para quem roda local; no Coolify a PORT é injetada
ENV PORT=5000
EXPOSE 5000

# Healthcheck (se existir /health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/health" || exit 1

# Importante: respeita a variável $PORT (Coolify/Render/etc)
ENTRYPOINT ["sh", "-c", "exec dotnet SIGE.dll --urls http://0.0.0.0:${PORT:-5000}"]
