// نظام إدارة المحتوى لموقع 4GAMER
class GameManager {
    constructor() {
        this.games = [];
        this.loadGames();
        this.updateStats();
        this.displayRecentGames();
        this.displayAllGames();
        this.setupEventListeners();
    }

    // تحميل الألعاب من localStorage أو من ملف JSON
    async loadGames() {
        try {
            // محاولة تحميل من localStorage أولاً
            const savedGames = localStorage.getItem('4gamer_games');
            if (savedGames) {
                this.games = JSON.parse(savedGames);
            } else {
                // تحميل من ملف games.json
                const response = await fetch('games.json');
                if (response.ok) {
                    this.games = await response.json();
                    this.saveGames();
                }
            }
        } catch (error) {
            console.error('خطأ في تحميل الألعاب:', error);
            this.games = [];
        }
    }

    // حفظ الألعاب في localStorage
    saveGames() {
        localStorage.setItem('4gamer_games', JSON.stringify(this.games));
        this.updateStats();
        this.displayRecentGames();
        this.displayAllGames();
    }

    // إضافة لعبة جديدة
    addGame(gameData) {
        const newGame = {
            id: this.generateId(),
            name: gameData.name,
            description: gameData.description,
            platform: gameData.platform,
            thumbnail: gameData.thumbnail || 'assets/default_thumb.jpg',
            downloadLinks: gameData.downloadLinks || [],
            dateAdded: new Date().toISOString(),
            link: this.generateGameLink(gameData.name, gameData.platform)
        };

        this.games.push(newGame);
        this.saveGames();
        this.createGamePage(newGame);
        return newGame;
    }

    // تحديث لعبة موجودة
    updateGame(gameId, gameData) {
        const gameIndex = this.games.findIndex(game => game.id === gameId);
        if (gameIndex !== -1) {
            this.games[gameIndex] = { ...this.games[gameIndex], ...gameData };
            this.saveGames();
            this.createGamePage(this.games[gameIndex]);
            return this.games[gameIndex];
        }
        return null;
    }

    // حذف لعبة
    deleteGame(gameId) {
        const gameIndex = this.games.findIndex(game => game.id === gameId);
        if (gameIndex !== -1) {
            const deletedGame = this.games.splice(gameIndex, 1)[0];
            this.saveGames();
            return deletedGame;
        }
        return null;
    }

    // البحث في الألعاب
    searchGames(query, platform = '') {
        return this.games.filter(game => {
            const matchesQuery = game.name.toLowerCase().includes(query.toLowerCase()) ||
                               game.description.toLowerCase().includes(query.toLowerCase());
            const matchesPlatform = platform === '' || game.platform === platform;
            return matchesQuery && matchesPlatform;
        });
    }

    // توليد معرف فريد
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // توليد رابط صفحة اللعبة
    generateGameLink(name, platform) {
        const slug = name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        return `game-pages/${platform}/${slug}/index.html`;
    }

    // إنشاء صفحة اللعبة
    async createGamePage(game) {
        const gamePageHTML = this.generateGamePageHTML(game);
        // في بيئة حقيقية، ستحتاج إلى API لإنشاء الملف
        console.log(`إنشاء صفحة للعبة: ${game.name}`);
        console.log(`المسار: ${game.link}`);
    }

