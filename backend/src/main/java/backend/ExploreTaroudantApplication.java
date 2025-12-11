package backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.ExploreTaroudant.entities")
@EnableJpaRepositories(basePackages = "repositories")
@ComponentScan(basePackages = {"backend", "com.ExploreTaroudant", "repositories"})
public class ExploreTaroudantApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExploreTaroudantApplication.class, args);
    }
}