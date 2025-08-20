# =========================
# STAGE 1 — Build
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Cache do restore (copie SOMENTE os .csproj e a .sln)
COPY SIGE.sln ./
COPY src/SIGE/SIGE.csproj src/SIGE/
COPY src/SIGE.Core/SIGE.Core.csproj src/SIGE.Core/
COPY src/SIGE.Services/SIGE.Services.csproj src/SIGE.Services/
COPY src/SIGE.Calculos/SIGE.Calculos.csproj src/SIGE.Calculos/
COPY src/SIGE.Database/SIGE.DataAccess.csproj src/SIGE.Database/

# Restore sem RID (evita incompatibilidades desnecessárias)
RUN dotnet restore SIGE.sln

# Agora copie o restante do código
COPY . .

# Publica o projeto web
RUN dotnet publish src/SIGE/SIGE.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# =========================
# STAGE 2 — Runtime
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# curl p/ healthcheck
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

# Copia os artefatos publicados
COPY --from=build /app/publish ./

# Usuário não-root
RUN adduser --disabled-password --home /app appuser \
 && chown -R appuser /app
USER appuser

# Porta local padrão; Coolify/Render definem PORT em runtime
ENV PORT=5000
# Importante: ASPNETCORE_URLS com valor fixo (5000); no entrypoint a gente sobrescreve com --urls expandindo ${PORT}
ENV ASPNETCORE_URLS=http://0.0.0.0:5000

EXPOSE 5000

# Healthcheck: tenta /health, senão /
#HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
#  CMD sh -c 'curl -fsS "http://127.0.0.1:${PORT}/health" || curl -fsS "http://127.0.0.1:${PORT}/" || exit 1'

# ENTRYPOINT com expansão de ${PORT} (funciona no Coolify)
# Se PORT existir, usa; senão cai para 5000 (mesmo da EXPOSE/ASPNETCORE_URLS).
ENTRYPOINT sh -c 'unset ASPNETCORE_HTTPS_PORTS; exec dotnet SIGE.dll --urls "http://0.0.0.0:${PORT:-5000}"'
