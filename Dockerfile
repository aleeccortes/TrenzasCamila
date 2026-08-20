FROM maven:3.9.9-eclipse-temurin-21 AS build
ARG MAVEN_OPTS=""
WORKDIR /workspace
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B clean verify

FROM eclipse-temurin:21-jre-jammy
RUN groupadd --system spring \
    && useradd --system --gid spring --home-dir /app spring
WORKDIR /app
COPY --from=build --chown=spring:spring /workspace/target/proycamila-*.jar app.jar
USER spring:spring
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl --fail --silent http://localhost:8080/actuator/health/readiness || exit 1
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-XX:+UseG1GC", "-jar", "/app/app.jar"]
