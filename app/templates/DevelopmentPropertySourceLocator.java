package <%= packageName %>.config;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.cloud.bootstrap.config.PropertySourceLocator;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.CompositePropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.FileSystemResource;

/**
 * Custom development resource loader for the <%= baseName %>.
 *
 * The order annotation is important, otherwise the Spring config cloud PropertySource (ConfigServicePropertySourceLocator)
 * will win from this one because of the @Order(0).
 *
 * @See org.springframework.cloud.bootstrap.config.PropertySourceBootstrapConfiguration#initialize
 * @see org.springframework.cloud.config.client.ConfigServicePropertySourceLocator
 *
 * @author R. Sonke (r.sonke@maxxton.com)
 * @copyright Maxxton Group <%= currentYear %>
 */
@Configuration
@Order(-1)
@Profile(ApplicationProfile.DEVELOPMENT)
public class DevelopmentPropertySourceLocator implements PropertySourceLocator
{
  private final static Logger log = LoggerFactory.getLogger(DevelopmentPropertySourceLocator.class);

  @Override
  public PropertySource<?> locate(Environment environment)
  {
    CompositePropertySource source = new CompositePropertySource("mxtDevelopment");
    YamlPropertySourceLoader loader = new YamlPropertySourceLoader();

    try
    {
      FileSystemResource resource = new FileSystemResource("../mxt-config-server/dev-conf/<%= baseName %>.yml");
      if(resource.exists())
      {
        PropertySource<?> applicationYamlPropertySource = loader.load("<%= baseName %>", resource, null);

        if (applicationYamlPropertySource != null)
          source.addFirstPropertySource(applicationYamlPropertySource);
      }
    }
    catch (IOException e)
    {
      log.error("Loading of development configuration failed.", e);
    }
    return source;
  }
}
