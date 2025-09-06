document.addEventListener("DOMContentLoaded", () => {
    const main_element = document.getElementById("main");
    const menu_toggle = document.getElementById("menu-toggle");
    const menu_close = document.getElementById("menu-close");
    const sidebar = document.getElementById("sidebar");
    function isMobile() {
        return window.matchMedia("(max-width:768px)").matches;
    }
    function openMobileNav() {
        menu_toggle.setAttribute("aria-expanded", "true");
        sidebar.classList.add("active");
        sidebar.inert = false;
        document.querySelectorAll("body > *:not(nav)").forEach(el => el.inert = true);
    }
    function closeMobileNav() {
        menu_toggle.setAttribute("aria-expanded", "false");
        sidebar.classList.remove("active");
        sidebar.inert = true;
        document.querySelectorAll("body > *:not(nav)").forEach(el => el.inert = false);
    }
    function loadMinutes() {
        main_element.innerHTML = `
                                    <section id="minutesContainer" aria-labelledby="meetingMinutesHeading">
                                        <h2 id="meetingMinutesHeading">Our Meeting Minutes</h2>
                                        <p>Below are the minutes from our recent meetings. Click on a year and a month to view the minutes.</p>
                                    </section>
                                    `;
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
                    link.href = `pages/minutes.html?date=${item.date}`;
                    link.innerHTML = `${item.title}`;
                    links_div.appendChild(link);
                    links_div.appendChild(document.createElement("br"));
                });
                button.addEventListener("click", e => {
                    e.preventDefault();
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
        const announcements_container = document.createElement("section");
        announcements_container.setAttribute("aria-labelledby", "announcementsHeading");
        announcements_container.id = "announcementsContainer";
        announcements_container.innerHTML = `
    <h2 id="announcementsHeading">Announcements</h2>
    <p>Welcome to the Announcements section of the Florida Statewide Chapter website! Here, you'll find the latest news, updates, and important information about our chapter's activities and events. Stay informed and connected with us!</p>
    <p>Click each link to view an announcement.</p>
        `
        main_element.innerHTML = "";
        main_element.appendChild(announcements_container);
        const list = document.createElement("ul");
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
            link.setAttribute("aria-current", "false");
            link.href = "javascript:void(0);";
            list_item.appendChild(link);
            list.appendChild(list_item);
    });
            announcements_container.appendChild(list);
    const links = document.querySelectorAll("#announcementsContainer ul li a");
        links.forEach(l => {
            l.addEventListener("click", event => {
                event.preventDefault();
                if (!isMobile()) {
                links.forEach(i => i.removeAttribute("aria-current"));
                l.setAttribute("aria-current", "true");
                    }
                    let old_article;
                    if (isMobile()) old_article = document.querySelector(".modal");
                    else old_article = main_element.querySelector("article");
                if (old_article) old_article.remove();
                const article = document.createElement("article");
                article.id = "announcementContent";
                const obj = data.find(i => i.title === l.textContent);
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
                }).then(md => {
                    const content = document.createElement("div");
                    content.id= "announcementBody";
                    content.innerHTML = marked.parse(md);
                    article.appendChild(content);
                    if (!isMobile()) main_element.appendChild(article);
                    else {
                        let modal = document.querySelector(".modal");
                        let close_button;
                        if (!modal) {
                        modal = document.createElement("div");
                        modal.className = "modal";
                        modal.setAttribute("role" ,"dialog");
                        modal.setAttribute("aria-label", "Announcement Details");
                        close_button = document.createElement("button");
                        close_button.className = "modal-close";
                        close_button.textContent = "X";
                        close_button.setAttribute("aria-label", "Close");
                            document.body.appendChild(modal);
                                }
                                modal.hidden = false;
                                const other_elements = document.querySelectorAll("body > *:not(.modal)");
                                other_elements.forEach(el => el.inert = true);
                                close_button.focus();
                        close_button.addEventListener("click", () => {
                            modal.hidden = true;
                            other_elements.forEach(el => el.inert = false);
                            sidebar.inert = true;
                            l.focus();
                        });
                        modal.appendChild(close_button);
                        modal.appendChild(article);
                    }
                }).catch(() => {
                    announcements_container.innerHTML += "<p>Sorry, the announcement content could not be loaded.</p>";
                });
            });
        });
    });
    }
    function loadSection(section) {
        if (!section) section = "home";
        if (section == "minutes") {
            loadMinutes();
            return;
        }
        if (section == "announcements") {
            loadAnnouncements();
            return;
        }
    fetch(`pages/${section}.html`).then(response => {
        if (!response.ok) throw new Error("Page not found.");
        return response.text();
    }).then(html => {
        main_element.innerHTML = html;
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
        if (isMobile() && sidebar.classList.contains("active")) closeMobileNav();
    });
    const initial_section = window.location.hash.substring(1);
    if (isMobile()) sidebar.inert = true;
    loadSection(initial_section);
    menu_toggle.addEventListener("click", () => {
        if (!sidebar.classList.contains("active")) openMobileNav();
        else closeMobileNav();
    });
    menu_close.addEventListener("click", () => closeMobileNav());
});
