
using dz11.Repositories;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore;
using dz11.services;
using dz11.Models;

var builder = WebApplication.CreateBuilder(args);

// ��������� DbContext � �������
builder.Services.AddDbContext<ConnectToDB>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ������������ ����������� ��� ������ � ��
builder.Services.AddScoped<ICommentRepository, CommentDBRepository>();
builder.Services.AddScoped<CommentService>();

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

// ��������� CORS
app.UseCors("AllowReactApp");

app.MapGet("/comments", (CommentService TS) => TS.GetTableAll());
app.MapGet("/comments/{id}", (int id, CommentService table) => table.GetTable(id));
app.MapPost("/comments", (Comment table, CommentService TS) => TS.AddTable(table));
app.MapDelete("/comments/{id}", (int id, CommentService TS) => TS.delete(id));
app.MapPatch("/comments/{id}", (int id, Comment updatedTable, CommentService TS) =>
{
    TS.update(id, updatedTable);
    return Results.NoContent();
});

app.Run();