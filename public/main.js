// Socket.io Connection
const socket = io();

// State Management
const state = {
    selectedType: null,
    selectedAI: 'chatgpt',
    prompt: '',
    isGenerating: false,
    generationProgress: 0,
    user: null
};

// Get DOM Elements
const app = document.getElementById('app');
const typeButtons = document.querySelectorAll('.type-button');
const promptInput = document.querySelector('.prompt-input');
const generateButton = document.querySelector('.generate-button');
const aiProviderSelect = document.querySelector('.ai-provider-select');
const overlay = document.querySelector('.overlay');
const closeButton = document.querySelector('.close-button');
const progressFill = document.querySelector('.progress-fill');
const statusMessage = document.querySelector('.status-message');

// Initialize App
function initApp() {
    renderApp();
    attachEventListeners();
    loadUserData();
}

// Render Main UI
function renderApp() {
    app.innerHTML = `
        <div class="header">
            <h1>🚀 App Builder Platform</h1>
            <div class="credits-badge">💰 Credits: <span id="credits">5</span></div>
        </div>
        
        <div class="container">
            <div class="hero">
                <h2>Que construirez-vous aujourd'hui ?</h2>
                
                <div class="type-selector">
                    <button class="type-button" data-type="web">💻 Application Web</button>
                    <button class="type-button" data-type="mobile">📱 Application Mobile</button>
                    <button class="type-button" data-type="website">🌐 Site Web</button>
                    <button class="type-button" data-type="other">🎨 Autre</button>
                </div>
                
                <div class="prompt-container">
                    <textarea class="prompt-input" placeholder="Construis-moi une application SaaS pour..."></textarea>
                    
                    <div class="input-controls">
                        <select class="ai-provider-select">
                            <option value="chatgpt">🤖 ChatGPT</option>
                            <option value="claude">🧠 Claude</option>
                            <option value="gemini">✨ Gemini</option>
                            <option value="other">🔮 Autre</option>
                        </select>
                        
                        <button class="generate-button">🚀 Générer</button>
                    </div>
                </div>
            </div>
            
            <div class="pricing-section">
                <h2>Nos Forfaits</h2>
                <div class="pricing-grid">
                    <div class="plan-card">
                        <h3>🆓 Gratuit</h3>
                        <div class="price">$0</div>
                        <ul class="features">
                            <li>✓ 5 Crédits</li>
                            <li>✓ Réinitialisation 24h</li>
                            <li>✓ Éditeur de base</li>
                            <li>✗ Pas de domaine personnalisé</li>
                            <li>✗ Pas d'édition avancée</li>
                        </ul>
                        <button class="plan-button">Plan Gratuit</button>
                    </div>
                    
                    <div class="plan-card">
                        <h3>⭐ Pro</h3>
                        <div class="price">$9.99/mo</div>
                        <ul class="features">
                            <li>✓ 50 Crédits</li>
                            <li>✓ Réinitialisation 24h</li>
                            <li>✓ Domaine personnalisé</li>
                            <li>✓ Publier sur l'App Store</li>
                            <li>✓ Éditeur avancé</li>
                        </ul>
                        <button class="plan-button">Passer à Pro</button>
                    </div>
                    
                    <div class="plan-card">
                        <h3>🏢 Business</h3>
                        <div class="price">$29.99/mo</div>
                        <ul class="features">
                            <li>✓ 500 Crédits</li>
                            <li>✓ Support prioritaire</li>
                            <li>✓ Domaines illimités</li>
                            <li>✓ Édition complète</li>
                            <li>✓ API accès</li>
                        </ul>
                        <button class="plan-button">Plan Business</button>
                    </div>
                </div>
                <p style="text-align: center; margin-top: 2rem; color: #666;">
                    💳 Acceptons: USDT | PayPal | Carte Bancaire
                </p>
            </div>
        </div>
        
        <!-- Generation Overlay -->
        <div class="overlay">
            <div class="overlay-content">
                <div class="overlay-header">
                    <h3>⚡ Génération en direct</h3>
                    <button class="close-button">&times;</button>
                </div>
                
                <div class="progress-container">
                    <div class="progress-label">
                        <span>Progression de la génération</span>
                        <span id="progress-percent">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>
                
                <div class="status-message info">
                    <strong>ℹ️ Info:</strong> Votre application est en cours de génération avec l'IA...
                </div>
                
                <div id="generation-logs" style="background: #f5f5f5; padding: 1rem; border-radius: 8px; max-height: 300px; overflow-y: auto; font-size: 0.9rem; color: #666; font-family: monospace;">
                    Initialisation...
                </div>
            </div>
        </div>
    `;
}

