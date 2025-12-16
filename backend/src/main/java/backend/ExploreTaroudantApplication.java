package backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EntityScan(basePackages = "backend.entities")
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "backend.repositories")
@ComponentScan(basePackages = {"backend", "backend.repositories"})
public class ExploreTaroudantApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExploreTaroudantApplication.class, args);
    }
}