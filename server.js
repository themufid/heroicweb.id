const express = require('express');
const path = require('path');
const exceljs = require('exceljs');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');

const app = express();

// Middleware untuk mendapatkan data dari form POST
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/accounts/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'accounts/login.html'));
});

app.post('/accounts/login', (req, res) => {
    const { email, password } = req.body;

    // Membaca data dari file Excel
    const workbook = xlsx.readFile('database.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const user = data.find(user => user.email === email && user.password === password);
    if (user) {
        res.redirect('/accounts/dashboard');
    } else {
        res.send('Login gagal. Email atau password salah.');
    }
});

app.get('/accounts/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'accounts/register.html'));
});

app.post('/accounts/register', (req, res) => {
    const { name, email, password } = req.body;

    // Simpan data pengguna ke dalam file Excel
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Pengguna');

    // Menambahkan header
    worksheet.addRow(['Nama', 'Email', 'Password']);
    
    // Menambahkan data pengguna
    worksheet.addRow([name, email, password]);

    // Simpan workbook ke file Excel
    workbook.xlsx.writeFile(path.join(__dirname, 'database.xlsx'))
        .then(() => {
            console.log('Data pengguna berhasil disimpan ke dalam database, silahkan login.');
            res.redirect('/accounts/login');
        })
        .catch((error) => {
            console.error('Gagal menyimpan data pengguna:', error);
            res.status(500).send('Registrasi gagal. Silakan coba lagi.');
        });
});

app.get('/accounts/dashboard', (req, res) => {
    res.render('dashboard', { user: { name: 'Rodhi Faisal', email: 'cs.heroicweb@gmail.com' } });
});

app.get('/accounts/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'accounts/forgot-password.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/author', (req, res) => {
    res.sendFile(path.join(__dirname, 'author.html'));
});

app.get('/about-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'about-us.html'));
});

app.get('/security/disclaimer', (req, res) => {
    res.sendFile(path.join(__dirname, '/security/disclaimer.html'));
});

app.get('/security/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'security/privacy-policy.html'));
});

app.get('/security/term', (req, res) => {
    res.sendFile(path.join(__dirname, 'security/term.html'));
});

app.get('/articles/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'articles/blogs.html'));
});

app.get('/articles/all/group-link', (req, res) => {
    res.sendFile(path.join(__dirname, 'articles/all/group-link.html'));
});

app.get('/portfolio/project', (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio/project.html'));
});

app.get('/career/details', (req, res) => {
    res.sendFile(path.join(__dirname, 'career/details.html'));
});

app.get('/career/intern', (req, res) => {
    res.sendFile(path.join(__dirname, 'career/intern.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
