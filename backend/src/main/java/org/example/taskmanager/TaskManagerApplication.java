package org.example.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "org.example.taskmanager.repository")
public class TaskManagerApplication {

	public static void main(String[] args) {

		SpringApplication.run(TaskManagerApplication.class, args);
	}

}
