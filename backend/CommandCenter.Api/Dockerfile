# backend/CommandCenter.Api/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

ENV DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 \
    DOTNET_NOLOGO=1 \
    NUGET_FALLBACK_PACKAGES=""

# Copy csproj and restore
COPY CommandCenter.Api.csproj .
RUN dotnet restore

# Copy everything else (including the correct Program.cs)
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app .

RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 appuser
USER appuser

ENTRYPOINT ["dotnet", "CommandCenter.Api.dll"]