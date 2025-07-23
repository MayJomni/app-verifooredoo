// Base de données simulée
const usersDatabase = {
    "user1": { password: "pass123", phone: "53498558" },
    "user2": { password: "pass456", phone: "22987654" }
};

const userProfiles = {
    "53498558": { 
        nom: "may", 
        prenom: "jomni", 
        api: "API123", 
        apiType: "SOAP" 
    },
    "22987654": { 
        nom: "Trabelsi", 
        prenom: "Amira", 
        api: "API456", 
        apiType: "REST" 
    }
};
async function sendVerificationCode() {
    const phone = document.getElementById('phone').value;
    
    const response = await fetch('http://localhost:5000/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
    });
    
    const data = await response.json();
    smsVerificationCode = data.code; // Stocke le code pour la vérification
    
    document.getElementById('output').innerHTML = `
        Code envoyé ! <strong>Mode test :</strong> ${data.code}
    `;
}

async function verifyCode() {
    const code = document.getElementById('verification-code').value;
    const phone = document.getElementById('phone').value;
    
    const response = await fetch('http://localhost:5000/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
    });
    
    const data = await response.json();
    
    if (data.success) {
        alert("Vérification réussie !");
    } else {
        alert("Échec : " + data.error);
    }
}

let currentUser = null;
let smsVerificationCode = null;
let verificationPhone = null;

// Gestion des interfaces
function showView(viewId) {
    document.querySelectorAll('.container').forEach(container => {
        container.classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
}

function showLogin() {
    showView('auth-container');
}

function showRegister() {
    showView('register-container');
}

function showVerification(phone) {
    verificationPhone = phone;
    document.getElementById('phone-display').textContent = phone;
    showView('verify-container');
    
    // Générer et envoyer un code SMS (simulé)
    smsVerificationCode = Math.floor(100000 + Math.random() * 900000);
    console.log(`Code SMS envoyé à ${phone}: ${smsVerificationCode}`); // À remplacer par un vrai service SMS
}

function showProfile() {
    const userData = userProfiles[verificationPhone];
    
    document.getElementById('user-nom').textContent = userData.nom;
    document.getElementById('user-prenom').textContent = userData.prenom;
    document.getElementById('user-api').textContent = userData.api;
    document.getElementById('api-type').textContent = userData.apiType;
    
    showView('profile-container');
}

// Gestion de l'authentification
function handleAuth() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showOutput('auth-container', 'Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (usersDatabase[username] && usersDatabase[username].password === password) {
        currentUser = username;
        showVerification(usersDatabase[username].phone);
    } else {
        showOutput('auth-container', 'Identifiants incorrects', 'error');
    }
}

function registerUser() {
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('new-password').value;
    
    if (!phone || !password) {
        showOutput('register-container', 'Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (password.length < 6) {
        showOutput('register-container', 'Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    // Enregistrement simulé (en production: appel API)
    const newUsername = `user${Object.keys(usersDatabase).length + 1}`;
    usersDatabase[newUsername] = { password, phone };
    
    // Création d'un profil simulé
    if (!userProfiles[phone]) {
        userProfiles[phone] = { 
            nom: "Nouveau", 
            prenom: "Utilisateur", 
            api: `API${Math.floor(100 + Math.random() * 900)}`, 
            apiType: Math.random() > 0.5 ? "REST" : "SOAP" 
        };
    }
    
    currentUser = newUsername;
    showVerification(phone);
}

function verifySmsCode() {
    const enteredCode = document.getElementById('sms-code').value;
    
    if (!enteredCode) {
        showOutput('verify-container', 'Veuillez entrer le code', 'error');
        return;
    }
    
    if (enteredCode == smsVerificationCode) {
        showProfile();
    } else {
        showOutput('verify-container', 'Code incorrect', 'error');
    }
}

function logout() {
    currentUser = null;
    smsVerificationCode = null;
    verificationPhone = null;
    showLogin();
}

// Helper functions
function showOutput(containerId, message, type) {
    const outputElement = document.getElementById(`${containerId}-output`) || 
                         document.querySelector(`#${containerId} .output`);
    
    if (outputElement) {
        outputElement.textContent = message;
        outputElement.className = `output ${type}`;
    } else {
        console.error("Element de sortie non trouvé");
    }
}
async function sendVerificationCode() {
    // 1. Récupère le numéro saisi
    const phone = document.getElementById('phone').value;
    
    // 2. Envoie une requête au backend
    const response = await fetch('http://localhost:3000/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }) // Envoie le numéro au format JSON
    });
    
    // 3. Reçoit la réponse du backend
    const data = await response.json();
    
    // 4. Stocke le code reçu
    smsVerificationCode = data.code;
    
    // 5. Affiche le résultat à l'utilisateur
    document.getElementById('output').innerHTML = `
        Code envoyé à ${data.phone}. <br>
        <strong>Mode Test :</strong> ${data.code}
    `;
    
    // 6. Affiche le champ de saisie du code
    document.getElementById('code-group').classList.remove('hidden');
}
// Initialisation
window.onload = showLogin;