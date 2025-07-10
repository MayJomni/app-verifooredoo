// Base de données pour les utilisateurs
let users = JSON.parse(localStorage.getItem('users')) || [];

// Base de données simulée pour les numéros
const fakeDatabase = {
    "22123456": { nom: "Ben Ali", prenom: "Tarek", api: "API123" },
    "22987654": { nom: "Trabelsi", prenom: "Amira", api: "API456" },
    "20334455": { nom: "Sassi", prenom: "Hehdi", api: "API789" }
};

// Utilisateur actuellement connecté
let currentUser = null;

// Afficher l'interface de connexion
function showLogin() {
    document.getElementById('login-container').classList.add('visible');
    document.getElementById('login-container').classList.remove('hidden');
    
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('register-container').classList.remove('visible');
    
    document.getElementById('verification-container').classList.add('hidden');
    document.getElementById('verification-container').classList.remove('visible');
}

// Afficher l'interface d'inscription
function showRegister() {
    document.getElementById('register-container').classList.add('visible');
    document.getElementById('register-container').classList.remove('hidden');
    
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('visible');
    
    document.getElementById('verification-container').classList.add('hidden');
    document.getElementById('verification-container').classList.remove('visible');
}

// Afficher l'interface de vérification
function showVerification() {
    document.getElementById('verification-container').classList.add('visible');
    document.getElementById('verification-container').classList.remove('hidden');
    
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('login-container').classList.remove('visible');
    
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('register-container').classList.remove('visible');
}

// Fonction de connexion
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Validation simple
    if (!username || !password) {
        alert("Veuillez remplir tous les champs");
        return;
    }
    
    // Vérification des identifiants
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        showVerification();
    } else {
        alert("Nom d'utilisateur ou mot de passe incorrect");
    }
}

// Fonction d'inscription
function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    // Validation
    if (!username || !password || !confirm) {
        alert("Veuillez remplir tous les champs");
        return;
    }
    
    if (password !== confirm) {
        alert("Les mots de passe ne correspondent pas");
        return;
    }
    
    if (users.some(u => u.username === username)) {
        alert("Ce nom d'utilisateur est déjà pris");
        return;
    }
    
    // Ajout du nouvel utilisateur
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert("Compte créé avec succès !");
    showLogin();
}

// Fonction de déconnexion
function logout() {
    currentUser = null;
    document.getElementById('phone').value = '';
    document.getElementById('output').innerHTML = '';
    document.getElementById('output').className = '';
    showLogin();
}

// Fonction de vérification de numéro
function verifyNumber() {
    const phone = document.getElementById('phone').value.trim();
    const output = document.getElementById('output');
    
    if (!phone) {
        output.innerHTML = "Veuillez entrer un numéro";
        output.className = "error";
        return;
    }
    
    if (fakeDatabase[phone]) {
        const user = fakeDatabase[phone];
        output.innerHTML = `
            <strong>Numéro trouvé !</strong><br>
            Nom : ${user.nom} <br>
            Prénom : ${user.prenom} <br>
            API : ${user.api}
        `;
        output.className = "success";
    } else {
        output.innerHTML = "Ce numéro n'existe pas.";
        output.className = "error";
    }
}

// Au chargement de la page, afficher l'interface de connexion
window.onload = showLogin;
