# ---- Build Stage ----
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy pom.xml first to cache dependency download layer
COPY pom.xml .
RUN mvn -B dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN mvn -B package -DskipTests -q

# Extract layered jar for efficient Docker layer caching
RUN java -Djarmode=layertools -jar target/*.jar extract --destination /app/extracted

# ---- Development Stage (used by docker-compose.override.yml) ----
FROM eclipse-temurin:21-jre-alpine AS development
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# ---- Production Stage (layered for minimal image rebuild on code-only changes) ----
FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app

# Install curl for ECS health checks
RUN apk add --no-cache curl

# Copy layers in order of change frequency (least → most)
COPY --from=builder /app/extracted/dependencies/ ./
COPY --from=builder /app/extracted/spring-boot-loader/ ./
COPY --from=builder /app/extracted/snapshot-dependencies/ ./
COPY --from=builder /app/extracted/application/ ./

EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
