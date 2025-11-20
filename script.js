// THEME DROPDOWN

document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.querySelector(".settings-btn");
    const dropdown = document.querySelector(".dropdown-menu");
    const themeButtons = document.querySelectorAll(".theme-option");
    const body = document.body;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) body.classList.add(`theme-${savedTheme}`);

    // Toggle menu
    settingsBtn.addEventListener("click", () => {
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
      settingsBtn.classList.toggle("open");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!settingsBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
        settingsBtn.classList.remove("open");
      }
    });

    // Theme change
    themeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remove old theme class
        body.className = body.className.replace(/\btheme-\S+/g, "");
        // Add new theme
        const theme = btn.dataset.theme;
        body.classList.add(`theme-${theme}`);
        // Save
        localStorage.setItem("theme", theme);
        // Close menu
        dropdown.style.display = "none";
        settingsBtn.classList.remove("open");
      });
    });
});

// TERMINAL TYPING (unused for now)

document.addEventListener("DOMContentLoaded", function() {
    const text = "Me with nothing to say / and you and your autumn sweater";
    const el = document.getElementById("terminal-text");
    let i = 0;

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 100);
      } else {
        el.classList.add("done");
      }
    }

    type();
});

// UNIVERSAL FILTER SCRIPT

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    if (!buttons.length || !projects.length) return; // Nothing to filter

    // Determine which attribute to filter by: data-category or data-role
    const filterAttr = projects[0].hasAttribute('data-category') ? 'data-category' :
                       projects[0].hasAttribute('data-role') ? 'data-role' : null;

    if (!filterAttr) return; // No valid attribute found

    // Set valid filters based on the page
    let validFilters;
    if (filterAttr === 'data-category') {
        validFilters = ['animation', 'design', 'film', 'programming', 'all'];
    } else {
        validFilters = ['composer', 'sound mixer', 'boom operator', 'all'];
    }

    function applyFilter(filter, updateURL = true) {
        buttons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-filter') === filter);
        });

        projects.forEach(proj => {
            const values = proj.getAttribute(filterAttr)
                .split(',')
                .map(v => v.trim().toLowerCase());

            if (filter === 'all' || values.includes(filter)) {
                proj.style.display = 'block';
            } else {
                proj.style.display = 'none';
            }
        });

        if (updateURL) {
            const url = new URL(window.location);
            if (filter === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filter);
            }
            window.history.pushState({ filter }, '', url);
        }
    }

    // Initial filter from URL
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter') ? params.get('filter').toLowerCase() : 'all';
    const initialFilter = validFilters.includes(filterParam) ? filterParam : 'all';
    applyFilter(initialFilter, false);

    // Button clicks
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter').toLowerCase();
            applyFilter(filter, true);
        });
    });

    // Handle back/forward browser buttons
    window.addEventListener('popstate', e => {
        const filter = e.state?.filter || 'all';
        applyFilter(filter, false);
    });
});
