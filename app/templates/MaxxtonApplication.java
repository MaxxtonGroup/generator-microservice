package <%= packageName %>;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

/**
 * Maxxton Microservice main class 
 *
 * @author <%= author %>
 * @copyright Maxxton Group <%= currentYear %>
 */
@EnableAutoConfiguration
@ComponentScan
public class <%= mainClassName %>
{

  public static void main(String[] args)
  {
    SpringApplication.run(<%= mainClassName %>.class, args);
  }
}
