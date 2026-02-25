// ==========================================
// INTERACTIVE BODY DIAGRAM - ENHANCED VERSION
// ==========================================

console.log("✅ Interactive Gym Guide Loaded!");

let selectedMuscleGroup = null;
let hoveredMuscle = null;

// ==========================================
// SVG MUSCLE GROUP MAPPINGS
// ==========================================

const muscleGroups = {
    // Front muscles
    'upper_pecs': { name: 'Pecho', filter: 'Pecho', color: '#ff4757' },
    'middle_pecs': { name: 'Pecho', filter: 'Pecho', color: '#ff4757' },
    'lower_pecs': { name: 'Pecho', filter: 'Pecho', color: '#ff4757' },
    
    'front_delts': { name: 'Hombro', filter: 'Hombro', color: '#ffa502' },
    'side_delts': { name: 'Hombro', filter: 'Hombro', color: '#ffa502' },
    
    'biceps': { name: 'Biceps', filter: 'Biceps', color: '#1e90ff' },
    'forearms': { name: 'Antebrazo', filter: 'Biceps', color: '#5f9ea0' },
    
    'upper_abs': { name: 'Abdomen', filter: 'Abdomen', color: '#ff6348' },
    'lower_abs': { name: 'Abdomen', filter: 'Abdomen', color: '#ff6348' },
    'obliques': { name: 'Oblicuos', filter: 'Abdomen', color: '#ff7675' },
    
    'quads': { name: 'Cuadriceps', filter: 'Pierna', color: '#00d2d3' },
    'calves': { name: 'Pantorrilla', filter: 'Pierna', color: '#01a3a4' },
    'hip_adductor': { name: 'Aductores', filter: 'Pierna', color: '#00b894' },
    
    // Rear muscles
    'rear_delts': { name: 'Hombro Posterior', filter: 'Hombro', color: '#ffa502' },
    'upper_traps': { name: 'Trapecio Superior', filter: 'Espalda', color: '#2ed573' },
    'lower_traps': { name: 'Trapecio Inferior', filter: 'Espalda', color: '#2ed573' },
    'lats': { name: 'Dorsales', filter: 'Espalda', color: '#26de81' },
    'lower_back': { name: 'Lumbar', filter: 'Espalda', color: '#20bf6b' },
    'rhomboids': { name: 'Romboides', filter: 'Espalda', color: '#2ed573' },
    
    'triceps': { name: 'Triceps', filter: 'Triceps', color: '#4b7bec' },
    
    'glutes': { name: 'Gluteos', filter: 'Gluteo', color: '#fd79a8' },
    'hamstrings': { name: 'Femoral', filter: 'Pierna', color: '#00d2d3' },
    'hip_abductor': { name: 'Abductores', filter: 'Pierna', color: '#00b894' }
};

// ==========================================
// INITIALIZE INTERACTIVE SVG
// ==========================================

function initializeBodyDiagram() {
    console.log("🎯 Initializing interactive body diagram...");
    
    Object.keys(muscleGroups).forEach(muscleId => {
        const musclePath = document.getElementById(muscleId);
        
        if (musclePath) {
            musclePath.style.cursor = 'pointer';
            musclePath.style.transition = 'all 0.3s ease';
            
            musclePath.addEventListener('mouseenter', () => handleMuscleHover(muscleId));
            musclePath.addEventListener('mouseleave', () => handleMuscleLeave(muscleId));
            musclePath.addEventListener('click', () => handleMuscleClick(muscleId));
            
            console.log('✅ Activated: ' + muscleId);
        }
    });
}

// ==========================================
// HOVER EFFECTS
// ==========================================

function handleMuscleHover(muscleId) {
    const musclePath = document.getElementById(muscleId);
    const muscleData = muscleGroups[muscleId];
    
    if (!musclePath || !muscleData) return;
    
    hoveredMuscle = muscleId;
    
    musclePath.style.filter = 'brightness(1.5) drop-shadow(0 0 10px ' + muscleData.color + ')';
    musclePath.style.transform = 'scale(1.05)';
    
    showTooltip(muscleData.name);
}

