using SignalrSketchpad.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}
app.UseStaticFiles();


app.MapHub<DrawDotHub>("/drawDotHub");

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
