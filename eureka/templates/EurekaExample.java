package <%= packageName %>.examples;

/**
 * HOW TO CONFIGURE YOUR APPLICATION TO WORK WITH THE EUREKA SERVER
 * ################################################################
 * 
 * Make sure you have at least the following configuration in your application.yml
 * -------------------------------------------------------------------------------
 *  Application.yml
 * -------------------------------------------------------------------------------
 *   # Define the Spring boot port as random.
 *   server:
 *     port: 0
 *
 *   # Define the name of this service to be 'EurekaExample'
 *   # This will be used as an identifier when requesting the location of a service 
 *   spring:
 *     application:
 *       name: EurekaExample
 *
 *   # Define the location of the Eureka server as IP address or hostname
 *   eureka:
 *     client:
 *       serviceUrl:
 *         defaultZone: http://127.0.0.1:8761/eureka
 *   # Optionally you can tell the Eureka server to alway use the Ip address instead of the hostname (If this is not set).
 *     instance:
 *       preferIpAddress: true
 *
 * -------------------------------------------------------------------------------
 *
 * That's all :D
 */

/**
 * Maxxton Eureka client example 
 *
 * @author <%= author %>
 * @copyright Maxxton Group <%= currentYear %>
 */
/**
 * ! For the sake of this example annotations are commented 
 *   to avoid conflicts with your project !
 * @SpringBootApplication
 * @EnableEurekaClient
 * 
 */
public class EurekaExample
{
	/**
	 * Example main method
	 */
	public static void main(String args[])
	{
		SpringApplication.run(EurekaExample.class, args);
	}

	public EurekaExample()
	{
		Sytem.out.println(this.getLocation());
	}

	/**
   * ! Commented in case !
   * @Autowired
   */
	private DiscoveryClient client;

	/**
	 * Fetches the information of the service with id "EurekaExample".
	 * Then returnes the homepage url as a String.
	 */
	private String getLocation()
	{
		InstanceInfo info = discoveryClient.getNextServerFromEureka("EurekaExample", false);
    return info.getHomePageUrl();
	}
}