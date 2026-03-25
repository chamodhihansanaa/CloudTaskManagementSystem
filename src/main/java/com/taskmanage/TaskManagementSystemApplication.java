package com.taskmanage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class TaskManagementSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskManagementSystemApplication.class, args);
    }
}


//@EnableEurekaServer
//public class EurekaServerApplication {
//    public static void main(String[] args) {
//        SpringApplication.run(EurekaServerApplication.class, args);
//    }
//}
