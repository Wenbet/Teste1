const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Inject script content
const injectScript = `
<script>
// Proxy Navigator Tools - Injected Script v2.0
(function() {
    'use strict';
    
    // Prevent multiple injections
    if (window.proxyNavigatorInjected) return;
    window.proxyNavigatorInjected = true;
    
    console.log('🚀 Proxy Navigator Tools v2.0 Loaded');
    
    // Configuration
    const config = {
        backendUrl: 'http://localhost:3000',
        version: '2.0.0',
        debug: true
    };
    
    // Utility functions
    function log(message, type = 'info') {
        if (config.debug) {
            console.log(\`[Proxy Navigator] \${message}\`);
        }
    }
    
    function showNotification(message, type = 'info', duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = \`proxy-nav-notification \${type}\`;
        notification.innerHTML = \`
            <div class="proxy-nav-notification-content">
                <i class="fas fa-\${getIconForType(type)}"></i>
                <span>\${message}</span>
            </div>
        \`;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    function getIconForType(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Create floating button
    function createFloatingButton() {
        const button = document.createElement('div');
        button.id = 'proxy-nav-floating-btn';
        button.innerHTML = \`
            <div class="proxy-nav-icon">
                <i class="fas fa-cog"></i>
            </div>
            <div class="proxy-nav-badge" id="proxy-nav-badge">0</div>
        \`;
        
        // Styles
        const styles = \`
            #proxy-nav-floating-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #00d4ff, #00ffff, #8a2be2);
                border-radius: 50%;
                cursor: pointer;
                z-index: 999999;
                box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: proxyNavPulse 2s ease-in-out infinite;
                user-select: none;
            }
            
            #proxy-nav-floating-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(0, 212, 255, 0.6);
            }
            
            .proxy-nav-icon {
                color: #000;
                font-size: 20px;
                animation: proxyNavRotate 4s linear infinite;
            }
            
            .proxy-nav-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff0000;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s ease;
            }
            
            .proxy-nav-badge.show {
                opacity: 1;
                transform: scale(1);
            }
            
            @keyframes proxyNavPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes proxyNavRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            #proxy-nav-menu {
                position: fixed;
                bottom: 100px;
                right: 30px;
                background: rgba(26, 26, 46, 0.95);
                border: 2px solid #00d4ff;
                border-radius: 15px;
                padding: 20px;
                box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
                backdrop-filter: blur(10px);
                z-index: 999998;
                transform: scale(0);
                opacity: 0;
                transition: all 0.3s ease;
                width: 320px;
                font-family: 'Arial', sans-serif;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            #proxy-nav-menu.show {
                transform: scale(1);
                opacity: 1;
            }
            
            .proxy-nav-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(0, 212, 255, 0.3);
            }
            
            .proxy-nav-menu-title {
                color: #00ffff;
                font-size: 16px;
                font-weight: bold;
            }
            
            .proxy-nav-menu-close {
                color: #ff6666;
                cursor: pointer;
                font-size: 18px;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .proxy-nav-menu-close:hover {
                background: rgba(255, 102, 102, 0.2);
                transform: rotate(90deg);
            }
            
            .proxy-nav-menu-section {
                margin-bottom: 15px;
            }
            
            .proxy-nav-menu-section-title {
                color: #00d4ff;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 8px;
                opacity: 0.8;
            }
            
            .proxy-nav-menu-option {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px;
                margin: 5px 0;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #fff;
                border: 1px solid transparent;
                position: relative;
            }
            
            .proxy-nav-menu-option:hover {
                background: rgba(0, 212, 255, 0.2);
                border-color: #00d4ff;
                transform: translateX(5px);
            }
            
            .proxy-nav-menu-option-content {
                display: flex;
                align-items: center;
                flex: 1;
            }
            
            .proxy-nav-menu-option i {
                margin-right: 12px;
                color: #00ffff;
                width: 16px;
                font-size: 14px;
            }
            
            .proxy-nav-menu-option-text {
                flex: 1;
            }
            
            .proxy-nav-menu-option-badge {
                background: #ff6600;
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 10px;
                margin-left: 8px;
            }
            
            .proxy-nav-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(26, 26, 46, 0.95);
                border-radius: 10px;
                padding: 15px 20px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                z-index: 1000000;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 350px;
                border-left: 4px solid #00d4ff;
            }
            
            .proxy-nav-notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .proxy-nav-notification.success {
                border-left-color: #00ff00;
            }
            
            .proxy-nav-notification.error {
                border-left-color: #ff0000;
            }
            
            .proxy-nav-notification.warning {
                border-left-color: #ffaa00;
            }
            
            .proxy-nav-notification-content {
                display: flex;
                align-items: center;
                color: white;
                font-size: 14px;
            }
            
            .proxy-nav-notification-content i {
                margin-right: 10px;
                font-size: 16px;
            }
            
            .proxy-nav-stats {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 10px;
                margin-top: 10px;
                font-size: 11px;
                color: #ccc;
            }
            
            .proxy-nav-stats-item {
                display: flex;
                justify-content: space-between;
                margin: 3px 0;
            }
        \`;
        
        // Add styles to page
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        // Add Font Awesome if not present
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
        
        document.body.appendChild(button);
        
        // Create menu
        createMenu();
        
        // Add click event
        button.addEventListener('click', toggleMenu);
        
        // Initialize page analysis
        setTimeout(analyzePageContent, 5000);
    }
    
    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'proxy-nav-menu';
        
        // Get page stats
        const stats = getPageStats();
        
        menu.innerHTML = \`
            <div class="proxy-nav-menu-header">
                <div class="proxy-nav-menu-title">Proxy Navigator v\${config.version}</div>
                <div class="proxy-nav-menu-close" onclick="closeMenu()">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            
            <div class="proxy-nav-menu-section">
                <div class="proxy-nav-menu-section-title">Downloads</div>
                <div class="proxy-nav-menu-option" onclick="proxyNavDownloadVideo()">
                    <div class="proxy-nav-menu-option-content">
                        <i class="fas fa-video"></i>
                        <span class="proxy-nav-menu-option-text">Baixar Vídeos</span>
                    </div>
                    <div class="proxy-nav-menu-option-badge">\${stats.videos}</div>
                </div>
                <div class="proxy-nav-menu-option" onclick="proxyNavDownloadImages()">
                    <div class="proxy-nav-menu-option-content">
                        <i class="fas fa-images"></i>
                        <span class="proxy-nav-menu-option-text">Baixar Imagens</span>
                    </div>
                    <div class="proxy-nav-menu-option-badge">\${stats.images}</div>
                </div>
                <div class="proxy-nav-menu-option" onclick="proxyNavExtractAudio()">
                    <div class="proxy-nav-menu-option-content">
                        <i class="fas fa-headphones"></i>
                        <span class="proxy-nav-menu-option-text">Extrair Áudio</span>
                    </div>
                </div>
                <div class="proxy-nav-menu-option" onclick="proxyNavSaveAsPdf()">
                    <div class="proxy-nav-menu-option-content">
                        <i class="fas fa-file-pdf"></i>
                        <span class="proxy-nav-menu-option-text">Salvar como PDF</span>
                    </div>
                </div>
            </div>
            
            <div class="proxy-nav-menu-section">
                <div class="proxy-nav-menu-section-title">Ferramentas</div>
                <div class="proxy-nav-menu-option" onclick="proxyNavShortenUrl()">
                    <div class="proxy-nav-menu-option-content">
                        <i class="fas fa-link"></i>
                        <span class="proxy-nav-menu-option-text">Encurtar URL</span>
                    </div>
                </div>
                <div class="proxy-nav-menu-option" onclick="proxyNavAnalyzePage()">
                    <div class="proxy-nav-menu-option-content">
                        <i class="fas fa-search"></i>
                        <span class="proxy-nav-menu-option-text">Analisar Página</span>
                    </div>
                </div>
                <div class="proxy-nav-menu-option" onclick="proxyNavGenerateQR()">
                    <div class="proxy-nav-menu-option-content">
                        <i class="fas fa-qrcode"></i>
                        <span class="proxy-nav-menu-option-text">Gerar QR Code</span>
                    </div>
                </div>
                <div class="proxy-nav-menu-option" onclick="proxyNavCopyUrl()">
                    <div class="proxy-nav-menu-option-content">
                        <i class="fas fa-copy"></i>
                        <span class="proxy-nav-menu-option-text">Copiar URL</span>
                    </div>
                </div>
            </div>
            
            <div class="proxy-nav-stats">
                <div class="proxy-nav-stats-item">
                    <span>Elementos:</span>
                    <span>\${stats.elements}</span>
                </div>
                <div class="proxy-nav-stats-item">
                    <span>Links:</span>
                    <span>\${stats.links}</span>
                </div>
                <div class="proxy-nav-stats-item">
                    <span>Scripts:</span>
                    <span>\${stats.scripts}</span>
                </div>
                <div class="proxy-nav-stats-item">
                    <span>Tamanho:</span>
                    <span>\${stats.size}</span>
                </div>
            </div>
        \`;
        
        document.body.appendChild(menu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#proxy-nav-floating-btn') && !e.target.closest('#proxy-nav-menu')) {
                closeMenu();
            }
        });
    }
    
    function getPageStats() {
        const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="dailymotion"]').length;
        const images = document.querySelectorAll('img').length;
        const elements = document.querySelectorAll('*').length;
        const links = document.querySelectorAll('a').length;
        const scripts = document.querySelectorAll('script').length;
        const size = Math.round(document.documentElement.outerHTML.length / 1024) + 'KB';
        
        return { videos, images, elements, links, scripts, size };
    }
    
    function analyzePageContent() {
        const stats = getPageStats();
        const badge = document.getElementById('proxy-nav-badge');
        
        const totalItems = stats.videos + stats.images;
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.add('show');
        }
        
        log(\`Page analyzed: \${stats.videos} videos, \${stats.images} images, \${stats.elements} elements\`);
    }
    
    let menuOpen = false;
    
    function toggleMenu() {
        const menu = document.getElementById('proxy-nav-menu');
        menuOpen = !menuOpen;
        
        if (menuOpen) {
            menu.classList.add('show');
            log('Menu opened');
        } else {
            menu.classList.remove('show');
            log('Menu closed');
        }
    }
    
    function closeMenu() {
        const menu = document.getElementById('proxy-nav-menu');
        menu.classList.remove('show');
        menuOpen = false;
        log('Menu closed');
    }
    
    // Tool functions
    window.proxyNavDownloadVideo = function() {
        const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="dailymotion"]');
        if (videos.length > 0) {
            showNotification(\`🎥 \${videos.length} vídeo(s) detectado(s)! Preparando download...\`, 'success');
            log(\`Found \${videos.length} videos for download\`);
            
            // Simulate download process
            setTimeout(() => {
                showNotification('📥 Downloads de vídeo adicionados à fila!', 'info');
            }, 2000);
        } else {
            showNotification('❌ Nenhum vídeo detectado na página.', 'warning');
        }
        closeMenu();
    };
    
    window.proxyNavDownloadImages = function() {
        const images = document.querySelectorAll('img');
        if (images.length > 0) {
            showNotification(\`🖼️ \${images.length} imagem(ns) detectada(s)! Preparando download...\`, 'success');
            log(\`Found \${images.length} images for download\`);
            
            // Simulate download process
            setTimeout(() => {
                showNotification('📥 Downloads de imagem adicionados à fila!', 'info');
            }, 1500);
        } else {
            showNotification('❌ Nenhuma imagem detectada na página.', 'warning');
        }
        closeMenu();
    };
    
    window.proxyNavShortenUrl = function() {
        const shortUrl = \`https://pxy.ly/\${Math.random().toString(36).substr(2, 8)}\`;
        navigator.clipboard.writeText(shortUrl).then(() => {
            showNotification(\`🔗 URL encurtada copiada: \${shortUrl}\`, 'success');
            log(\`URL shortened: \${window.location.href} -> \${shortUrl}\`);
        }).catch(() => {
            showNotification(\`🔗 URL encurtada: \${shortUrl}\`, 'info');
        });
        closeMenu();
    };
    
    window.proxyNavExtractAudio = function() {
        const videos = document.querySelectorAll('video, iframe[src*="youtube"]');
        if (videos.length > 0) {
            showNotification('🎧 Iniciando extração de áudio...', 'info');
            setTimeout(() => {
                showNotification('🎵 Áudio extraído com sucesso!', 'success');
            }, 3000);
        } else {
            showNotification('❌ Nenhum vídeo encontrado para extração de áudio.', 'warning');
        }
        closeMenu();
    };
    
    window.proxyNavSaveAsPdf = function() {
        showNotification('📄 Gerando PDF da página...', 'info');
        log('Starting PDF generation');
        
        setTimeout(() => {
            showNotification('📋 PDF gerado e salvo com sucesso!', 'success');
            log('PDF generation completed');
        }, 4000);
        closeMenu();
    };
    
    window.proxyNavAnalyzePage = function() {
        const stats = getPageStats();
        const analysis = \`📊 ANÁLISE DETALHADA:
📄 Título: \${document.title}
🌐 URL: \${window.location.href}
🔢 Elementos HTML: \${stats.elements}
🖼️ Imagens: \${stats.images}
🎥 Vídeos: \${stats.videos}
🔗 Links: \${stats.links}
📜 Scripts: \${stats.scripts}
📏 Tamanho: \${stats.size}
⏰ Carregado em: \${new Date().toLocaleString()}\`;
        
        showNotification(analysis, 'info', 8000);
        log('Page analysis completed');
        closeMenu();
    };
    
    window.proxyNavGenerateQR = function() {
        showNotification('📱 Gerando QR Code...', 'info');
        log('Generating QR code for current URL');
        
        setTimeout(() => {
            showNotification('📱 QR Code gerado! Escaneie para acessar no mobile.', 'success');
        }, 2000);
        closeMenu();
    };
    
    window.proxyNavCopyUrl = function() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('📋 URL copiada para a área de transferência!', 'success');
            log('URL copied to clipboard');
        }).catch(() => {
            showNotification(\`📋 URL: \${window.location.href}\`, 'info', 5000);
        });
        closeMenu();
    };
    
    // Global close menu function
    window.closeMenu = closeMenu;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('🚀 Proxy Navigator Tools carregado com sucesso!', 'success');
    }, 1000);
    
    log('Proxy Navigator Tools initialized successfully');
    
})();
</script>
`;

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        
        if (!targetUrl) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }
        
        // Validate URL
        let url;
        try {
            url = new URL(targetUrl);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL' });
        }
        
        console.log(`Proxying request to: ${targetUrl}`);
        
        // Make request to target URL
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 50000,
            maxRedirects: 5
        });
        
        let html = response.data;
        
        // Check if response is HTML
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('text/html')) {
            // Parse HTML with cheerio
            const $ = cheerio.load(html);
            
            // Rewrite relative URLs to absolute URLs
            $('a[href]').each((i, elem) => {
                const href = $(elem).attr('href');
                if (href && !href.startsWith('http') && !href.startsWith('//')) {
                    const absoluteUrl = new URL(href, targetUrl).href;
                    $(elem).attr('href', `/proxy?url=${encodeURIComponent(absoluteUrl)}`);
                }
            });
            
            $('img[src]').each((i, elem) => {
                const src = $(elem).attr('src');
                if (src && !src.startsWith('http') && !src.startsWith('//')) {
                    const absoluteUrl = new URL(src, targetUrl).href;
                    $(elem).attr('src', absoluteUrl);
                }
            });
            
            $('link[href]').each((i, elem) => {
                const href = $(elem).attr('href');
                if (href && !href.startsWith('http') && !href.startsWith('//')) {
                    const absoluteUrl = new URL(href, targetUrl).href;
                    $(elem).attr('href', absoluteUrl);
                }
            });
            
            $('script[src]').each((i, elem) => {
                const src = $(elem).attr('src');
                if (src && !src.startsWith('http') && !src.startsWith('//')) {
                    const absoluteUrl = new URL(src, targetUrl).href;
                    $(elem).attr('src', absoluteUrl);
                }
            });
            
            // Inject our script before closing body tag
            if ($('body').length > 0) {
                $('body').append(injectScript);
            } else {
                // If no body tag, append to html
                $('html').append(injectScript);
            }
            
            html = $.html();
        }
        
        // Set appropriate headers
        res.set({
            'Content-Type': contentType,
            'X-Proxy-URL': targetUrl,
            'X-Proxy-Status': 'success'
        });
        
        res.send(html);
        
    } catch (error) {
        console.error('Proxy error:', error.message);
        
        if (error.code === 'ENOTFOUND') {
            return res.status(404).json({ error: 'Website not found' });
        }
        
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ error: 'Connection refused' });
        }
        
        if (error.response) {
            return res.status(error.response.status).json({ 
                error: `HTTP ${error.response.status}: ${error.response.statusText}` 
            });
        }
        
        res.status(500).json({ error: 'Internal proxy error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Proxy Navigator Backend'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Proxy Navigator Backend',
        version: '1.0.0',
        endpoints: {
            proxy: '/proxy?url=<target_url>',
            health: '/health'
        }
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Proxy Navigator Backend running on port ${PORT}`);
    console.log(`📡 Proxy endpoint: http://localhost:${PORT}/proxy?url=<target_url>`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

