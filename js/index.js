document.addEventListener("DOMContentLoaded", () => {
    const main_element = document.getElementById("main");
    const menu_toggle = document.getElementById("menu-toggle");
    const menu_close = document.getElementById("menu-close");
    const sidebar = document.getElementById("sidebar");
    function loadSection(section) {
        if (!section) section = "welcome";
        fetch(`${section}.html`).then(response => {
            if (!response.ok) throw new Error("Page not found.");
            return response.text();
        }).then(html => {
            main_element.innerHTML = html;
        }).catch(() => {
            main_element.innerHTML = "<p>Sorry, that page could not be loaded.</p>";
        });
    }
    window.addEventListener("hashchange", () => {
        const section = window.location.hash.substring(1);
        loadSection(section);
    });
    const initial_section = window.location.hash.substring(1);
    loadSection(initial_section);
    menu_toggle.addEventListener("click", () => {
        if (!sidebar.classList.contains("active")) {
            sidebar.classList.add("active");
            sidebar.setAttribute("aria-hidden", "false");
            menu_toggle.setAttribute("aria-expanded", "true");
        }
        else {
            sidebar.classList.remove("active");
            sidebar.setAttribute("aria-hidden", "true");
            menu_toggle.setAttribute("aria-expanded", "false");
        }
    });
    menu_close.addEventListener("click", () => {
        sidebar.classList.remove("active");
        sidebar.setAttribute("aria-hidden", "true");
        menu_toggle.setAttribute("aria-expanded", "false");
    });
});
