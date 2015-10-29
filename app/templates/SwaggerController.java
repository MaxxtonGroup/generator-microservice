package <%= packageName %>.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Simple web controller that redirects you to the swagger page.
 *
 * @author R. Sonke (r.sonke@maxxton.com)
 * Maxxton Group 2015
 */
@Controller
public class SwaggerController
{
  @RequestMapping("/mxt-docs")
  public String home() {
    return "redirect:swagger-ui.html";
  }
}
