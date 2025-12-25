# Étape 1: Construction avec Maven et Java 21
# On utilise une image "temurin" qui est une version de OpenJDK fournie par la fondation Eclipse.
# Ce n'est PAS l'IDE Eclipse, mais simplement une source fiable pour Java.
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copier le fichier pom.xml et télécharger les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline

# Copier le reste du code source et construire l'application
COPY src ./src
RUN mvn package -DskipTests

# Étape 2: Exécution de l'application avec un JRE 21
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copier le fichier .jar construit depuis l'étape de construction
COPY --from=build /app/target/*.jar app.jar

# Exposer le port sur lequel l'application s'exécute
EXPOSE 8080

# Commande pour lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]