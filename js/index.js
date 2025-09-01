document.addEventListener("DOMContentLoaded", () => {
    const main_element = document.getElementById("main");
    const menu_toggle = document.getElementById("menu-toggle");
    const menu_close = document.getElementById("menu-close");
    const sidebar = document.getElementById("sidebar");
    function isMobile() {
        return window.matchMedia("(max-width:768px)").matches;
    }
    function loadMinutes() {
        fetch("docs/Minutes/minutes.json").then(response => response.json()).then(data => {
            const container = document.getElementById("minutesContainer");
            Object.keys(data).sort((a, b) => a - b).forEach(year => {
                const button = document.createElement("button");
                button.textContent = year;
                button.className = "year-button";
                button.setAttribute("aria-expanded", "false");
                const links_div = document.createElement("div");
                links_div.className = "minutes-links";
                links_div.hidden = true;
                data[year].forEach(item => {
                    const link = document.createElement("a");
                    link.href = item.url;
                    link.innerHTML = `${item.title}<span class="sr-only">(link opens in a new tab)</span>`;
                    link.target = "_blank";
                    links_div.appendChild(link);
                    links_div.appendChild(document.createElement("br"));
                });
                button.addEventListener("click", () => {
                    const expanded = button.getAttribute("aria-expanded") === "true";
                    button.setAttribute("aria-expanded", String(!expanded));
                    links_div.hidden = expanded;
                });
                container.appendChild(button);
                container   .appendChild(links_div);
        });
        });
    }
    function loadAnnouncements() {
        const announcements_container = document.getElementById("announcementsContainer");
        const list = document.createElement("ul");
        const article = document.createElement("article");
        const sorted_data = fetch("docs/announcements/announcements.json").then(response => response.json()).then(data => {
            if (!data) {
                announcements_container.innerHTML += "<p>No announcements available at this time.</p>";
                return;
            }
           const sorted_data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
           sorted_data.forEach(item => {
            const list_item = document.createElement("li");
            const link = document.createElement("a");
            link.textContent = item.title;
            link.href = "javascript:void(0)";
            link.setAttribute("aria-current", "false");
            list_item.appendChild(link);
            list.appendChild(list_item);
    });
            announcements_container.appendChild(list);
            announcements_container.appendChild(article);
    const links = document.querySelectorAll("#announcementsContainer ul li a");
        links.forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();
                links.forEach(l => l.removeAttribute("aria-current"));
                link.setAttribute("aria-current", "true");
                article.innerHTML = "";
                const obj = data.find(i => i.title === link.textContent);
                const header = document.createElement("header");
                const title = document.createElement("h3");
                title.textContent = obj.title;
                const date = document.createElement("p");
                date.textContent = new Date(obj.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                const author = document.createElement("p");
                author.textContent = `By: ${obj.author}`;
                header.appendChild(title);
                header.appendChild(date);
                header.appendChild(author);
                article.appendChild(header);
                fetch(obj.url).then(response => {
                    if (!response.ok) throw new Error("Announcement content not found.");
                    return response.text();
                }).then(html => {
                    article.innerHTML += html;
                }).catch(() => {
                    article.innerHTML += "<p>Sorry, the announcement content could not be loaded.</p>";
                });
            });
        });
    });
    }
    function loadSection(section) {
        if (!section) section = "home";
    fetch(`pages/${section}.html`).then(response => {
        if (!response.ok) throw new Error("Page not found.");
        return response.text();
    }).then(html => {
        main_element.innerHTML = html;
        if (section == "minutes") loadMinutes();
        if (section == "announcements") loadAnnouncements();
    }).catch(() => {
        main_element.innerHTML = "<p>Sorry, that page could not be loaded.</p>";
    });
    const nav_links = document.querySelectorAll("nav a");
    nav_links.forEach(link => link.removeAttribute("aria-current"));
    Array.from(nav_links).find(link => link.getAttribute("href").substring(1) == section)?.setAttribute("aria-current", "true");
    }
    window.addEventListener("hashchange", () => {
        const section = window.location.hash.substring(1);
        loadSection(section);
        if (isMobile() && sidebar.classList.contains("active")) {
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