// Attach Event Listeners
function attachEventListeners() {
    // Type Selection
    document.querySelectorAll('.type-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.type-button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.selectedType = e.target.dataset.type;
        });
    });
    
    // Prompt Input
    document.querySelector('.prompt-input').addEventListener('input', (e) => {
        state.prompt = e.target.value;
    });
    
    // AI Provider Select
    document.querySelector('.ai-provider-select').addEventListener('change', (e) => {
        state.selectedAI = e.target.value;
    });
    
    // Generate Button
    document.querySelector('.generate-button').addEventListener('click', handleGenerate);
    
    // Close Overlay
    document.querySelector('.close-button').addEventListener('click', () => {
        document.querySelector('.overlay').classList.remove('active');
    });
}

// Handle Generation
async function handleGenerate() {
    if (!state.selectedType) {
        showMessage('Veuillez sélectionner un type d\'application', 'error');
        return;
    }
    
    if (!state.prompt.trim()) {
        showMessage('Veuillez entrer une description', 'error');
        return;
    }
    
    // Show Overlay
    document.querySelector('.overlay').classList.add('active');
    state.isGenerating = true;
    state.generationProgress = 0;
    
    // Simulate generation progress
    const progressInterval = setInterval(() => {
        state.generationProgress += Math.random() * 15;
        if (state.generationProgress > 95) state.generationProgress = 95;
        
        updateProgress();
        addLog(`Étape ${Math.floor(state.generationProgress / 10)}...`);
    }, 500);
    
    try {
        const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                prompt: state.prompt,
                type: state.selectedType,
                aiProvider: state.selectedAI
            })
        });
        
        const data = await response.json();
        
        clearInterval(progressInterval);
        state.generationProgress = 100;
        updateProgress();
        
        addLog('✅ Génération réussie!');
        showMessage('Application générée avec succès!', 'success');
        
        setTimeout(() => {
            document.querySelector('.overlay').classList.remove('active');
            state.isGenerating = false;
        }, 2000);
    } catch (error) {
        clearInterval(progressInterval);
        addLog(`❌ Erreur: ${error.message}`);
        showMessage('Erreur lors de la génération', 'error');
    }
}

// Update Progress Bar
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    
    if (progressFill) {
        progressFill.style.width = state.generationProgress + '%';
    }
    if (progressPercent) {
        progressPercent.textContent = Math.floor(state.generationProgress) + '%';
    }
}

// Add Log Message
function addLog(message) {
    const logsDiv = document.getElementById('generation-logs');
    if (logsDiv) {
        const timestamp = new Date().toLocaleTimeString();
        logsDiv.innerHTML += `<div>[${timestamp}] ${message}</div>`;
        logsDiv.scrollTop = logsDiv.scrollHeight;
    }
}

// Show Status Message
function showMessage(message, type = 'info') {
    const msgDiv = document.querySelector('.status-message');
    if (msgDiv) {
        msgDiv.className = `status-message show ${type}`;
        msgDiv.innerHTML = `<strong>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</strong> ${message}`;
    }
}

// Load User Data
function loadUserData() {
    // Simulated user data
    state.user = {
        credits: 5,
        plan: 'free'
    };
    
    const creditsSpan = document.getElementById('credits');
    if (creditsSpan) {
        creditsSpan.textContent = state.user.credits;
    }
}

// Socket.io Events
socket.on('generation-progress', (data) => {
    state.generationProgress = data.progress;
    updateProgress();
});

socket.on('generation-complete', (data) => {
    showMessage('Génération complétée!', 'success');
});

// Start App
initApp();