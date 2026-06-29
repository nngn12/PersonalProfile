/* --- ADMIN DYNAMIC CONTROLLER --- */

document.addEventListener("DOMContentLoaded", () => {
    // Listen for sidebar clicks
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const path = e.target.getAttribute("href");
            const page = path.split('/').pop();
            renderView(page);
        });
    });
});

async function renderView(page) {
    const view = document.getElementById("dynamic-view");
    const title = document.getElementById("page-title");

    if (page === 'certificates') {
        title.innerText = "Certificates";
        view.innerHTML = "<p>Loading...</p>";

        try {
            const res = await fetch("/api/certificates");
            const result = await res.json();

            let html = `<div class="card-grid">`;
            result.data.forEach(cert => {
                html += `
                    <div class="cert-card">
                        <img src="${cert.image_url}" class="cert-image">
                        <h3 class="cert-title">${cert.title}</h3>
                        <div class="card-actions">
                            <button class="btn-action">Edit</button>
                            <button class="btn-action delete">Delete</button>
                        </div>
                    </div>`;
            });
            html += `</div>`;
            view.innerHTML = html;
        } catch (err) {
            view.innerHTML = "<p>Error loading certificates.</p>";
        }
    }
}