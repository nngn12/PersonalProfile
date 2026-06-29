const API_URL = '/api/certificates';

const certificateContainer = document.getElementById('certificateContainer');
const certificateModal = document.getElementById('certificateModal');
const addCertificateBtn = document.getElementById('addCertificateBtn');
const closeModal = document.getElementById('closeModal');
const certificateForm = document.getElementById('certificateForm');

let isEditing = false;
let editId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchCertificates();
    setupEventListeners();
});

function setupEventListeners() {
    if (addCertificateBtn) {
        addCertificateBtn.addEventListener('click', () => {
            isEditing = false;
            editId = null;
            if (certificateForm) certificateForm.reset();
            document.querySelector('.modal-content h2').innerText = 'Add Certificate';
            certificateModal.classList.add('open');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => certificateModal.classList.remove('open'));
    }

    window.addEventListener('click', (e) => {
        if (e.target === certificateModal) certificateModal.classList.remove('open');
    });

    if (certificateForm) {
        certificateForm.addEventListener('submit', handleFormSubmit);
    }
}

async function fetchCertificates() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
            renderCertificates(result.data);
        }
    } catch (error) {
        console.error('Error fetching records:', error);
    }
}

function renderCertificates(items) {
    if (!certificateContainer) return;
    document.getElementById('totalCount').innerText = `Total: ${items.length} certificates`;
    certificateContainer.innerHTML = '';

    if (items.length === 0) {
        certificateContainer.innerHTML = `<div class="empty-state"><h3>No credentials compiled yet.</h3></div>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'certificate-card';
        const readableDate = item.date_earned ? new Date(item.date_earned).toLocaleDateString() : 'N/A';

        card.innerHTML = `
            <img src="${item.image_url || '/assets/certificates/AiFluency.jpg'}" alt="${item.title}">
            <div class="card-content">
                <h2>${item.title}</h2>
                <p class="issuer-text">${item.issuer}</p>
                <p class="date-text">${readableDate}</p>
                <p class="description-text">${item.description}</p>
                <div class="card-buttons">
                    <button class="edit-btn" onclick="openEditModal('${item.id}', '${escapeHtml(item.title)}', '${escapeHtml(item.issuer)}', '${item.date_earned}', '${escapeHtml(item.description)}')">Edit</button>
                    <button class="delete-btn" onclick="deleteItem('${item.id}')">Delete</button>
                </div>
            </div>`;
        certificateContainer.appendChild(card);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('issuer', document.getElementById('issuer').value);
    formData.append('date_earned', document.getElementById('date').value);
    formData.append('description', document.getElementById('description').value);

    const fileInput = document.getElementById('image');
    if (fileInput.files[0]) formData.append('image', fileInput.files[0]);

    const url = isEditing ? `${API_URL}/${editId}` : `${API_URL}/`;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, { method, body: formData });
    if (response.ok) {
        certificateModal.classList.remove('open');
        certificateForm.reset();
        fetchCertificates();
    }
}

async function deleteItem(id) {
    if (confirm('Permanently wipe out this credential record?')) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) fetchCertificates();
    }
}

window.openEditModal = function (id, title, issuer, date, desc) {
    isEditing = true;
    editId = id;
    document.querySelector('.modal-content h2').innerText = 'Edit Certificate';
    document.getElementById('title').value = title;
    document.getElementById('issuer').value = issuer;
    document.getElementById('date').value = date ? new Date(date).toISOString().split('T')[0] : '';
    document.getElementById('description').value = desc;
    certificateModal.classList.add('open');
};

function escapeHtml(str) {
    return str ? str.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
}