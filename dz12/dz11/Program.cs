
using dz11.Repositories;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore;
using dz11.services;
using dz11.Models;
using dz11.Loggers;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Добавляем DbContext в сервисы
builder.Services.AddDbContext<ConnectToDB>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Регистрируем репозиторий для работы с БД
builder.Services.AddScoped<ICommentRepository, CommentDBRepository>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<IDblLogger, DbLogget>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Включение CORS
app.UseCors("AllowReactApp");

// Добавляем middleware для логирования запросов
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<IDblLogger>();
    try
    {
        await next();
        await logger.LogInformation(
            context.Request.Method,
            context.Request.Path,
            $"Request completed with status code: {context.Response.StatusCode}");
    }
    catch (Exception ex)
    {
        await logger.LogError(
            context.Request.Method,
            context.Request.Path,
            $"Request failed: {ex.Message}",
            ex.StackTrace);
        throw;
    }
});

app.MapGet("/logs", (IDblLogger logger) => logger.GetAllLog());
app.MapGet("/comments", async (CommentService TS, IDblLogger logger) =>
{
    await logger.LogInformation("GET", "/comments", "Retrieving all comments");
    return TS.GetTableAll();
});

app.MapGet("/comments/{id}", async (int id, CommentService table, IDblLogger logger) =>
{
    await logger.LogInformation("GET", $"/comments/{id}", $"Retrieving comment with ID: {id}");
    return table.GetTable(id);
});

app.MapPost("/comments", async (Comment table, CommentService TS, IDblLogger logger) =>
{
    await logger.LogInformation("POST", "/comments", "Creating new comment",
        $"PostId: {table.PostId}, Name: {table.Name}, Email: {table.Email}");
    TS.AddTable(table);
    return Results.Created($"/comments/{table.Id}", table);
});

app.MapDelete("/comments/{id}", async (int id, CommentService TS, IDblLogger logger) =>
{
    await logger.LogInformation("DELETE", $"/comments/{id}", $"Deleting comment with ID: {id}");
    TS.delete(id);
    return Results.NoContent();
});

app.MapPatch("/comments/{id}", async (int id, Comment updatedTable, CommentService TS, IDblLogger logger) =>
{
    await logger.LogInformation("PATCH", $"/comments/{id}", $"Updating comment with ID: {id}",
        $"New values - PostId: {updatedTable.PostId}, Name: {updatedTable.Name}, Email: {updatedTable.Email}, Body: {updatedTable.Body}");

    TS.update(id, updatedTable);
    return Results.NoContent();
});

app.Run();