# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/CommandCenter.Api/CommandCenter.Api.csproj CommandCenter.Api/
RUN dotnet restore CommandCenter.Api/CommandCenter.Api.csproj

COPY backend/CommandCenter.Api/ CommandCenter.Api/
RUN dotnet publish CommandCenter.Api/CommandCenter.Api.csproj -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

COPY --from=build /app/out .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["./CommandCenter.Api"]
