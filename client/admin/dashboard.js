document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/admin/stats', { credentials: 'same-origin' });
        const result = await res.json();
        if (result.success) {
            document.getElementById('statCertificates').innerText = result.data.certificates;
            document.getElementById('statGallery').innerText = result.data.gallery;
            document.getElementById('statMessages').innerText = result.data.messages;
            document.getElementById('statSkills').innerText = result.data.skills;
            document.getElementById('statActivities').innerText = result.data.activities;
        }
    } catch (err) {
        console.error('Error loading stats:', err);
    }
});
