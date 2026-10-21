# Layout Templates, Tag Helpers, and Styling in Razor Pages

## The Default Shared Layout (`_Layout.cshtml`)

Web applications require consistent branding, navigation, and page layouts. In ASP.NET Core Razor Pages, shared document structure is managed using layout pages.

By default, `Pages/Shared/_Layout.cshtml` defines the master HTML layout. Individual page templates inject their content into the layout via the `@RenderBody()` directive.

---

## The Default ViewStart and ViewImports

To prevent every page from needing to declare `Layout = "_Layout"`, ASP.NET Core uses `Pages/_ViewStart.cshtml`:

```cshtml
@{
    Layout = "_Layout";
}
```

Global namespaces and Razor Tag Helpers are imported in `Pages/_ViewImports.cshtml`:

```cshtml
@namespace MyRazorApp.Pages
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
```

> [!NOTE]
> **What is a Namespace?**  
> In C# and .NET, a **namespace** organises related code into logical containers—similar to how folders organise files on your computer. They also prevent naming collisions if different libraries use the same class names.  
> 
> In Razor Pages:
> - The `@namespace MyRazorApp.Pages` directive in `_ViewImports.cshtml` sets the root namespace for all Razor views in the `Pages/` directory.
> - Views in nested folders automatically follow this hierarchy (for example, views in `Pages/Staff/` belong to `MyRazorApp.Pages.Staff`).
> - This global declaration allows your Razor views to automatically connect with their corresponding code-behind `PageModel` classes without requiring repetitive `@using` statements on every page.

---

## Simplified Layout Structure

Replace the existing code in `Pages/Shared/_Layout.cshtml` with the following:

```cshtml
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - MyRazorApp</title>
    <link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="/Index">Home</a></li>
                <li><a href="/News">News</a></li>
                <li><a href="/Staff/Index">Staff</a></li>
                <li><a href="/Privacy">Privacy</a></li>
            </ul>
        </nav>
    </header>

    <main>
        @RenderBody()
    </main>

    <footer>
        <p>&copy; Today's date</p>
    </footer>
</body>
</html>
```

Remember the individual pages are providing the content that is rendered in the `RenderBody()` directive. For example, the `Index.cshtml` file provides the content for the `RenderBody()` directive in the `_Layout.cshtml` file.

---

## Using `asp-page` Tag Helpers for Navigation

In the above example, we used `href` attributes to navigate between pages. The `href` attribute is a standard HTML attribute that is used to specify the URL of a link. The `asp-page` attribute is a Razor Tag Helper that is used to generate URL-encoded href attributes for navigation within a Razor Pages application. In essence, it provides a more robust and maintainable way to handle navigation in a Razor Pages application.  As such amend the above layout file to use `asp-page` instead of `href` attributes, for example:

```cshtml
<a asp-page="/Index">Home</a>
<a asp-page="/Staff/Index">Staff Directory</a>
```

### Key Benefits of `asp-page` Tag Helpers:

- **Refactoring-Friendly**: If page structures or route parameters change, ASP.NET Core dynamically calculates correct URLs.
- **IntelliSense & Safety**: Modern IDEs provide auto-completion for page names and highlight broken references at design time.

---

## Managing Static Files and CSS

We have refered to dynamic pages and Razor code above. However, we also need to consider how to include other resources, such as images and stylesheets. These are often referred to as static files. Static files are files that are served directly to the client without any processing. These include HTML, CSS, JavaScript, and image files.

> [!NOTE]
> The use of static files is controlled by the `MapStaticFiles()` method in `Program.cs`.
> By default, the `wwwroot` folder is the only directory where static files are served. If you want to serve static files from a different directory, you can use the `MapStaticFiles()` method to specify a different directory.

Remove any existing CSS, Javascript and Image files from the `wwwroot` directory, for example you will note that there is already a `css` directory and a `js` directory. These will not be used in this exercise. In a real application you would have your own CSS, Javascript and Image files. You should also delete the `wwwroot/js/site.js` file if it exists.

### 1. Global Stylesheets (`wwwroot/css/`)

The easiest way to style the app is to use a global CSS stylesheet that is attached to the `_Layout.cshtml` page.

Copy the provided CSS file `site.css` from the `resources` folder and place it inside `wwwroot/css/` directory.

```cshtml
<link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
```

> [!TIP]
> The `asp-append-version="true"` attribute provides automatic browser cache-busting by appending a unique hash parameter to file URLs whenever the stylesheet is edited.

---

### 2. CSS Isolation (Scoped Component Styling)

If you want to style a page in isolation, you can use CSS Isolation. This allows styles to be scoped strictly to a single Razor Page without affecting other pages.

During compilation, ASP.NET Core automatically bundles scoped styles into `[ProjectName].styles.css` (e.g. `MyRazorApp.styles.css`) and attaches unique scope attributes (e.g. `b-1234567890`) to matching elements.

---

| [⬅️ Previous: 02 - Pages & Routing](02-pages-and-routing.md) | [🏠 Lab Overview](readme.md) | [Next: 04 - Razor Expressions ➡️](04-razor-expressions.md) |
|:--- |:---:| ---:|
