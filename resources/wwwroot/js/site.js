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
