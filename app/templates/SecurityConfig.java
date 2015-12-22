package <%= packageName %>.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SecurityConfig extends ResourceServerConfigurerAdapter {

  @Override
  public void configure(HttpSecurity http) throws Exception {
  	/*
     * In order to allow certain routes to pass through add antmatchers
     * http.authorizeRequests().antMatchers("/myroute", "/otherroute").permitAll().anyRequest().authenticated();
     *
     * In case you want to temporary disable the config for testing replace the config by this
     * http.authorizeRequests().anyRequest().permitAll();
     *
     * Be sure to change it back once you finished testing
     */
    http.authorizeRequests().anyRequest().authenticated();
  }
}
