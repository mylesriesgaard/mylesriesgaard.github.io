// THEME DROPDOWN

document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.querySelector(".settings-btn");
    const dropdown = document.querySelector(".dropdown-menu");
    const themeButtons = document.querySelectorAll(".theme-option");
    const body = document.body;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) body.classList.add(`theme-${savedTheme}`);

    settingsBtn.addEventListener("click", () => {
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
      settingsBtn.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!settingsBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
        settingsBtn.classList.remove("open");
      }
    });

    themeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        body.className = body.className.replace(/\btheme-\S+/g, "");
        const theme = btn.dataset.theme;
        body.classList.add(`theme-${theme}`);
        localStorage.setItem("theme", theme);
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

    if (!buttons.length || !projects.length) return;

    // Detect which attribute the page uses
    const filterAttr = projects[0].hasAttribute('data-category')
        ? 'data-category'
        : projects[0].hasAttribute('data-role')
        ? 'data-role'
        : null;

    if (!filterAttr) return;

    // GROUPS
    const roleGroups = {
        sound: ['sound mixer', 'sound designer', 'boom operator', 'sound designer'],
        music: ['composer']
    };

    let validFilters;

    if (filterAttr === 'data-category') {
        // Programming page
        validFilters = ['animation', 'design', 'programming', 'all'];

    } else {
        // Film page
        validFilters = ['sound', 'music', 'other', 'all'];
    }

    function applyFilter(filter, updateURL = true) {
        // Update active button
        buttons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-filter') === filter);
        });

        projects.forEach(proj => {
            const values = proj.getAttribute(filterAttr)
                .split(',')
                .map(v => v.trim().toLowerCase());

            let match = false;

            if (filter === 'all') {
                match = true;

            } else if (filterAttr === 'data-category') {
                // NORMAL FILTERING (projects page)
                match = values.includes(filter);

            } else {
                // GROUPED FILTERING (film page)

                if (filter === 'other') {
                    const knownRoles = [...roleGroups.sound, ...roleGroups.music];
                    match = values.some(v => !knownRoles.includes(v));

                } else {
                    const groupRoles = roleGroups[filter] || [];
                    match = values.some(v => groupRoles.includes(v));
                }
            }

            proj.style.display = match ? 'block' : 'none';
        });

        // URL sync
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

    // INITIAL LOAD
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter')?.toLowerCase() || 'all';
    const initialFilter = validFilters.includes(filterParam) ? filterParam : 'all';

    applyFilter(initialFilter, false);

    // BUTTON EVENTS
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter').toLowerCase();
            applyFilter(filter, true);
        });
    });

    // BACK BUTTON SUPPORT
    window.addEventListener('popstate', e => {
        const filter = e.state?.filter || 'all';
        applyFilter(filter, false);
    });
});

// DESIGN IMAGE LIGHTBOX

document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".about-text .project-media img");
    if (!images.length) return;

    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Expanded image preview");
    lightbox.innerHTML = `
        <button class="image-lightbox-close" type="button" aria-label="Close expanded image">&times;</button>
        <img class="image-lightbox-content" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".image-lightbox-content");
    const closeButton = lightbox.querySelector(".image-lightbox-close");
    let previouslyFocusedElement;

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        document.body.classList.remove("lightbox-open");
        if (previouslyFocusedElement) previouslyFocusedElement.focus();
    }

    function openLightbox(image) {
        previouslyFocusedElement = document.activeElement;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.classList.add("is-open");
        document.body.classList.add("lightbox-open");
        closeButton.focus();
    }

    images.forEach(image => {
        image.classList.add("expandable-image");
        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", `Expand image: ${image.alt}`);

        image.addEventListener("click", event => {
            event.preventDefault();
            openLightbox(image);
        });

        image.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(image);
            }
        });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });
});