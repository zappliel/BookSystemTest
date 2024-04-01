package org.zjuse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@SpringBootApplication
@RestController
@EnableJpaAuditing
public class Main {

	public static void main(String[] args) {
		try {
			SpringApplication.run(Main.class, args);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}