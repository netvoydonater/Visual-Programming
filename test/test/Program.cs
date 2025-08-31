using test.Repository;
using test.servecies;
using test.Models;
using System.Xml.Linq;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ITableCommand, TableRepository>(); 
builder.Services.AddSingleton<TableServecies>();

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




app.MapGet("/comments", (TableServecies TS) => TS.GetTableAll());

app.MapGet("/comments/{id}", (int id, TableServecies table) => table.GetTable(id));

app.MapPost("/comments", (Table table, TableServecies TS) => TS.AddTable(table));

app.MapDelete("/comments/{id}", (int id, TableServecies TS) =>
{
    TS.delete(id);
});

app.MapPatch("/comments/{id}", (int id, Table updatedTable, TableServecies TS) =>
{
    TS.update(id, updatedTable);
    return Results.NoContent(); // Возвращаем статус 204 No Content
});

app.Run();