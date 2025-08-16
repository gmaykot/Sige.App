# =========================
# STAGE 1 — Build
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os csproj primeiro (cache eficiente)
COPY ./src/SIGE/SIGE.csproj ./SIGE/
COPY ./src/SIGE.Core/SIGE.Core.csproj ./SIGE.Core/
COPY ./src/SIGE.Services/SIGE.Services.csproj ./SIGE.Services/
COPY ./src/SIGE.Calculos/SIGE.Calculos.csproj ./SIGE.Calculos/
COPY ./src/SIGE.Database/SIGE.DataAccess.csproj ./SIGE.Database/

RUN dotnet restore -r linux-x64 ./SIGE/SIGE.csproj

# Copia todo o restante do código
COPY . .

# Publica o projeto principal (SIGE)
RUN dotnet publish ./SIGE/SIGE.csproj -c Release --no-restore -o /app/publish /p:UseAppHost=false

# =========================
# STAGE 2 — Runtime
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Variáveis básicas
ENV DOTNET_EnableDiagnostics=0

# Cria usuário não-root
RUN adduser --disabled-password --home /app appuser && chown -R appuser /app
USER appuser

COPY --from=build /app/publish ./

EXPOSE 5000

# Opcional: healthcheck (se tiver endpoint /health no seu app)
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

ENTRYPOINT ["dotnet", "SIGE.dll"]
