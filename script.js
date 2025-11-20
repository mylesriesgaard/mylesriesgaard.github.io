// THEME DROPDOWN + TERMINAL TYPING

document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.querySelector(".settings-btn");
    const dropdown = document.querySelector(".dropdown-menu");
    const themeButtons = document.querySelectorAll(".theme-option");
    const body = document.body;

    const terminalEl = document.getElementById("terminal-text");
    let typingTimeout = null; 
    let typingIndex = 0;
    let isTyping = false;

    function getCurrentTheme() {
        const match = document.body.className.match(/theme-(\S+)/);
        return match ? match[1] : null;
    }

    function getMessageForTheme() {
        const theme = getCurrentTheme();

        switch (theme) {
            case "windows95":
                return "Developers, developers, developers, developers";
            case "aftersun":
                return "I think it's nice that we share the same sky";
            case "her":
                return "Where are you going?";
            case "kimochiwarui":
                return "When? When? When? When? When? When? When?"
            case "spaceheavy":
                return "They put a heavy space between us"
            case "theglow":
                return "I want wind to blow"
            default:
                return "Me with nothing to say / and you and your autumn sweater";
        }
    }

    function startTerminalTyping() {
        const text = getMessageForTheme();

        if (typingTimeout) clearTimeout(typingTimeout);

        typingIndex = 0;
        isTyping = true;
        terminalEl.textContent = "";
        terminalEl.classList.remove("done");

        function type() {
            if (typingIndex < text.length) {
                terminalEl.textContent += text.charAt(typingIndex);
                typingIndex++;
                typingTimeout = setTimeout(type, 100);
            } else {
                isTyping = false;
                terminalEl.classList.add("done");
            }
        }

        type();
    }

    // -----------------------------
    // THEME DROPDOWN
    // -----------------------------
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
            const theme = btn.dataset.theme;

            body.className = body.className.replace(/\btheme-\S+/g, "");
            body.classList.add(`theme-${theme}`);
            localStorage.setItem("theme", theme);

            dropdown.style.display = "none";
            settingsBtn.classList.remove("open");

            startTerminalTyping();
        });
    });

    startTerminalTyping();



    // ----------------------------------------------
    // UNIVERSAL FILTER SCRIPT
    // ----------------------------------------------
    const buttons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    if (!buttons.length || !projects.length) return;

    const filterAttr = projects[0].hasAttribute('data-category') ? 'data-category' :
                       projects[0].hasAttribute('data-role') ? 'data-role' : null;

    if (!filterAttr) return;

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

            proj.style.display = (filter === 'all' || values.includes(filter)) ?
                'block' : 'none';
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

    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter') ? params.get('filter').toLowerCase() : 'all';
    const initialFilter = validFilters.includes(filterParam) ? filterParam : 'all';
    applyFilter(initialFilter, false);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter').toLowerCase();
            applyFilter(filter, true);
        });
    });

    window.addEventListener('popstate', e => {
        const filter = e.state?.filter || 'all';
        applyFilter(filter, false);
    });

});
