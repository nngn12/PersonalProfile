// =====================================
// 📂 PROJECTS MANAGEMENT
// =====================================

async function loadProjects() {
    try {
        const response = await fetch("/api/projects");
        const result = await response.json();
        const projectsList = document.getElementById("projectsList");

        if (!projectsList) return;
        projectsList.innerHTML = "";

        result.data.forEach(project => {
            projectsList.innerHTML += `
                <div class="project-card">
                    <img src="${project.image_url}" alt="${project.title}" width="250">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <p>
                        <a href="${project.github_link}" target="_blank">View GitHub</a>
                    </p>
                    <button onclick="editProject('${project.id}')">✏️ Edit</button>
                    <button onclick="deleteProject('${project.id}')">🗑 Delete</button>
                    <hr>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

const projectForm = document.getElementById("projectForm");
if (projectForm) {
    projectForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const project = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            image_url: document.getElementById("image_url").value,
            github_link: document.getElementById("github_link").value
        };

        const response = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project)
        });

        const result = await response.json();

        if (result.success) {
            alert("Project added successfully!");
            projectForm.reset();
            loadProjects();
        } else {
            alert(result.error);
        }
    });
}

async function deleteProject(id) {
    const confirmDelete = confirm("Delete this project?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        const result = await response.json();

        if (result.success) {
            alert("Project deleted successfully!");
            loadProjects();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error(error);
    }
}

async function editProject(id) {
    const title = prompt("Enter new title:");
    const description = prompt("Enter new description:");
    const image_url = prompt("Enter new image URL:");
    const github_link = prompt("Enter new Github link:");

    const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, image_url, github_link })
    });

    const result = await response.json();

    if (result.success) {
        alert("Project updated successfully!");
        loadProjects();
    } else {
        alert(result.error);
    }
}


// =====================================
// 🎓 CERTIFICATES MANAGEMENT
// =====================================

// 1. The state lock to prevent double-uploads
let isUploading = false;

// 2. Modal Logic
const modal = document.getElementById("certificateModal");
const addButton = document.getElementById("addCertificateBtn");
const closeModalBtn = document.getElementById("closeModal");

if (addButton && modal && closeModalBtn) {
    addButton.onclick = () => { modal.style.display = "flex"; };
    closeModalBtn.onclick = () => { modal.style.display = "none"; };
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// 3. Load Certificates into Admin Panel
async function loadAdminCertificates() {
    try {
        const response = await fetch("/api/certificates");
        const result = await response.json();

        // Make sure you have a <div id="certificatesList"></div> in your HTML!
        const list = document.getElementById("certificatesList");
        if (!list) return;

        list.innerHTML = "";

        if (result.success) {
            result.data.forEach(cert => {
                list.innerHTML += `
                    <div class="certificate-card">
                        <img src="${cert.image_url}" alt="${cert.title}" width="250">
                        <h3>${cert.title}</h3>
                        <p>${cert.issuer} | ${new Date(cert.date_earned).getFullYear()}</p>
                        <button onclick="deleteCertificate('${cert.id}')">🗑 Delete</button>
                        <hr>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error loading certificates:", error);
    }
}

// 4. Add Certificate (Submit Event)
const certificateForm = document.getElementById("certificateForm");

if (certificateForm) {
    certificateForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Stop the function if an upload is already in progress
        if (isUploading) return;

        // Lock the form
        isUploading = true;

        try {
            // Note: Ensure these IDs match the <input id="..."> in your HTML modal
            const certData = {
                title: document.getElementById("cert_title").value,
                issuer: document.getElementById("cert_issuer").value,
                date_earned: document.getElementById("cert_date").value,
                image_url: document.getElementById("cert_image").value
            };

            const response = await fetch("/api/certificates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(certData)
            });

            const result = await response.json();

            if (result.success) {
                alert("Certificate added successfully!");
                certificateForm.reset();
                modal.style.display = "none";
                loadAdminCertificates();
            } else {
                alert(result.error || "Failed to add certificate.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred during upload.");
        } finally {
            // Always unlock the form when done, whether it succeeded or failed
            isUploading = false;
        }
    });
}

// 5. Delete Certificate
async function deleteCertificate(id) {
    const confirmDelete = confirm("Delete this certificate?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`/api/certificates/${id}`, {
            method: "DELETE"
        });
        const result = await response.json();

        if (result.success) {
            alert("Certificate deleted successfully!");
            loadAdminCertificates();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error(error);
    }
}

// =====================================
// INITIALIZE ON PAGE LOAD
// =====================================
loadProjects();
loadAdminCertificates();