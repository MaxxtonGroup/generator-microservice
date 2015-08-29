package <%= packageName %>;

import java.io.IOException;
import java.util.Arrays;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.SimpleCommandLinePropertySource;



import java.util.Arrays;

/**
 * Maxxton Microservice main class for <%= baseName %>.
 *
 * @author <%= author %>
 * @copyright Maxxton Group <%= currentYear %>
 */
@SpringBootApplication
@EnableDiscoveryClient
public class <%= mainClassName %>
{
  private final static Logger log = LoggerFactory.getLogger(<%= mainClassName %>.class);

  @Autowired
  private ConfigurableEnvironment environment;

  public static void main(String[] args)
  {
    SpringApplication app = new SpringApplication(<%= mainClassName %>.class);
    SimpleCommandLinePropertySource source = new SimpleCommandLinePropertySource(args);
    ConfigurableApplicationContext applicationContext = app.run(args);
  }

  /**
   * Initializes application.
   * <p/> Spring profiles can be configured with a program arguments --spring.profiles.active=your-active-profile <p/>
   */
  @PostConstruct
  public void initApplication() throws IOException
  {
    if (environment.getActiveProfiles().length == 0)
    {
      log.warn("No Spring profile configured, running with default configuration");
      environment.setActiveProfiles("development");
    }
    else
    {
      log.info("Running Maxxton service with Spring profile(s) : {}", Arrays.toString(environment.getActiveProfiles()));
    }
  }

}
