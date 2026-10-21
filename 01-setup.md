# MyRazorApp Setup & Quick Start

This quick start guide sets up a web application using the ASP.NET Core **Razor Pages** template. The aim of this guide is to:

- Create and configure a basic Razor Pages application (`MyRazorApp`).
- Initialise a local Git repository with a `.gitignore` file and publish to GitHub.
- Review the structure of a Razor Pages application (`Pages/`, `wwwroot/`, `Program.cs`).
- Customise the Layout template and UI structure.
- Add static files to the `wwwroot` folder.
- Add dynamic Razor Pages with C# code-behind `PageModel` classes.
- Pass data between `PageModel` handlers and Razor view templates.
- Load external JSON data into strongly-typed models to complete the staff directory.

---

## Project Creation and First Run

### Step 1. Create the Application

To create a starter Razor Pages project in Visual Studio Code, open your terminal and run:

```bash
dotnet new razor -n MyRazorApp
```

### Step 2. Move into the Project Folder

If using VS Code, reopen the folder in the terminal so the path is set to `MyRazorApp`.

Alternatively, move into the project folder using the terminal:

```bash
cd MyRazorApp
```

### Step 3. Initialise a Git Repository and Add a `.gitignore`

Tracking your application in version control using Git and GitHub from the outset is recommended practice.

> [!IMPORTANT]
> **Why is a `.gitignore` file essential in .NET?**  
> When you build or run a .NET application, compilers generate temporary build artifacts and binaries (such as the `bin/` and `obj/` directories). These files should never be committed to version control. A `.gitignore` file specifies intentionally untracked files that Git should ignore, keeping your repository clean and lightweight.

1. **Initialise a local Git repository:**  
   Ensure your terminal is located inside the `MyRazorApp` directory, then run:
   ```bash
   git init
   git branch -M main
   ```

2. **Configure your Git identity (if not already configured):**  
   Git attaches an author name and email address to every commit. Check if your identity is already configured on your machine:
   ```bash
   git config user.name
   git config user.email
   ```
   If either command produces no output, set them using your name and the email associated with your GitHub account:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

3. **Add a `.gitignore` file:**  
   A sample `.gitignore` file configured for .NET applications has been provided in the `resources/` folder. Copy it into the root of your `MyRazorApp` project.

   *(Alternatively, you can generate a standard .NET gitignore file directly using the .NET CLI: `dotnet new gitignore`)*

   ```bash
   dotnet new gitignore
   ```

4. **Stage and commit your project files:**  
   Check the status of your files using `git status` (verify that `bin/` and `obj/` folders are ignored), then stage and commit:
   ```bash
   git add .
   git commit -m "Initial commit: starter Razor Pages application"
   ```

### Step 4. Create and Push to a GitHub Repository

To store your code remotely on GitHub:

1. Log into your account on [GitHub](https://github.com) and create a **New repository** named `MyRazorApp`.
   > [!NOTE]
   > Do **not** select "Add a README file", "Add .gitignore", or choose a license template, as you have already initialised your repository locally.

2. Link your local repository to GitHub and push your `main` branch:
   ```bash
   git remote add origin https://github.com/<your-username>/MyRazorApp.git
   git push -u origin main
   ```
   *(Replace `<your-username>` with your GitHub username).*

---

### Step 5. Build and Run

```bash
dotnet build
dotnet run
```

At this point, the app runs the default ASP.NET Core Razor Pages template.

> [!NOTE]
> The app runs on `localhost` for development.
> To enable automatic UI and code reloading without restarting the web server, run:
> ```bash
> dotnet watch run
> ```

---

## What Has Just Happened?

The default application consists of standard pages such as the Home (`Index`) page and Privacy page. Let's look at how these pages work in Razor Pages.

### Razor Pages & PageModels

Navigate to the `Pages` directory in the application. Notice files like `Index.cshtml` and `Privacy.cshtml`. 

Each Razor Page consists of two paired files:
1. **`.cshtml` file**: The presentation view template combining HTML and Razor syntax.
2. **`.cshtml.cs` file**: The C# code-behind `PageModel` class handling HTTP requests (`OnGet()`, `OnPost()`) and holding page properties.

Example `@` Razor syntax transition:

```cshtml
@{
    ViewData["Title"] = "Home Page";
}
```

Razor transitions seamlessly between HTML markup and C# code using the `@` character.

### Shared Layout Files

The markup in `Index.cshtml` and `Privacy.cshtml` is concise because both pages inherit a shared layout template located at `Pages/Shared/_Layout.cshtml`. This provides standard document structure (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, navigation header, and footer).

### Static Files (`wwwroot`)

Static client-side assets such as CSS stylesheets, JavaScript files, and images are stored in the `wwwroot` directory and served directly by the web server.

### Startup Pipeline (`Program.cs`)

In Razor Pages, request handling and page routing are configured in `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages();

app.Run();
```

URLs map directly to file paths inside the `Pages` directory (e.g. `/Privacy` maps to `Pages/Privacy.cshtml`).

We will explore these concepts further as we build dynamic pages and bind data models.

---

| [⬅️ Previous: Lab Overview](readme.md) | [Next: 02 - Pages & Routing ➡️](02-pages-and-routing.md) |
|:--- | ---:|