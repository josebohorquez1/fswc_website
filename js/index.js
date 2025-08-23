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
    function activateTab(tab) {
        const tabs = document.querySelectorAll("[role='tab']");
        const panels = document.querySelectorAll("[role='tabpanel']");
        tabs.forEach(t => {
            t.setAttribute("aria-selected", "false");
            t.setAttribute("tabindex", "-1");
        });
        panels.forEach(panel => panel.hidden = true);
        tab.setAttribute("aria-selected", "true");
        tab.removeAttribute("tabindex");
        tab.focus();
        const panel_id = tab.getAttribute("aria-controls");
        const iframe = document.createElement("iframe");
        if (panel_id == "panel-1") iframe.src = "https://nfbnet.org/mailman/listinfo/nfbf-statewide_nfbnet.org";
        else iframe.src = "https://nfbnet.org/mailman/listinfo/nfbf-l_nfbnet.org";
        iframe.innerHTML = "Loading...";
        const alt_paragraph = document.createElement("p");
        alt_paragraph.innerHTML = `If you use a screen reader, you may find it easier to <a href="${iframe.src}" target="_blank">open the link directly</a>.`;
        document.getElementById(panel_id).innerHTML = "";
        document.getElementById(panel_id).appendChild(alt_paragraph);
        document.getElementById(panel_id).appendChild(iframe);
        document.getElementById(panel_id).setAttribute("tabindex", "0");
        document.getElementById(panel_id).hidden = false;
    }
    function setupTabs() {
        const tabs = document.querySelectorAll("[role='tab']");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => activateTab(tab));
            tab.addEventListener("keydown", e => {
                let new_tab;
                switch (e.key) {
                    case "ArrowLeft":
                    case "ArrowUp":
                        new_tab = tab.previousElementSibling || tab.parentElement.lastElementChild;
                        new_tab.focus();
                        break;
                    case "ArrowRight":
                    case "ArrowDown":
                        new_tab = tab.nextElementSibling || tab.parentElement.firstElementChild;
                        new_tab.focus();
                        break;
                    case "Home":
                        new_tab = tab.parentElement.firstElementChild;
                        new_tab.focus();
                        break;
                    case "End":
                        new_tab = tab.parentElement.lastElementChild;
                        new_tab.focus();
                        break;
                        case "Enter":
                            case " ":
                                activateTab(new_tab);
                                break;
                                    default:
                                        return;
                }
            });
        });
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
            if (section == "mailing_list") setupTabs();
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
