const adminPassword = "142536789";
const panel = document.getElementById("panel");
const loginForm = document.getElementById("loginForm");

function login() {
    const password = document.getElementById("password").value;
    if (password === adminPassword) {
        loginForm.style.display = "none";
        panel.style.display = "block";
        fetchLicenses();
    } else {
        alert("Incorrect password!");
    }
}

function logout() {
    loginForm.style.display = "block";
    panel.style.display = "none";
}

function createLicense() {
    const playerId = document.getElementById("playerId").value;
    const expirationDate = document.getElementById("expirationDate").value;

    fetch('https://gladiusak.onrender.com/create-license', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerId,
            licenseKey: generateLicenseKey(),
            expirationDate
        })
    }).then(response => response.json())
      .then(data => {
          alert("License created successfully!");
          fetchLicenses();
      })
      .catch(error => alert("Error creating license: " + error));
}

function fetchLicenses() {
    fetch('https://gladiusak.onrender.com/list-licenses')
        .then(response => response.json())
        .then(data => {
            const licensesDiv = document.getElementById("licenses");
            licensesDiv.innerHTML = ''; // Clear previous licenses
            data.licenses.forEach(license => {
                const licenseElement = document.createElement("div");
                licenseElement.innerHTML = `
                    <p>License: ${license.licenseKey} (Expires: ${license.expirationDate})</p>
                    <button onclick="deleteLicense('${license.licenseKey}')">Delete</button>
                    <button onclick="extendLicense('${license.licenseKey}')">Add 15 Days</button>
                `;
                licensesDiv.appendChild(licenseElement);
            });
        });
}

function deleteLicense(licenseKey) {
    fetch('https://gladiusak.onrender.com/delete-license', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ licenseKey })
    }).then(response => response.json())
      .then(data => {
          alert("License deleted!");
          fetchLicenses();
      })
      .catch(error => alert("Error deleting license: " + error));
}

function extendLicense(licenseKey) {
    fetch('https://gladiusak.onrender.com/update-license', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ licenseKey, newExpirationDate: add15Days(new Date()) })
    }).then(response => response.json())
      .then(data => {
          alert("License extended by 15 days!");
          fetchLicenses();
      })
      .catch(error => alert("Error extending license: " + error));
}

function generateLicenseKey() {
    return 'LIC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function add15Days(date) {
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
}
