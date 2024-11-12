using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureServices(services =>
                {
                    services.AddSingleton<ClientManager>(); // Register ClientManager as a singleton
                    services.AddScoped<ClientMonitorService>(); // Register the background service if needed
                    services.AddControllers(); // Add controller support for API endpoints
                });

                webBuilder.Configure(app =>
                {
                    app.UseRouting();
                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllers(); // Map controllers to handle HTTP requests
                    });
                });

                webBuilder.UseUrls("http://localhost:5000"); // You can specify a port
            });
}
