document.addEventListener("DOMContentLoaded", () => {
    const main_element = document.getElementById("main");
    const menu_toggle = document.getElementById("menu-toggle");
    const menu_close = document.getElementById("menu-close");
    const sidebar = document.getElementById("sidebar");
    function isMobile() {
        return window.matchMedia("(max-width:768px)").matches;
    }
    function createFrame(src) {
        const alt_paragraph = document.createElement("p");
        alt_paragraph.innerHTML = `If you use a screen reader, you may find it easier to <a href="${src}" target="_blank">open the link directly</a>.`;
        const iframe = document.createElement("iframe");
        iframe.src = src;
        main_element.innerHTML = "";
        main_element.appendChild(alt_paragraph);
        main_element.appendChild(iframe);
    }
    function loadSection(section) {
        if (!section) section = "welcome";
        if (section == "membership") createFrame("https://docs.google.com/forms/d/e/1FAIpQLSfB8VUYoqEEwK6-XKYPWTimVWTtab5Coy1pTiKX6KFBDPVIdg/viewform?embedded=true");
        else if (section == "constitution") createFrame("docs/constitution.html");
        else {
        fetch(`pages/${section}.html`).then(response => {
            if (!response.ok) throw new Error("Page not found.");
            return response.text();
        }).then(html => {
            main_element.innerHTML = html;
        }).catch(() => {
            main_element.innerHTML = "<p>Sorry, that page could not be loaded.</p>";
        });
            }
    }
    window.addEventListener("hashchange", () => {
        const section = window.location.hash.substring(1);
        loadSection(section);
        if (isMobile() && sidebar.classList.contains("active")) {
            sidebar.classList.remove("active");
            sidebar.setAttribute("aria-hidden", "true");
            menu_toggle.setAttribute("aria-expanded", "false");
        }
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
if (isMobile()) sidebar.setAttribute("aria-hidden", "true");
});
