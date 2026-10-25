# 07 - Adding JavaScript & Client-Side Interactivity (Burger Menu)

In previous steps of this lab, we focused on server-side rendering: generating HTML dynamically with Razor expressions, setting up shared layout templates, and loading data models into views.

However, modern web applications also require client-side interactivity that responds instantly to user actions without triggering a full page reload or round-trip to the web server. Common examples include interactive modal dialogs, tab switchers, client-side validation, and responsive mobile navigation (burger menus).

---

## Understanding Client-Side JavaScript in Razor Pages

In ASP.NET Core, the web server executes C# code in `PageModel` classes and `.cshtml` views to generate an HTML document, which is then sent to the browser. Once the browser receives the HTML, client-side JavaScript takes over to manipulate the Document Object Model (DOM) and provide interactive behavior.

Client-side JavaScript files are static assets and must be stored in the `wwwroot` directory:

```text
wwwroot/
├── css/
│   └── site.css        # Global and responsive styles
└── js/
    └── site.js         # Client-side JavaScript logic
```

> [!NOTE]
> Static files located in `wwwroot/` are served directly by ASP.NET Core using the `app.MapStaticAssets()` or `app.UseStaticFiles()` middleware registered in `Program.cs`.

---

## Step 1: Update the Master Layout (`Pages/Shared/_Layout.cshtml`)

To support a mobile navigation drawer, we need to update `Pages/Shared/_Layout.cshtml` with:
1. A script reference in the document `<head>` using the `defer` attribute and ASP.NET Core's cache-busting Tag Helper `asp-append-version="true"`.
2. A `.site-header` container that groups the site brand, a burger toggle button, and the primary navigation links.
3. Accessible ARIA attributes (`aria-label`, `aria-controls`, and `aria-expanded`) so screen readers and assistive technologies can interpret the navigation state.

### Why Load Scripts in the `<head>` with `defer`?

Historically, web developers placed `<script>` tags at the very bottom of the `<body>` element to prevent script execution from blocking HTML parsing. 

Modern web standards provide the `defer` attribute, which is recommended practice:
- **Parallel Downloading**: The browser downloads the `.js` file in the background concurrently while continuing to parse the HTML document.
- **Guaranteed DOM Availability**: Deferred scripts execute in order *after* HTML parsing has finished, immediately before the `DOMContentLoaded` event fires.
- **Clean Separation**: Placing all external resource links (`<link rel="stylesheet">` and `<script defer>`) together inside `<head>` keeps the document head organized.

### Revised `Pages/Shared/_Layout.cshtml`

Replace the entire contents of `Pages/Shared/_Layout.cshtml` with the following code:

```cshtml
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - MyRazorApp</title>
    <link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
    <script src="~/js/site.js" asp-append-version="true" defer></script>
</head>
<body>
    <header class="site-header">
        <div class="header-container">
            <a asp-page="/Index" class="brand">MyRazorApp</a>
            <button id="burgerToggle" class="burger-btn" type="button" aria-label="Toggle navigation menu" aria-controls="primaryNav" aria-expanded="false">
                <span class="burger-line"></span>
                <span class="burger-line"></span>
                <span class="burger-line"></span>
            </button>
            <nav id="primaryNav" class="nav-menu" aria-label="Main navigation">
                <ul>
                    <li><a asp-page="/Index">Home</a></li>
                    <li><a asp-page="/News">News</a></li>
                    <li><a asp-page="/Staff/Index">Staff</a></li>
                    <li><a asp-page="/Privacy">Privacy</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        @RenderBody()
    </main>

    <footer>
        <p>&copy; @DateTime.Now.Year MyRazorApp - @DateTime.Now.ToString("dd MMM yyyy")</p>
    </footer>
</body>
</html>
```

### Key Elements of the Revised Structure:

- **`<script src="~/js/site.js" asp-append-version="true" defer></script>`**: Loads our client-side script from `wwwroot/js/site.js`. The `asp-append-version="true"` attribute appends a SHA256 cache-busting query parameter (e.g., `?v=vfbwnp9r4j`) whenever the file changes.
- **`<button id="burgerToggle" class="burger-btn">`**: An accessible button containing three `<span>` bars that animate into an 'X' icon when active.
- **`aria-controls="primaryNav"` and `aria-expanded="false"`**: Informs assistive technologies which navigation element the button toggles and whether it is currently open or collapsed.
- **`<nav id="primaryNav" class="nav-menu" aria-label="Main navigation">`**: Groups the navigation links under a labeled landmark.

---

## Step 2: Add the Client-Side Script (`wwwroot/js/site.js`)

Copy the `site.js` javascript file from the resources folder into your project, in the `wwwroot/js/` folder.

This file provides the logic for the mobile burger menu.  It achieves the interaction by manipulating the DOM, and adding/removing CSS classes to the menu and button elements.

The CSS for the mobile burger menu is already defined in `site.css`, in the `wwwroot/css/` folder.

When in mobile view (screen width less than 768px), the burger button is visible and the navigation menu is hidden.  

When the viewport is 768px or wider (desktop/tablet), the following styles are applied:
- The burger button (`.burger-btn`) is hidden.
- The navigation menu (`.nav-menu`) is forced to display as a block element, overriding any mobile-specific display rules.
- The navigation list (`.nav-menu ul`) is converted from a vertical stack to a horizontal row.

When the viewport is narrower than 768px (mobile), the base styles apply, showing the burger button and hiding the navigation menu by default.

The Javascript toggles the `is-open` class on the navigation menu, and the `is-active` class on the burger button, when the burger button is clicked.  When these CSS classes are added to the elements, the CSS styles defined in `site.css` are applied to the elements.

---

## Tutorial Complete: What You Have Built

Congratulations! You have completed the entire ASP.NET Core Razor Pages tutorial series.

Here is a final recap of the key skills and patterns mastered across this lab:

| Lab Part | Key Concepts Mastered |
|---|---|
| **[01 - Setup & Quick Start](01-setup.md)** | Initialising a Razor Pages project with `dotnet new razor`, setting up Git version control, and configuring `.gitignore`. |
| **[02 - Pages & Routing](02-pages-and-routing.md)** | Convention-based file routing, paired `.cshtml` / `.cshtml.cs` files, and handler methods (`OnGet`). |
| **[03 - Layout Templates & Styling](03-layout-templates.md)** | Master layout pages (`_Layout.cshtml`), `RenderBody()`, `asp-page` Tag Helpers, and global CSS stylesheets. |
| **[04 - Razor Expressions](04-razor-expressions.md)** | Transitioning between HTML and C# using `@`, rendering dynamic timestamps and server calculations. |
| **[05 - Passing Data to Views](05-data-to-views.md)** | Strongly-typed `PageModel` properties, `ViewData` for metadata, and dynamic dropdown controls. |
| **[06 - Loading JSON Data](06-json-to-view.md)** | Dependency injection with `IWebHostEnvironment`, asynchronous file I/O with `System.Text.Json`, strongly-typed model deserialisation, and dynamic table rendering. |
| **07 - Adding JavaScript (This Step)** | Client-side DOM interactivity in Razor Pages, deferred script execution in `<head>`, accessible ARIA mobile navigation, and mobile-first CSS transitions. |

You now have a production-ready foundation in building structured, styled, dynamic, and interactive server-rendered web applications with ASP.NET Core Razor Pages.

---

| [⬅️ Previous: 06 - Loading JSON Data into Views](06-json-to-view.md) | [🏠 Lab Overview](readme.md) | ✅ **Lab Complete** |
|:--- |:---:| ---:|
