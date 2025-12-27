# Étape 1: Construction
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copier uniquement le pom.xml pour mettre en cache les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copier le code source
COPY src ./src

# 3. Construire le JAR (Ici on spécifie la classe principale si nécessaire, 
# mais normalement Maven la trouve si la structure est standard)
RUN mvn clean package -DskipTests

# Étape 2: Exécution
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copier le JAR généré à l'étape précédente
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]