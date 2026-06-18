# backend/CommandCenter.Api/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY CommandCenter.Api.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app .

# REMOVE THESE LINES (they cause the error)
# RUN addgroup --system --gid 1001 appuser && \
#     adduser --system --uid 1001 appuser
# USER appuser

ENTRYPOINT ["dotnet", "CommandCenter.Api.dll"]