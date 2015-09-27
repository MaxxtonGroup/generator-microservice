package <%= packageName %>.config;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.async.DeferredResult;

import com.fasterxml.classmate.TypeResolver;
import com.google.common.base.Predicate;

import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.WildcardType;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static com.google.common.base.Predicates.or;
import static springfox.documentation.builders.PathSelectors.regex;
import static springfox.documentation.schema.AlternateTypeRules.newRule;

/**
 * Swagger rest api documentation configuration.
 *
 * @author R. Sonke (r.sonke@maxxton.com)
 * @copyright Maxxton Group 2015
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig
{
  @Autowired
  private TypeResolver typeResolver;

  @Bean
  public Docket employeeApi() {
    return new Docket(DocumentationType.SWAGGER_2)
      .select().apis(RequestHandlerSelectors.any())
      .paths(paths()).build()
      .apiInfo(apiInfo())
      .pathMapping("/")
      .directModelSubstitute(LocalDate.class, String.class)
      .genericModelSubstitutes(ResponseEntity.class)
      .useDefaultResponseMessages(false) // disable auto generating of responses for REST-endpoints
      .alternateTypeRules(newRule(typeResolver.resolve(DeferredResult.class, typeResolver.resolve(ResponseEntity.class, WildcardType.class)), typeResolver.resolve(WildcardType.class)));
  }

  /**
   * Define the paths to include.
   *
   * @return
   */
  @SuppressWarnings("unchecked")
  private Predicate<String> paths() {
    return or(
      regex("/env.*"),
      regex("/api.*"),
      regex("/error.*"),
      regex("/health.*"),
      regex("/metrics.*")
    );
  }

  private ApiInfo apiInfo() {
    ApiInfo apiInfo = new ApiInfo("Maxxton low level <%= applicationName %> API", "<%= applicationName %> API", "1.0", null, "<%= author %>", null, null);
    return apiInfo;
  }
}
