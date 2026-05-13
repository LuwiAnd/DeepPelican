using DeepPelican.SignalRServer.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
	options.AddPolicy("AngularClient", policy =>
	{
		policy
			.WithOrigins("http://localhost:4200")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials();
	});
});

var app = builder.Build();

app.UseCors("AngularClient");

app.MapGet("/", () => "DeepPelican SignalR server is running.");
app.MapHub<ChessHub>("/hubs/chess");

app.Run();
