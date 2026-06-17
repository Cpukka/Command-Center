# backend/CommandCenter.Api/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and NuGet config, then restore
COPY CommandCenter.Api.csproj .
COPY NuGet.Config .
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