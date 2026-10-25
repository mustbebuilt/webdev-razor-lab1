# 07 - Adding JavaScript & Client-Side Interactivity (Burger Menu)

In previous steps of this lab, we focused on server-side rendering: generating HTML dynamically with Razor expressions, setting up shared layout templates, and loading data models into views.

However, modern web applications also require client-side interactivity that responds instantly to user actions without triggering a full page reload. In this step, we will add client-side JavaScript to power a responsive, accessible mobile navigation menu (burger menu).

> [!NOTE]
> The CSS styles for the burger button, mobile drawer animations, and responsive breakpoints are already included in your `wwwroot/css/site.css` file. You only need to update the shared layout template and add the JavaScript file.

---

## Step 1: Update the Master Layout (`Pages/Shared/_Layout.cshtml`)

We need to update `Pages/Shared/_Layout.cshtml` to:
1. Reference our client-side script (`~/js/site.js`) inside the `<head>` using the `defer` attribute and `asp-append-version="true"`.
2. Add the burger menu toggle button (`#burgerToggle`) and wrap the navigation links inside `#primaryNav`.
3. Include accessible ARIA attributes (`aria-label`, `aria-controls`, and `aria-expanded`) for screen readers.

Replace the contents of `Pages/Shared/_Layout.cshtml` with the following:

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

### Key Additions to `_Layout.cshtml`:
- **`<script src="~/js/site.js" asp-append-version="true" defer></script>`**: Placed in the `<head>` with `defer` so the browser downloads it in parallel while parsing HTML, executing it immediately when the DOM is ready. `asp-append-version="true"` enables automatic cache busting.
- **`<button id="burgerToggle" ... aria-expanded="false">`**: The toggle button with three lines that animate into an "X" when clicked. The `aria-expanded` attribute communicates whether the navigation drawer is currently open or collapsed.
- **`<nav id="primaryNav" class="nav-menu">`**: The navigation container targeted by both the CSS responsive rules and the JavaScript click handler.

---

## Step 2: Add and Understand `wwwroot/js/site.js`

1. Create the `wwwroot/js/` directory if it does not already exist:
   ```bash
   mkdir -p wwwroot/js
   ```

2. Copy `site.js` from `resources/wwwroot/js/site.js` to `wwwroot/js/site.js` (or create the file directly):
   ```bash
   cp resources/wwwroot/js/site.js wwwroot/js/site.js
   ```

### Code Explanation: `wwwroot/js/site.js`

Here is the JavaScript code powering the mobile menu:

```javascript
/**
 * Responsive Mobile Navigation (Burger Menu)
 * Loaded with 'defer' in <head> - executes after DOM tree is parsed.
 */
const burgerToggle = document.getElementById('burgerToggle');
const primaryNav = document.getElementById('primaryNav');

if (burgerToggle && primaryNav) {
  function toggleMenu(isOpen) {
    const shouldOpen = isOpen !== undefined ? isOpen : !primaryNav.classList.contains('is-open');
    primaryNav.classList.toggle('is-open', shouldOpen);
    burgerToggle.classList.toggle('is-active', shouldOpen);
    burgerToggle.setAttribute('aria-expanded', String(shouldOpen));
  }

  // Toggle open/close on button click
  burgerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when a navigation link is clicked
  primaryNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (primaryNav.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(e.target) &&
        !burgerToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close menu with Escape key and return focus to burger button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      toggleMenu(false);
      burgerToggle.focus();
    }
  });

  // Reset menu state when viewport expands to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && primaryNav.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}
```

### How the Script Works:

- **Targeting Elements**: Locates `#burgerToggle` and `#primaryNav` by their IDs. Because the script uses `defer`, the elements are guaranteed to exist without needing a `DOMContentLoaded` wrapper.
- **State Toggling (`toggleMenu`)**: Toggles the `.is-open` CSS class on the navigation drawer, the `.is-active` class on the burger button (which transforms the lines into an "X"), and updates `aria-expanded` to `"true"` or `"false"`.
- **Button Click**: Toggles the menu open or closed when the user taps or clicks the burger button.
- **Link Click**: Closes the menu automatically when a navigation link is clicked so mobile users see their selected page right away.
- **Dismiss on Outside Click**: Closes the menu if a user clicks anywhere outside the navigation drawer and toggle button.
- **Keyboard Accessibility (<kbd>Escape</kbd>)**: Closes the open menu and restores keyboard focus to `#burgerToggle` when the user presses <kbd>Escape</kbd>.
- **Responsive Reset**: Automatically closes the mobile menu if the browser window is resized to desktop width (768px or wider).

---

## Step 3: Run and Test the Application

Start your development server:

```bash
dotnet watch run
```

1. Open your browser and navigate to `http://localhost:<port>/`.
2. Open Developer Tools (<kbd>F12</kbd> or <kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd>) and toggle Device Mode to a mobile viewport (< 768px).
3. **Test the Burger Menu**:
   - Click the burger button: the three bars animate into an "X" and the navigation menu slides down.
   - Click outside the menu or press <kbd>Escape</kbd>: the menu closes smoothly.
   - Click a link: the menu collapses and navigates to the selected page.
4. Resize back to desktop width (> 768px) and verify that the standard horizontal navigation bar appears.

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
| **07 - Adding JavaScript (This Step)** | Client-side DOM interactivity in Razor Pages, deferred script execution in `<head>`, accessible ARIA mobile navigation, and event handling. |

You now have a production-ready foundation in building structured, styled, dynamic, and interactive server-rendered web applications with ASP.NET Core Razor Pages.

---

| [⬅️ Previous: 06 - Loading JSON Data into Views](06-json-to-view.md) | [🏠 Lab Overview](readme.md) | ✅ **Lab Complete** |
|:--- |:---:| ---:|