function handleMuscleLeave(muscleId) {
    const musclePath = document.getElementById(muscleId);
    
    if (!musclePath) return;
    
    hoveredMuscle = null;
    
    if (selectedMuscleGroup !== muscleId) {
        musclePath.style.filter = 'none';
        musclePath.style.transform = 'scale(1)';
    }
    
    hideTooltip();
}

// ==========================================
// CLICK HANDLING
// ==========================================

function handleMuscleClick(muscleId) {
    const muscleData = muscleGroups[muscleId];
    
    if (!muscleData) return;
    
    console.log('🖱️ Clicked: ' + muscleData.name + ' (' + muscleData.filter + ')');
    
    clearMuscleSelection();
    
    selectedMuscleGroup = muscleId;
    
    const musclePath = document.getElementById(muscleId);
    if (musclePath) {
        musclePath.style.filter = 'brightness(1.8) drop-shadow(0 0 15px ' + muscleData.color + ')';
        musclePath.style.transform = 'scale(1.1)';
    }
    
    filterMachines(muscleData.filter);
    updateFilterButtons(muscleData.filter);
    
    document.getElementById('results-container').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// ==========================================
// CLEAR SELECTION
// ==========================================

function clearMuscleSelection() {
    if (selectedMuscleGroup) {
        const prevPath = document.getElementById(selectedMuscleGroup);
        if (prevPath) {
            prevPath.style.filter = 'none';
            prevPath.style.transform = 'scale(1)';
        }
    }
    selectedMuscleGroup = null;
}

// ==========================================
// TOOLTIP SYSTEM
// ==========================================

function showTooltip(text) {
    let tooltip = document.getElementById('muscle-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'muscle-tooltip';
        tooltip.style.cssText = 'position: fixed; background: rgba(0, 0, 0, 0.9); color: white; padding: 8px 15px; border-radius: 8px; font-size: 0.9rem; pointer-events: none; z-index: 10000; border: 2px solid #d32f2f; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    
    document.addEventListener('mousemove', updateTooltipPosition);
}

function updateTooltipPosition(e) {
    const tooltip = document.getElementById('muscle-tooltip');
    if (tooltip) {
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    }
}

function hideTooltip() {
    const tooltip = document.getElementById('muscle-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
    document.removeEventListener('mousemove', updateTooltipPosition);
}

// ==========================================
// UPDATE FILTER BUTTONS
// ==========================================

function updateFilterButtons(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });
}

// ==========================================
// MACHINE DATABASE
// ==========================================










const machines = [
    // === PECHO (13) ===
    { code: "PE-01", name: "Banco Pecho Plano Precor", tag: "Pecho", video: "https://youtu.be/oOkFfBNfk8k?si=b0ynkaRBG_bTsbYS" },
    { code: "PE-02", name: "Banco Pecho Plano", tag: "Pecho", video: "https://youtu.be/oOkFfBNfk8k?si=b0ynkaRBG_bTsbYS" },
    { code: "PE-03", name: "Banco Pecho Inclinado Precor", tag: "Pecho", video: "https://youtu.be/_3v--PAJmsY?si=YZ5Kxo4QBY3H6Zwy" },
    { code: "PE-04", name: "Banco Pecho Declinado Cesar", tag: "Pecho", video: "https://youtu.be/W9IVuWxs89c?si=jQgnLQIb9HvSJxyP" },
    { code: "PE-05", name: "Peck Deck Precor", tag: "Pecho", video: "https://youtu.be/sAeDCAnbTpI?si=wj_We_C3b1zMtoH4" },
    { code: "PE-06", name: "Peck Deck Life Fitness", tag: "Pecho", video: "https://youtu.be/sAeDCAnbTpI?si=wj_We_C3b1zMtoH4" },
    { code: "PE-07", name: "Maquina PI Press Sentado Cybex", tag: "Pecho", video: "https://youtu.be/-ROZ50yvKBQ?si=1vsgCZOEBTg6tZt3" },
    { code: "PE-08", name: "Maquina PI Press Sentado BodyMasters", tag: "Pecho", video: "https://youtu.be/iiwq-9B8AS0?si=NUt2rt009Vx88-kY" },
    { code: "PE-09", name: "Maquina PI Press Inclinado BodyMasters", tag: "Pecho", video: "https://youtu.be/gNoqGMWmIcs?si=3DKxIYj31SraXjvE" },

    { code: "PE-10", name: "Maquina Pecho Sentado", tag: "Pecho", video: "https://youtube.com" },

    { code: "PE-11", name: "Maquina PI Pecho y Hombro Life Fitness", tag: "Pecho", video: "https://youtube.com" },

    { code: "PE-12", name: "Maquina PI Aperturas de Pecho Stairmaster", tag: "Pecho", video: "https://youtube.com" },

    { code: "PE-13", name: "Maquina PI Iso Press Sentado Articulado Magnum", tag: "Pecho", video: "https://youtu.be/UyzJmjudXCs?si=Ipunjbpb6V5xSIlq" },
    
    // === HOMBRO (7) ===
    { code: "HO-01", name: "Banco Hombros Precor", tag: "Hombro", video: "https://youtu.be/YRgrpcL7_WM?si=BtgkCo93GC9g2_h2" },
    { code: "HO-02", name: "Banco Hombros Precor", tag: "Hombro", video: "https://youtu.be/YRgrpcL7_WM?si=BtgkCo93GC9g2_h2" },
    { code: "HO-03", name: "Maquina PI Hombros Lateral Parado Nautilus", tag: "Hombro", video: "https://youtu.be/KQp8mvGTfyM?si=SRFgiHIF2h1BUt1z" },
    { code: "HO-04", name: "Maquina PI Hombros Lateral Sentado Cybex", tag: "Hombro", video: "https://youtu.be/HLkYnow0ODA?si=WRQE8qhucvBip9L8" },
    { code: "HO-05", name: "Maquina PI Hombros Press Sentado Cybex", tag: "Hombro", video: "https://youtu.be/Zs1K_Xx1-8g?si=1deudYqYQfPbRC3c" },
    { code: "HO-06", name: "Banco Encogimiento Hammer", tag: "Hombro", video: "https://youtu.be/D34s3hfkNc4?si=SKW6PG3wgFDY_kvL" },
    
    // === FONDOS & RACK ===
    { code: "FO-01", name: "Maquina PI Fondos Parado Asistido BodyMasters", tag: "Pecho", video: "https://youtube.com" },
    { code: "RD-01", name: "Rack de Discos Precor", tag: "Pecho", video: "https://youtube.com" },

// === PIERNA (20) ===
    { code: "PI-01", name: "Maquina PI Extension de Pierna Precor", tag: "Pierna", video: "https://youtu.be/jNRy4_mcT5w?si=33V-ATrL22WWetQX" },
    { code: "PI-02", name: "Maquina PI Extension de Pierna Precor", tag: "Pierna", video: "https://youtu.be/jNRy4_mcT5w?si=33V-ATrL22WWetQX" },
    { code: "PI-03", name: "Maquina PI Curl Femoral Acostado Precor", tag: "Pierna", video: "https://youtu.be/g0_8V7NLUjY?si=re2zk7Cgr0r7Su55" },
    { code: "PI-04", name: "Maquina PI Curl Femoral Hincado Precor", tag: "Pierna", video: "https://youtu.be/0mshfADwFBM?si=69O3sjRmSDrj0uJ7" },
    { code: "PI-05", name: "Maquina PI Curl Femoral Sentado StarTrack", tag: "Pierna", video: "https://youtu.be/Pjn3YukxRaU?si=IgxTEP52gC0bKk21" },
    { code: "PI-06", name: "Prensa Lineal Hammer", tag: "Pierna", video: "https://youtu.be/qC9NSKjfseQ?si=n4Y7e8gtMtrtYMBa" },
    { code: "PI-07", name: "Sentadilla Hack Precor", tag: "Pierna", video: "https://youtu.be/DLBLSKxXBR4?si=aYjcKIumOWoxLUey" },
    { code: "PI-08", name: "Prensa Articulada Precor", tag: "Pierna", video: "https://youtu.be/ZNOmN25hiss?si=UfKFlEXL0-mL2UvT" },
    { code: "PI-09", name: "Maquina Smith Precor", tag: "Pierna", video: "https://youtu.be/cwpoPRJjp4c?si=4RY61T_V6E0SCKEy" },

    { code: "PI-10", name: "Maquina Smith Cybex", tag: "Pierna", video: "https://youtube.com" },

    { code: "PI-11", name: "Sentadilla Perfecta Precor", tag: "Pierna", video: "https://youtu.be/9fd6FK7JwP0?si=lTQoUtSd6dNSu_pn" },
    { code: "PI-12", name: "Sentadilla Libre Precor", tag: "Pierna", video: "https://youtu.be/jiglyh4smwI?si=6H46M7EQ_2wh6GrY" },
    { code: "PI-13", name: "Rack Sentadilla Precor", tag: "Pierna", video: "https://youtu.be/O_hrTLBBI14?si=QI70J7ecWVyZUUwV" },
    { code: "PI-14", name: "Prensa Vertical Precor", tag: "Pierna", video: "https://youtu.be/QAJ28Mz8L-I?si=8_Mr02zzN3lY31S-" },
    { code: "PI-15", name: "Prensa Parado Precor", tag: "Pierna", video: "https://youtu.be/QXcNMwZimxI?si=Ap2BRrfd9AB_Al8c" },
    { code: "PI-16", name: "Maquina Peso Muerto Cesar", tag: "Pierna", video: "https://youtu.be/xdzl1A_hVhA?si=87RX5kzmTWLpN8ab" },
    { code: "PI-17", name: "Sentadilla Astronauta Cesar", tag: "Pierna", video: "https://youtu.be/EMv6RxH77b4?si=88tt-Ko9RAYBK6XM" },
    { code: "PI-18", name: "Sentadilla Pendulo Rogers", tag: "Pierna", video: "https://youtu.be/fjWvLywRCtc?si=ll4tfxSSdNklQvcW" },
    { code: "PI-19", name: "Sentadilla Perfecta Armadillo", tag: "Pierna", video: "https://youtu.be/lLxj2QL9nVc?si=jqSn7z67U-g8suDe" },
    { code: "PI-20", name: "Power Runner Armadillo", tag: "Pierna", video: "https://youtu.be/555AOKHa2kE?si=H66Fi8rshl2G1hyb" },
    
    // === RACK DE DISCOS (2) ===
    { code: "RD-01", name: "Rack de Discos Precor", tag: "Pierna", video: "https://youtube.com" },
    { code: "RD-02", name: "Rack de Discos Precor", tag: "Pierna", video: "https://youtube.com" },

// === ESPALDA (12) ===
    { code: "ES-01", name: "Remo Barra T EHD", tag: "Espalda", video: "https://youtu.be/65Bc-LzDJ_0?si=iC7wety5KufzDWzQ" },
    { code: "ES-02", name: "Remo Barra T Al Pecho Precor", tag: "Espalda", video: "https://youtu.be/WpPV6oUAVQM?si=fGixug1b-8b1CDpE" },
    { code: "ES-03", name: "Maquina Remo Sentado Hammer (Arriba)", tag: "Espalda", video: "https://youtu.be/MY1mqNEahFs?si=4s__jMq6WdDcESvD" },
    { code: "ES-04", name: "Maquina Pullover Cesar", tag: "Espalda", video: "https://youtu.be/EDe9Yh2AlKg?si=4gEjJ1hiV6hWzZTb" },
    { code: "ES-05", name: "Maquina PI Iso Jalon Sentado FreeMotion", tag: "Espalda", video: "https://youtu.be/9NPIckiQ1Gg?si=CSfSR7WdE7y3dIfv" },
    { code: "ES-06", name: "Maquina PI Remo Sentado Life Fitness", tag: "Espalda", video: "https://youtu.be/mosWG9OghPI?si=9NctOcX221ASFG4t" },
    { code: "ES-07", name: "Maquina PI Remo Sentado Paramount", tag: "Espalda", video: "https://youtu.be/mosWG9OghPI?si=9NctOcX221ASFG4t" },
    { code: "ES-08", name: "Maquina PI Jalon Espalda Sentado Paramount", tag: "Espalda", video: "https://youtu.be/BNcN-S8uQJ8?si=7IXBiwp4lNymQfFK" },
    { code: "ES-09", name: "Maquina PI Jalon Espalda Sentado Precor", tag: "Espalda", video: "https://youtu.be/zfVVMh3oIow?si=2xw4GaY9TsEolAPP" },
    { code: "ES-10", name: "Maquina PI Remo Sentado Precor", tag: "Espalda", video: "https://youtu.be/i0z31VkwX6c?si=DCWxN_OKtS0zpqag" },

    { code: "ES-11", name: "Maquina Remo Sentado Hammer (Abajo)", tag: "Espalda", video: "https://youtube.com" },

    { code: "ES-12", name: "Maquina PI Iso Jalon Articulado Magnum", tag: "Espalda", video: "https://youtu.be/SCUU99rg5hc?si=2nx2h1tuqqCqFdCm" },
    
    // === FONDOS ADICIONAL ===
    { code: "FO-02", name: "Maquina PI Fondos Hincado Asistido Life Fitness", tag: "Espalda", video: "https://youtube.com" },
    
    // === BRAZO - BICEPS (5) ===
    { code: "BI-01", name: "Banco Predicador Precor", tag: "Biceps", video: "https://youtu.be/ToZ6tdTdgNo?si=PgiWAh9Hkcs2TIoP" },
    { code: "BI-02", name: "Maquina Predicador Hammer", tag: "Biceps", video: "https://youtu.be/k9AyH-o-_v8?si=g7PA8kkHjnMl85K5" },
    { code: "BI-03", name: "Maquina Asistida Biceps Iso Cesar", tag: "Biceps", video: "https://youtu.be/rmpynz5Df-g?si=k4y4y4hWQWoPrrol" },
    { code: "BI-04", name: "Banco Curl Spider Precor", tag: "Biceps", video: "https://youtu.be/3zoQ98nPJTc?si=zZi6X-s5dyxj2mqw" },
    { code: "BI-05", name: "Maquina Antebrazo Precor", tag: "Biceps", video: "https://youtu.be/wls0HjM7HkA?si=ZcrydRfvnPoB4RYJ" },
    
    // === BRAZO - TRICEPS (3) ===
    { code: "TRI-01", name: "Maquina PI Triceps Frances Sentado BodyMasters", tag: "Triceps", video: "https://youtube.com" },
    { code: "FO-03", name: "Maquina PI Fondos Cybex", tag: "Triceps", video: "https://youtube.com" },
    { code: "FO-04", name: "Maquina PI Fondos Sentado Life Fitness", tag: "Triceps", video: "https://youtube.com" },

// === GLUTEO (9) ===
    { code: "GL-01", name: "Maquina PI MultiHip EHD", tag: "Gluteo", video: "https://youtube.com" },
    { code: "GL-02", name: "Maquina PI Abduccion/Aduccion Precor", tag: "Gluteo", video: "https://youtube.com" },
    { code: "GL-03", name: "Maquina PI Patada Parado Precor", tag: "Gluteo", video: "https://youtube.com" },
    { code: "GL-04", name: "Maquina Hip Trust Acostado Precor", tag: "Gluteo", video: "https://youtube.com" },
    { code: "GL-05", name: "Banco Hip Trust", tag: "Gluteo", video: "https://youtube.com" },
    { code: "GL-06", name: "Maquina Sentadilla Cinturon", tag: "Gluteo", video: "https://youtube.com" },
    { code: "GL-07", name: "Maquina Hip Trust Sentado Precor", tag: "Gluteo", video: "https://youtube.com" },
    { code: "GL-08", name: "Maquina PI Patada Life Fitness", tag: "Gluteo", video: "https://youtube.com" },
    { code: "GL-09", name: "Maquina Patada Brasilena", tag: "Gluteo", video: "https://youtube.com" },
    
    // === PANTORRILLA (4) ===
    { code: "PA-01", name: "Banco Pantorrilla Sentado Precor", tag: "Pierna", video: "https://youtu.be/Db7RzwL3Qwg?si=0XUs3jkv3eCGBDGK" },
    { code: "PA-02", name: "Banco Pantorrilla Sentado Cesar", tag: "Pierna", video: "https://youtu.be/maIL-cJxklU?si=1hQbG0MHOp70Vu2C" },
    { code: "PA-03", name: "Maquina PI Pantorrilla Burro BodyMasters", tag: "Pierna", video: "https://youtu.be/ePBPIiyygco?si=OPRdUxJXCrdlTAxD" },
    { code: "PA-04", name: "Banco Tibiales Sentado Cesar", tag: "Pierna", video: "https://youtu.be/EuFsrJAkin4?si=sq_YPlxIhySCjurQ" },
    
    // === ABDOMEN (11) ===
    { code: "AB-01", name: "Banco Inclinado Hyper Extension Precor", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-02", name: "Banco Inclinado Hyper Extension Life Fitness", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-03", name: "Banco Horizontal Hyper Extension EHD", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-04", name: "Banco Horizontal Hyper Extension EHD", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-05", name: "Banco Elevacion de Piernas y Fondos Cesar", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-06", name: "Banco Abdomen Life Fitness", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-07", name: "Banco Abdomen Life Fitness", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-08", name: "Banco Inclinado Abdomen Cesar", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-09", name: "Maquina Abdomen Life Fitness", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-10", name: "Maquina PI Abdomen Cesar", tag: "Abdomen", video: "https://youtube.com" },
    { code: "AB-11", name: "Maquina PI Hyper Extension BodyMasters", tag: "Abdomen", video: "https://youtube.com" },

// === CARDIO (C) ===
{ code: "C-01", name: "Arc Trainer Cybex", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-02", name: "Arc Trainer Cybex", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-03", name: "Arc Trainer Cybex", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-04", name: "Eliptica Life Fitness Morada", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-05", name: "Eliptica Life Fitness Morada", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-06", name: "Eliptica Life Fitness Morada", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-07", name: "Eliptica Life Fitness Gris", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-08", name: "Eliptica Life Fitness Gris", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-09", name: "Eliptica Life Fitness Gris", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-10", name: "Eliptica Life Matrix Gris", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-11", name: "Eliptica Life Matrix Gris", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-12", name: "Eliptica Life Matrix Gris", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-13", name: "Eliptica Life Matrix Morada", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-14", name: "Eliptica Life Matrix Morada", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-15", name: "Eliptica Life Matrix Morada", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-16", name: "Caminadora Matrix Gris", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-17", name: "Caminadora Matrix Gris", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-18", name: "Caminadora Matrix Morada", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-19", name: "Caminadora Matrix Morada", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-20", name: "Caminadora Matrix Morada", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-21", name: "Eliptica Octane", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-22", name: "Eliptica Octane", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-23", name: "Eliptica Octane", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-24", name: "Eliptica Precor", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-25", name: "Eliptica Precor", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-26", name: "Bicicleta Life Fitness", tag: "Cardio", video: "https://youtube.com" },

{ code: "C-27", name: "Bicicleta Spinning Matrix", tag: "Cardio", video: "https://youtube.com" },
{ code: "C-28", name: "Bicicleta Spinning Matrix", tag: "Cardio", video: "https://youtube.com" },

// === Peso Libre (PL) ===
{ code: "RB-01", name: "Rack 10 Barras", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "RB-02", name: "Rack 10 Barras", tag: "Peso libre", video: "https://youtube.com" },

{ code: "RM-01", name: "Rack 30 Mancuernas", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "RM-02", name: "Rack 30 Mancuernas", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "RM-03", name: "Rack 30 Mancuernas", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "RM-04", name: "Rack 30 Mancuernas", tag: "Peso Libre", video: "https://youtube.com" },

{ code: "BP-01", name: "Banco Para Pisar", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BP-02", name: "Banco Para Pisar", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BP-03", name: "Banco Para Pisar", tag: "Peso Libre", video: "https://youtube.com" },

{ code: "BA-01", name: "Banco Multiusos", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BA-02", name: "Banco Multiusos", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BA-03", name: "Banco Multiusos", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BA-04", name: "Banco Multiusos", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BA-05", name: "Banco Multiusos", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BA-06", name: "Banco Multiusos", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BA-07", name: "Banco Multiusos", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "BA-08", name: "Banco Multiusos", tag: "Peso Libre", video: "https://youtube.com" },

{ code: "PO-01", name: "Polea Doble Life Fitness", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "PO-02", name: "Polea Doble Life Fitness", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "PO-03", name: "Polea Doble Paramount", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "PO-04", name: "Polea Doble Freemotion", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "PO-05", name: "Polea Doble Precor", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "PO-06", name: "Polea Sencilla Precor", tag: "Peso Libre", video: "https://youtube.com" },

{ code: "RA-01", name: "Rack Accesorios Life Fitness", tag: "Peso Libre", video: "https://youtube.com" },
{ code: "RA-02", name: "Rack Accesorios Precor", tag: "Peso Libre", video: "https://youtube.com" },

{ code: "RS-01", name: "Rack Bolsas Socios", tag: "Peso Libre", video: "https://youtube.com" },
];

let activeFilter = 'Todas';
let searchTerm = '';

// ==========================================
// DISPLAY MACHINES
// ==========================================

function displayMachines(list) {
    const container = document.getElementById('results-container');
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; grid-column: 1/-1;">No se encontraron maquinas.</p>';
        return;
    }

    list.forEach(m => {
        const card = document.createElement('div');
        card.className = 'machine-card';
        card.innerHTML = '<span class="machine-tag">' + m.tag + '</span><h4>' + m.name + '</h4><small>Codigo: ' + m.code + '</small>' + (m.video && m.video !== "https://youtube.com" ? '<br><a href="' + m.video + '" target="_blank" class="btn-video">▶️ VER VIDEO</a>' : '');
        card.style.animation = 'fadeInUp 0.5s ease forwards';
        container.appendChild(card);
    });
}

// ==========================================
// FILTER MACHINES
// ==========================================

function filterMachines(category) {
    activeFilter = category;
    applyFilters();
}

function applyFilters() {
    let filtered = machines;

    if (activeFilter !== 'Todas') {
        filtered = filtered.filter(m => m.tag === activeFilter);
    }

    if (searchTerm) {
        filtered = filtered.filter(m =>
            m.name.toLowerCase().includes(searchTerm) ||
            m.code.toLowerCase().includes(searchTerm)
        );
    }

    displayMachines(filtered);
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('machineSearch');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            searchTerm = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }
    
    initializeBodyDiagram();
    displayMachines(machines);
});