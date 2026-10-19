# 06 - Loading JSON Data into Views (Final Step)

In this final part of the tutorial, we bring together all the core concepts we have covered across the lab—project structure, routing, shared layouts, Razor syntax, and `PageModel` properties—to build a dynamic, data-driven **Staff Directory** page.

In the previous step ([05 - Passing Data to Views](05-data-to-views.md)), we learned how data flows from a `PageModel` to a Razor view using in-memory properties. To complete our application, we will now load and deserialize the external staff dataset provided in `resources/data/staff.json` and display it in the `/Staff` view.

---

## What We Will Complete

To complete the application, we will:

1. Copy the provided `staff.json` dataset into our application's `data/` folder.
2. Create a strongly-typed C# model (`StaffMember`) matching the JSON structure.
3. Update `Pages/Staff/Index.cshtml.cs` (first created in [02 - Pages & Routing](02-pages-and-routing.md)) to inject `IWebHostEnvironment` and asynchronously deserialize the JSON file into a `List<StaffMember>`.
4. Update `Pages/Staff/Index.cshtml` to render a responsive table and dynamic status badges using the styles from `site.css`.
5. Run, test, and verify the completed Razor Pages application.

---

## Step 1: Copy the Staff Data to Your Project

Just as we copied `.gitignore` and `site.css` from the `resources/` folder in earlier steps, we will now copy the dummy staff dataset into `MyRazorApp`.

From your terminal inside the `MyRazorApp` project root:

1. Create a `data` folder:
   ```bash
   mkdir -p data
   ```

2. Copy the sample `staff.json` file from `resources/data`:
   ```bash
   cp ../resources/data/staff.json data/
   ```

3. Confirm the file exists at `data/staff.json`. It contains a collection of 15 staff members with fields including `id`, `name`, `email`, `role`, `department`, `status`, `phone`, `office`, and `bio`.

---

## Step 2: Create the `StaffMember` Model

To work with this data in a type-safe manner, we define a C# model that maps to the JSON structure.

1. Create a `Models` folder in `MyRazorApp` (if you have not already):
   ```bash
   mkdir -p Models
   ```

2. Create `Models/StaffMember.cs` with the following code:

```csharp
namespace MyRazorApp.Models;

public class StaffMember
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Office { get; set; } = string.Empty;
    public string JoinedDate { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
}
```

> [!TIP]
> Initializing string properties with `= string.Empty;` prevents nullable reference warnings in modern C# and ensures your model properties are never unexpectedly `null`.

---

## Step 3: Load and Deserialize JSON in `Pages/Staff/Index.cshtml.cs`

In [02 - Pages & Routing](02-pages-and-routing.md), we created a minimal `Pages/Staff/Index.cshtml.cs` file with an empty `OnGet()` handler. We will now update this code-behind file to load our staff data.

### Resolving File Paths with `IWebHostEnvironment`

Hard-coding file paths (such as `C:\...` or `/Users/...`) causes web applications to fail when moved between machines or deployed to the cloud. ASP.NET Core provides the `IWebHostEnvironment` service via **Dependency Injection**. By asking for `IWebHostEnvironment` in the class constructor, we can access `ContentRootPath`—the absolute path to the root of our running web application on any platform.

### Updating `Pages/Staff/Index.cshtml.cs`

Replace the contents of `Pages/Staff/Index.cshtml.cs` with:

```csharp
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MyRazorApp.Models;

namespace MyRazorApp.Pages.Staff;

public class IndexModel : PageModel
{
    private readonly IWebHostEnvironment _environment;

    // Inject IWebHostEnvironment to safely resolve server file paths
    public IndexModel(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    // Strongly-typed list exposed to the Razor View via @Model.StaffList
    public List<StaffMember> StaffList { get; set; } = [];

    public async Task OnGetAsync()
    {
        // Resolve absolute path to data/staff.json
        var filePath = Path.Combine(_environment.ContentRootPath, "data", "staff.json");

        if (System.IO.File.Exists(filePath))
        {
            var jsonString = await System.IO.File.ReadAllTextAsync(filePath);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            StaffList = JsonSerializer.Deserialize<List<StaffMember>>(jsonString, options) ?? [];
        }
    }
}
```

### Key Techniques Used:

