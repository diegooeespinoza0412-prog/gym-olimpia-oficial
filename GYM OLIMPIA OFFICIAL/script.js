// GUARANTEED WORKING SCRIPT

console.log("✅ Script loaded!");

// ==========================================
// SPLASH SCREEN & APP ENTRY
// ==========================================

window.addEventListener('load', () => {
    console.log("✅ Page loaded!");
    
    const role = localStorage.getItem('olimpiaRole');
    console.log("📋 Stored role:", role);
    
    if (role) {
        // User already selected - skip splash
        console.log("⏭️ Skipping splash, loading app...");
        skipToApp();
    } else {
        // New user - show role selection after 2 seconds
        console.log("🆕 New user detected");
        setTimeout(() => {
            const roleOptions = document.querySelector('.role-options');
            if (roleOptions) {
                roleOptions.style.display = 'flex';
                console.log("✅ Role buttons shown");
            }
        }, 2000);
    }
});

function enterApp(role) {
    console.log("🚀 enterApp called with role:", role);
    
    // Save role
    localStorage.setItem("olimpiaRole", role);
    
    // Hide splash with animation
    const intro = document.getElementById('intro');
    if (intro) {
        intro.classList.add('hidden');
        console.log("✅ Splash hidden");
    }
    
    // Show main content after animation
    setTimeout(() => {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.add('active');
            console.log("✅ Main content shown");
        }
    }, 600);
}

function skipToApp() {
    const intro = document.getElementById('intro');
    const mainContent = document.getElementById('mainContent');
    
    if (intro) intro.classList.add('hidden');
    if (mainContent) mainContent.classList.add('active');
}

// ==========================================
// RUTINA FUNCTIONS
// ==========================================

function mostrarRutina() {
    const role = localStorage.getItem("olimpiaRole");
    console.log("📸 Showing rutina for:", role);
    
    if (role === "Hombre") {
        document.getElementById("rutina-hombre").style.display = "block";
        document.getElementById("rutina-mujer").style.display = "none";
    } else if (role === "Mujer") {
        document.getElementById("rutina-mujer").style.display = "block";
        document.getElementById("rutina-hombre").style.display = "none";
    }
}

function cerrarRutina() {
    document.getElementById("rutina-hombre").style.display = "none";
    document.getElementById("rutina-mujer").style.display = "none";
}

// ==========================================
// CLABE COPY
// ==========================================

function copyClabe() {
    const clabeText = document.getElementById("clabe-text").innerText;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(clabeText)
            .then(() => alert("¡CLABE copiada!"))
            .catch(() => fallbackCopy(clabeText));
    } else {
        fallbackCopy(clabeText);
    }
}

function fallbackCopy(text) {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    alert("¡CLABE copiada!");
}

// ==========================================
// MODAL FUNCTIONS
// ==========================================

function openInfo() {
    document.getElementById('infoModal').style.display = 'block';
}

function closeInfo() {
    document.getElementById('infoModal').style.display = 'none';
}

// ==========================================
// INSTALL HELP
// ==========================================

function showInstallHelp() {
    document.getElementById("installHelp").style.display = "flex";
}

function closeInstallHelp() {
    document.getElementById("installHelp").style.display = "none";
}

// Hamburger menu toggle
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}
