package <%= packageName %>;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * Maxxton Microservice main class 
 *
 * @author <%= author %>
 * @copyright Maxxton Group <%= currentYear %>
 */
@EnableAutoConfiguration
@ComponentScan
@EnableDiscoveryClient
public class <%= mainClassName %>
{

  private final static Logger log = LoggerFactory.getLogger(NwsprotoBootApplication.class);

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
      configurableEnvironment.setActiveProfiles("development");
    }
    else
    {
      log.info("Running Maxxton service with Spring profile(s) : {}", Arrays.toString(environment.getActiveProfiles()));
    }
  }

}
