package <%= packageName %>.examples;

import rx.Observable;
import rx.functions.Func2;

/**
 * Maxxton RxJava example 
 *
 * @author <%= author %>
 * @copyright Maxxton Group <%= currentYear %>
 */
public class RxJavaExample
{
	/**
	 * Example main method
	 */
	public static void main(String args[])
	{
		RxJavaExample example = new RxJavaExample();
		System.out.println(example.getExampleString());
	}

	/**
	 * Example use of the RxJava library.
	 * Make two asynchronous calls to other observables in order to fetch the strings "Hello" and "World"
	 * Once received they get combined into one String.
	 * Since the call is still asynchrounous you need to make is synchronous and fetch the return.
	 */
	public String getExampleString()
	{
		Observable<String> helloObs = fetchHello();
		Observable<String> worldObs = fetchWorld();

		Observable<String> response = Observable.zip(helloObs, worldObs, new Func2<String, String, String>()
		{
			@Override
      		public String call(String hello, String world)
      		{
      			return hello + " " + world;
      		}
		});

		return response.toBlocking().first();
	}

	/**
	 * Example Asynchronous observable
	 * Fetches the String "Hello"
	 * Returns it and notifies the higher observable.
	 */
	private Observable<String> fetchHello()
	{
		return Observable.<String> create(s -> {

			String response = "Hello";
			s.onNext(response);
			s.onCompleted();
		}).subscribeOn(Schedulers.computation());
	}

	/**
	 * Example Asynchronous observable
	 * Fetches the String "World"
	 * Returns it and notifies the higher observable.
	 */
	private Observable<String> fetchWorld()
	{
		return Observable.<String> create(s -> {

			String response = "World";
			s.onNext(response);
			s.onCompleted();
		}).subscribeOn(Schedulers.computation());
	}

}