- **Asynchronous File I/O (`OnGetAsync` & `ReadAllTextAsync`)**: Asynchronous methods free the web server's request threads while reading from disk, keeping the server responsive under traffic.
- **`PropertyNameCaseInsensitive = true`**: Enables `System.Text.Json` to map lowercase/camelCase JSON keys (e.g., `"department"`) directly to PascalCase C# properties (`Department`).
- **Collection Fallback (`?? []`)**: Guarantees that `StaffList` is never `null`, even if the file is empty or missing.

---

## Step 4: Render the Staff Directory in `Pages/Staff/Index.cshtml`

In [02 - Pages & Routing](02-pages-and-routing.md), `Pages/Staff/Index.cshtml` contained only a placeholder heading. Now we will update it to render the staff data using the CSS table and badge styles we linked in [03 - Layout Templates & Styling](03-layout-templates.md).

Replace the contents of `Pages/Staff/Index.cshtml` with:

```cshtml
@page
@model MyRazorApp.Pages.Staff.IndexModel
@{
    ViewData["Title"] = "Staff Directory";
}

<h1>Staff Directory</h1>
<p>Browse our faculty and administration staff members.</p>

@if (Model.StaffList.Count == 0)
{
    <p>No staff records found.</p>
}
else
{
    <p>Showing <strong>@Model.StaffList.Count</strong> staff @(Model.StaffList.Count == 1 ? "member" : "members").</p>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Email</th>
                <th>Office</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var staff in Model.StaffList)
            {
                <tr>
                    <td><strong>@staff.Name</strong></td>
                    <td>@staff.Department</td>
                    <td>@staff.Role</td>
                    <td>
                        <a href="mailto:@staff.Email">@staff.Email</a>
                    </td>
                    <td>@staff.Office</td>
                    <td>
                        <span class="status-@(staff.Status.ToLower())">
                            @staff.Status
                        </span>
                    </td>
                </tr>
            }
        </tbody>
    </table>
}
```

### How the View Works:

1. **Conditional Checks**: `@if (Model.StaffList.Count == 0)` displays a simple fallback message if the dataset is empty.
2. **`@foreach` Iteration**: Loops over each `StaffMember` in `@Model.StaffList` to render a table row (`<tr>`).
3. **Dynamic CSS Status Badges**: The Razor expression `status-@(staff.Status.ToLower())` generates `.status-active` or `.status-inactive`, which activates the green and red badge styles defined in `site.css`.
4. **Responsive Table Markup**: The table automatically gains horizontal scrolling on small screens and full tabular formatting on desktops through the media queries in `site.css`.

---

## Step 5: Run and Test the Completed Application

From your terminal in `MyRazorApp`, start the development server:

```bash
dotnet watch run
```

1. Navigate to `http://localhost:<port>/Staff` (or click **Staff** in the header navigation).
2. **Verify Data Loading**: All 15 staff members should appear in the table with styled Active/Inactive status badges.
3. **Verify Mobile Responsiveness**: Resize your browser window to test the responsive mobile table layout.

---

## Tutorial Complete: What You Have Built

Congratulations! You have completed the entire ASP.NET Core Razor Pages tutorial series. 

Here is a recap of the key skills and patterns you have mastered across this lab:

| Lab Part | Key Concepts Mastered |
|---|---|
| **[01 - Setup & Quick Start](01-setup.md)** | Initializing a Razor Pages project with `dotnet new razor`, setting up Git version control, and configuring `.gitignore`. |
| **[02 - Pages & Routing](02-pages-and-routing.md)** | Convention-based file routing, paired `.cshtml` / `.cshtml.cs` files, and handler methods (`OnGet`). |
| **[03 - Layout Templates & Styling](03-layout-templates.md)** | Master layout pages (`_Layout.cshtml`), `RenderBody()`, `asp-page` Tag Helpers, and global CSS stylesheets. |
| **[04 - Razor Expressions](04-razor-expressions.md)** | Transitioning between HTML and C# using `@`, rendering dynamic timestamps and server calculations. |
| **[05 - Passing Data to Views](05-data-to-views.md)** | Strongly-typed `PageModel` properties, `ViewData` for metadata, and `TempData` for flash messages. |
| **06 - Loading JSON Data (This Step)** | Dependency injection with `IWebHostEnvironment`, asynchronous file I/O with `System.Text.Json`, strongly-typed model deserialization, and dynamic table rendering. |

You now have a solid foundation in building structured, styled, and data-driven server-rendered web applications with ASP.NET Core Razor Pages.

---

| [⬅️ Previous: 05 - Passing Data to Views](05-data-to-views.md) | [🏠 Lab Overview](readme.md) | ✅ **Lab Complete** |
|:--- |:---:| ---:|
