package <%= packageName %>.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.core.env.Environment;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.codahale.metrics.MetricRegistry;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/**
 * Database configuration class
 *
 * @author <%= author %>
 * @copyright Maxxton Group <%= currentYear %>
 */
@Configuration
@EnableJpaRepositories("<%= packageName %>.repository")
@EnableTransactionManagement
public class DatabaseConfiguration implements EnvironmentAware
{
  private Environment environment;

  private RelaxedPropertyResolver propertyResolver;

  @Autowired(required = false)
  private MetricRegistry metricRegistry;

  @Override
  public void setEnvironment(Environment environment)
  {
    this.environment = environment;
    this.propertyResolver = new RelaxedPropertyResolver(environment, "spring.datasource.");
  }

  @Bean(name = "dataSource",destroyMethod = "close")
  public DataSource dataSource()
  {
    HikariConfig hikariConfig = new HikariConfig();
    hikariConfig.setDriverClassName(propertyResolver.getProperty("driverClassName"));
    hikariConfig.setJdbcUrl(propertyResolver.getProperty("url"));
    hikariConfig.setUsername(propertyResolver.getProperty("username"));
    hikariConfig.setPassword(propertyResolver.getProperty("password"));

    hikariConfig.setMaximumPoolSize(5);
    hikariConfig.setPoolName("<%= applicationName %>SpringHikariCP");

    hikariConfig.addDataSourceProperty("dataSource.cachePrepStmts", "true");
    hikariConfig.addDataSourceProperty("dataSource.prepStmtCacheSize", "250");
    hikariConfig.addDataSourceProperty("dataSource.prepStmtCacheSqlLimit", "2048");
    hikariConfig.addDataSourceProperty("dataSource.useServerPrepStmts", "true");
    hikariConfig.setMetricRegistry(metricRegistry);

    DataSource dataSource = new HikariDataSource(hikariConfig);

    return dataSource;
  }
}