    // توليد HTML لصفحة اللعبة
    generateGamePageHTML(game) {
        const downloadLinksHTML = game.downloadLinks.map((link, index) => 
            `<a href="${link}" class="download-btn">الجزء ${index + 1}</a>`
        ).join('\n                        ');

        return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${game.name} - 4GAMER</title>
    <link rel="stylesheet" href="../../style.css">
</head>
<body>
    <div class="container game-page-container">
        <header class="main-header">
            <a href="../../index.html" class="back-button">العودة إلى الفهرس</a>
            <h1>${game.name}</h1>
        </header>

        <main class="game-details">
            <div class="game-cover">
                <img src="../../${game.thumbnail}" alt="${game.name} Cover">
            </div>
            <div class="game-info">
                <p class="platform">${this.getPlatformName(game.platform)}</p>
                <p class="description">${game.description}</p>
                
                <div class="download-section">
                    <h2>روابط التحميل</h2>
                    <div class="download-links">
                        ${downloadLinksHTML}
                    </div>
                </div>
            </div>
        </main>

        <footer class="footer">
            <div class="footer-content">
                <p>&copy; 2025 <a href="https://t.me/C9_9M" target="_blank">4GAMER</a>. جميع الحقوق محفوظة.</p>
                <div class="social-links">
                    <a href="https://t.me/C9_9M" target="_blank">القناة الرئيسية</a>
                    <a href="https://t.me/GAMESPS4I" target="_blank">قناة الألعاب</a>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>`;
    }

    // الحصول على اسم المنصة
    getPlatformName(platform) {
        const platforms = {
            'ps4': 'PlayStation 4',
            'ps3': 'PlayStation 3',
            'pc': 'PC'
        };
        return platforms[platform] || platform;
    }

    // تحديث الإحصائيات
    updateStats() {
        const stats = {
            total: this.games.length,
            ps4: this.games.filter(game => game.platform === 'ps4').length,
            ps3: this.games.filter(game => game.platform === 'ps3').length,
            pc: this.games.filter(game => game.platform === 'pc').length
        };

        document.getElementById('totalGames').textContent = stats.total;
        document.getElementById('ps4Games').textContent = stats.ps4;
        document.getElementById('ps3Games').textContent = stats.ps3;
        document.getElementById('pcGames').textContent = stats.pc;
    }

    // عرض الألعاب المضافة حديثاً
    displayRecentGames() {
        const recentGames = this.games
            .sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0))
            .slice(0, 6);

        const container = document.getElementById('recentGames');
        container.innerHTML = recentGames.map(game => this.createGameCard(game)).join('');
    }

    // عرض جميع الألعاب
    displayAllGames() {
        const container = document.getElementById('gamesList');
        container.innerHTML = this.games.map(game => this.createGameCard(game, true)).join('');
    }

    // إنشاء بطاقة لعبة
    createGameCard(game, showActions = false) {
        const actionsHTML = showActions ? `
            <div class="game-actions">
                <button class="btn" onclick="editGame('${game.id}')">تعديل</button>
                <button class="btn btn-danger" onclick="deleteGameConfirm('${game.id}')">حذف</button>
            </div>
        ` : '';

        return `
            <div class="game-card">
                <h3>${game.name}</h3>
                <p><strong>المنصة:</strong> ${this.getPlatformName(game.platform)}</p>
                <p>${game.description.substring(0, 100)}...</p>
                <p><strong>روابط التحميل:</strong> ${game.downloadLinks ? game.downloadLinks.length : 0}</p>
                ${actionsHTML}
            </div>
        `;
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // البحث في الألعاب
        document.getElementById('searchGames').addEventListener('input', (e) => {
            this.filterGames();
        });

        document.getElementById('filterPlatform').addEventListener('change', (e) => {
            this.filterGames();
        });

        // نموذج إضافة لعبة
        document.getElementById('addGameForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddGame();
        });
    }

    // تصفية الألعاب
    filterGames() {
        const query = document.getElementById('searchGames').value;
        const platform = document.getElementById('filterPlatform').value;
        const filteredGames = this.searchGames(query, platform);
        
        const container = document.getElementById('gamesList');
        container.innerHTML = filteredGames.map(game => this.createGameCard(game, true)).join('');
    }

    // معالجة إضافة لعبة
    handleAddGame() {
        const formData = {
            name: document.getElementById('gameName').value,
            description: document.getElementById('gameDescription').value,
            platform: document.getElementById('gamePlatform').value,
            thumbnail: document.getElementById('gameThumbnail').value,
            downloadLinks: this.getDownloadLinks()
        };

        const newGame = this.addGame(formData);
        if (newGame) {
            alert('تم إضافة اللعبة بنجاح!');
            document.getElementById('addGameForm').reset();
            this.clearDownloadLinks();
            showTab('games');
        }
    }

    // الحصول على روابط التحميل
    getDownloadLinks() {
        const inputs = document.querySelectorAll('.download-link-input');
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(link => link !== '');
    }

    // مسح روابط التحميل
    clearDownloadLinks() {
        const container = document.getElementById('downloadLinksContainer');
        container.innerHTML = `
            <div class="link-input-group">
                <input type="text" placeholder="رابط التحميل" class="download-link-input">
                <button type="button" onclick="removeDownloadLink(this)">حذف</button>
            </div>
        `;
    }

    // تصدير البيانات
    exportData() {
        const dataStr = JSON.stringify(this.games, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '4gamer_games_backup.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    // استيراد البيانات
    async importData() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('يرجى اختيار ملف للاستيراد');
            return;
        }

        try {
            const text = await file.text();
            const importedGames = JSON.parse(text);
            
            if (Array.isArray(importedGames)) {
                this.games = importedGames;
                this.saveGames();
                alert('تم استيراد البيانات بنجاح!');
                fileInput.value = '';
            } else {
                alert('تنسيق الملف غير صحيح');
            }
        } catch (error) {
            alert('خطأ في قراءة الملف: ' + error.message);
        }
    }

    // إعادة تعيين البيانات
    resetData() {
        if (confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            this.games = [];
            this.saveGames();
            alert('تم حذف جميع البيانات');
        }
    }

    // إنشاء نسخة احتياطية
    createBackup() {
        const backup = {
            games: this.games,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `4gamer_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// متغيرات عامة
let gameManager;

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    gameManager = new GameManager();
});

