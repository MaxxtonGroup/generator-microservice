package <%= packageName %>;

import java.io.IOException;
import java.util.Arrays;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.system.ApplicationPidFileWriter;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.SimpleCommandLinePropertySource;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
<% if (dataJpaEnabled) { %>
import com.maxxton.multi.concern.EnableMultiConcern;
<% } %>
import com.maxxton.spring.boot.annotation.EnableMaxxtonTools;

/**
 * Maxxton Microservice main class for <%= baseName %>.
 *
 * @author <%= author %>
 * Maxxton Group <%= currentYear %>
 */
@EnableCircuitBreaker
@EnableMaxxtonTools
@SpringBootApplication
@EnableResourceServer
@EnableDiscoveryClient <% if (dataJpaEnabled) { %>
@EnableMultiConcern<% } %>
public class <%= mainClassName %>
{
  private final static Logger log = LoggerFactory.getLogger(<%= mainClassName %>.class);

  @Autowired
  private ConfigurableEnvironment environment;

  public static void main(String[] args)
  {
    SpringApplication app = new SpringApplication(<%= mainClassName %>.class);
    app.addListeners(new ApplicationPidFileWriter("<%= baseName %>.pid"));
    SimpleCommandLinePropertySource source = new SimpleCommandLinePropertySource(args);
    ConfigurableApplicationContext applicationContext = app.run(args);
  }

  /**
   * Initializes application.
   * <p>
   * Spring profiles can be configured with a program arguments --spring.profiles.active=your-active-profile
   */
  @PostConstruct
  public void initApplication()
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
