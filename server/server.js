const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Assets from Client directory roots
app.use('/admin', express.static(path.join(__dirname, '../client/admin')));
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));
app.use(express.static(path.join(__dirname, '../client')));

// Defensive Router Imports (Handles both CommonJS and ES Module defaults)
const certificatesModule = require('./certificates.js');
const galleryModule = require('./gallery.js');
const adminModule = require('./admin.js');

const certificatesApiRouter = certificatesModule.default || certificatesModule;
const galleryApiRouter = galleryModule.default || galleryModule;
const adminApiRouter = adminModule.default || adminModule;

// Verify routers are valid functions before attaching to prevent crashes
if (typeof certificatesApiRouter === 'function' || (certificatesApiRouter && certificatesApiRouter.use)) {
    app.use('/api/certificates', certificatesApiRouter);
} else {
    console.error('❌ Error: server/certificates.js is not exporting a valid Express router!');
}

if (typeof galleryApiRouter === 'function' || (galleryApiRouter && galleryApiRouter.use)) {
    app.use('/api/gallery', galleryApiRouter);
} else {
    console.error('❌ Error: server/gallery.js is not exporting a valid Express router!');
}

if (typeof adminApiRouter === 'function' || (adminApiRouter && adminApiRouter.use)) {
    app.use('/api/admin', adminApiRouter);
} else {
    console.error('❌ Error: server/admin.js is not exporting a valid Express router!');
}

// Clean Extensionless View Routes
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/admin/dashboard.html'));
});

app.get('/admin/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/admin/gallery.html'));
});

app.get('/admin/certificates', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/admin/certificates.html'));
});

app.get('/admin/messages', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/admin/message.html'));
});

// App Engine Initiation
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Workspace server running at http://localhost:${PORT}`));