// وظائف مساعدة للواجهة
function showTab(tabName) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إظهار التبويب المحدد
    document.getElementById(tabName).classList.add('active');
    
    // تفعيل الزر المحدد
    event.target.classList.add('active');
}

function addDownloadLink() {
    const container = document.getElementById('downloadLinksContainer');
    const linkGroup = document.createElement('div');
    linkGroup.className = 'link-input-group';
    linkGroup.innerHTML = `
        <input type="text" placeholder="رابط التحميل" class="download-link-input">
        <button type="button" onclick="removeDownloadLink(this)">حذف</button>
    `;
    container.appendChild(linkGroup);
}

function removeDownloadLink(button) {
    const container = document.getElementById('downloadLinksContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    }
}

function editGame(gameId) {
    const game = gameManager.games.find(g => g.id === gameId);
    if (game) {
        // ملء النموذج ببيانات اللعبة
        document.getElementById('gameName').value = game.name;
        document.getElementById('gameDescription').value = game.description;
        document.getElementById('gamePlatform').value = game.platform;
        document.getElementById('gameThumbnail').value = game.thumbnail;
        
        // ملء روابط التحميل
        const container = document.getElementById('downloadLinksContainer');
        container.innerHTML = '';
        
        if (game.downloadLinks && game.downloadLinks.length > 0) {
            game.downloadLinks.forEach(link => {
                const linkGroup = document.createElement('div');
                linkGroup.className = 'link-input-group';
                linkGroup.innerHTML = `
                    <input type="text" placeholder="رابط التحميل" class="download-link-input" value="${link}">
                    <button type="button" onclick="removeDownloadLink(this)">حذف</button>
                `;
                container.appendChild(linkGroup);
            });
        } else {
            addDownloadLink();
        }
        
        // تغيير النموذج لوضع التعديل
        const form = document.getElementById('addGameForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            updateGame(gameId);
        };
        
        // تغيير نص الزر
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'تحديث اللعبة';
        
        showTab('add-game');
    }
}

function updateGame(gameId) {
    const formData = {
        name: document.getElementById('gameName').value,
        description: document.getElementById('gameDescription').value,
        platform: document.getElementById('gamePlatform').value,
        thumbnail: document.getElementById('gameThumbnail').value,
        downloadLinks: gameManager.getDownloadLinks()
    };

    const updatedGame = gameManager.updateGame(gameId, formData);
    if (updatedGame) {
        alert('تم تحديث اللعبة بنجاح!');
        resetForm();
        showTab('games');
    }
}

function deleteGameConfirm(gameId) {
    const game = gameManager.games.find(g => g.id === gameId);
    if (game && confirm(`هل أنت متأكد من حذف لعبة "${game.name}"؟`)) {
        gameManager.deleteGame(gameId);
        alert('تم حذف اللعبة بنجاح!');
    }
}

function resetForm() {
    const form = document.getElementById('addGameForm');
    form.reset();
    form.onsubmit = (e) => {
        e.preventDefault();
        gameManager.handleAddGame();
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'إضافة اللعبة';
    
    gameManager.clearDownloadLinks();
}

function exportData() {
    gameManager.exportData();
}

function importData() {
    gameManager.importData();
}

function resetData() {
    gameManager.resetData();
}

function createBackup() {
    gameManager.createBackup();
}
