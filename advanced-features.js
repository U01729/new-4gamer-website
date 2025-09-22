// الميزات المتقدمة لموقع 4GAMER
class AdvancedFeatures {
    constructor() {
        this.favorites = this.loadFavorites();
        this.ratings = this.loadRatings();
        this.viewHistory = this.loadViewHistory();
        this.userPreferences = this.loadUserPreferences();
        
        this.init();
    }

    // تهيئة الميزات المتقدمة
    init() {
        this.setupFavoriteSystem();
        this.setupRatingSystem();
        this.setupViewHistory();
        this.setupUserPreferences();
        this.setupNotifications();
        this.setupShareFeatures();
        this.setupOfflineMode();
    }

    // نظام المفضلة
    setupFavoriteSystem() {
        // إضافة أزرار المفضلة لكل لعبة
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn') || e.target.closest('.favorite-btn')) {
                const gameId = e.target.closest('.game-card').dataset.gameId;
                this.toggleFavorite(gameId);
            }
        });

        // تحديث عرض المفضلة
        this.updateFavoriteDisplay();
    }

    // تبديل حالة المفضلة
    toggleFavorite(gameId) {
        const index = this.favorites.indexOf(gameId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('تم إزالة اللعبة من المفضلة', 'info');
        } else {
            this.favorites.push(gameId);
            this.showNotification('تم إضافة اللعبة إلى المفضلة', 'success');
        }
        
        this.saveFavorites();
        this.updateFavoriteDisplay();
    }

    // تحديث عرض المفضلة
    updateFavoriteDisplay() {
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const gameId = card.dataset.gameId;
            let favoriteBtn = card.querySelector('.favorite-btn');
            
            if (!favoriteBtn) {
                favoriteBtn = this.createFavoriteButton();
                card.querySelector('.game-info').appendChild(favoriteBtn);
            }
            
            if (this.favorites.includes(gameId)) {
                favoriteBtn.classList.add('active');
                favoriteBtn.innerHTML = '❤️ مفضلة';
            } else {
                favoriteBtn.classList.remove('active');
                favoriteBtn.innerHTML = '🤍 إضافة للمفضلة';
            }
        });
    }

    // إنشاء زر المفضلة
    createFavoriteButton() {
        const button = document.createElement('button');
        button.className = 'favorite-btn';
        button.innerHTML = '🤍 إضافة للمفضلة';
        return button;
    }

    // نظام التقييمات
    setupRatingSystem() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('rating-star')) {
                const gameId = e.target.closest('.game-card').dataset.gameId;
                const rating = parseInt(e.target.dataset.rating);
                this.setRating(gameId, rating);
            }
        });

        this.updateRatingDisplay();
    }

    // تعيين التقييم
    setRating(gameId, rating) {
        this.ratings[gameId] = rating;
        this.saveRatings();
        this.updateRatingDisplay();
        this.showNotification(`تم تقييم اللعبة بـ ${rating} نجوم`, 'success');
    }

    // تحديث عرض التقييمات
    updateRatingDisplay() {
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const gameId = card.dataset.gameId;
            let ratingContainer = card.querySelector('.rating-container');
            
            if (!ratingContainer) {
                ratingContainer = this.createRatingContainer();
                card.querySelector('.game-info').appendChild(ratingContainer);
            }
            
            const userRating = this.ratings[gameId] || 0;
            this.updateStars(ratingContainer, userRating);
        });
    }

    // إنشاء حاوية التقييم
    createRatingContainer() {
        const container = document.createElement('div');
        container.className = 'rating-container';
        container.innerHTML = `
            <div class="rating-stars">
                ${[1, 2, 3, 4, 5].map(i => 
                    `<span class="rating-star" data-rating="${i}">⭐</span>`
                ).join('')}
            </div>
        `;
        return container;
    }

    // تحديث النجوم
    updateStars(container, rating) {
        const stars = container.querySelectorAll('.rating-star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
                star.textContent = '⭐';
            } else {
                star.classList.remove('active');
                star.textContent = '☆';
            }
        });
    }

    // نظام سجل المشاهدة
    setupViewHistory() {
        // تسجيل مشاهدة اللعبة عند النقر عليها
        document.addEventListener('click', (e) => {
            const gameCard = e.target.closest('.game-card');
            if (gameCard && gameCard.href) {
                const gameId = gameCard.dataset.gameId;
                this.addToViewHistory(gameId);
            }
        });
    }

    // إضافة إلى سجل المشاهدة
    addToViewHistory(gameId) {
        const timestamp = new Date().toISOString();
        
        // إزالة المدخل السابق إن وجد
        this.viewHistory = this.viewHistory.filter(item => item.gameId !== gameId);
        
        // إضافة المدخل الجديد في المقدمة
        this.viewHistory.unshift({ gameId, timestamp });
        
        // الاحتفاظ بآخر 50 مشاهدة فقط
        this.viewHistory = this.viewHistory.slice(0, 50);
        
        this.saveViewHistory();
    }

    // الحصول على الألعاب المشاهدة مؤخراً
    getRecentlyViewed(limit = 6) {
        return this.viewHistory.slice(0, limit);
    }

    // نظام تفضيلات المستخدم
    setupUserPreferences() {
        this.createPreferencesPanel();
        this.applyUserPreferences();
    }

    // إنشاء لوحة التفضيلات
    createPreferencesPanel() {
        const panel = document.createElement('div');
        panel.id = 'preferencesPanel';
        panel.className = 'preferences-panel';
        panel.innerHTML = `
            <div class="preferences-content">
                <h3>إعدادات التفضيلات</h3>
                
                <div class="preference-group">
                    <label>المنصة المفضلة:</label>
                    <select id="preferredPlatform">
                        <option value="">لا يوجد تفضيل</option>
                        <option value="ps4">PlayStation 4</option>
                        <option value="ps3">PlayStation 3</option>
                        <option value="pc">PC</option>
                    </select>
                </div>
                
                <div class="preference-group">
                    <label>نوع الألعاب المفضل:</label>
                    <select id="preferredGenre">
                        <option value="">جميع الأنواع</option>
                        <option value="action">أكشن</option>
                        <option value="adventure">مغامرات</option>
                        <option value="rpg">RPG</option>
                        <option value="sports">رياضة</option>
                        <option value="racing">سباق</option>
                    </select>
                </div>
                
                <div class="preference-group">
                    <label>
                        <input type="checkbox" id="darkMode"> الوضع المظلم
                    </label>
                </div>
                
                <div class="preference-group">
                    <label>
                        <input type="checkbox" id="autoPlay"> تشغيل الفيديوهات تلقائياً
                    </label>
                </div>
                
                <div class="preference-actions">
                    <button onclick="advancedFeatures.savePreferences()" class="btn btn-primary">حفظ</button>
                    <button onclick="advancedFeatures.closePreferences()" class="btn btn-secondary">إلغاء</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }

    // تطبيق تفضيلات المستخدم
    applyUserPreferences() {
        if (this.userPreferences.darkMode) {
            document.body.classList.add('dark-mode');
        }
        
        if (this.userPreferences.preferredPlatform) {
            // تطبيق فلتر المنصة المفضلة تلقائياً
            setTimeout(() => {
                if (window.gameManager) {
                    window.gameManager.filterByPlatform(this.userPreferences.preferredPlatform);
                }
            }, 1000);
        }
    }

    // حفظ التفضيلات
    savePreferences() {
        this.userPreferences = {
            preferredPlatform: document.getElementById('preferredPlatform').value,
            preferredGenre: document.getElementById('preferredGenre').value,
            darkMode: document.getElementById('darkMode').checked,
            autoPlay: document.getElementById('autoPlay').checked
        };
        
        localStorage.setItem('4gamer_preferences', JSON.stringify(this.userPreferences));
        this.applyUserPreferences();
        this.closePreferences();
        this.showNotification('تم حفظ التفضيلات بنجاح', 'success');
    }

    // إغلاق لوحة التفضيلات
    closePreferences() {
        const panel = document.getElementById('preferencesPanel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    // نظام الإشعارات
    setupNotifications() {
        this.createNotificationContainer();
    }

    // إنشاء حاوية الإشعارات
    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // إظهار إشعار
    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // إزالة الإشعار تلقائياً
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    // نظام المشاركة
    setupShareFeatures() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('share-btn')) {
                const gameCard = e.target.closest('.game-card');
                const gameId = gameCard.dataset.gameId;
                this.shareGame(gameId);
            }
        });
    }

    // مشاركة لعبة
    shareGame(gameId) {
        const game = this.getGameById(gameId);
        if (!game) return;
        
        const shareData = {
            title: `${game.name} - 4GAMER`,
            text: `اكتشف لعبة ${game.name} الرائعة على موقع 4GAMER`,
            url: window.location.origin + '/' + game.link
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // نسخ الرابط إلى الحافظة
            navigator.clipboard.writeText(shareData.url).then(() => {
                this.showNotification('تم نسخ رابط اللعبة إلى الحافظة', 'success');
            });
        }
    }

    // الوضع غير المتصل
    setupOfflineMode() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker مسجل بنجاح');
                })
                .catch(error => {
                    console.log('فشل في تسجيل Service Worker');
                });
        }
        
        // مراقبة حالة الاتصال
        window.addEventListener('online', () => {
            this.showNotification('تم استعادة الاتصال بالإنترنت', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('لا يوجد اتصال بالإنترنت - الوضع غير المتصل نشط', 'warning');
        });
    }

    // البحث الذكي مع الاقتراحات
    setupSmartSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        searchInput.parentElement.appendChild(suggestionsContainer);
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                this.showSearchSuggestions(query, suggestionsContainer);
            } else {
                suggestionsContainer.innerHTML = '';
            }
        });
    }

    // إظهار اقتراحات البحث
    showSearchSuggestions(query, container) {
        const games = window.gameManager ? window.gameManager.games : [];
        const suggestions = games
            .filter(game => 
                game.name.toLowerCase().includes(query) ||
                game.description.toLowerCase().includes(query)
            )
            .slice(0, 5);
        
        if (suggestions.length > 0) {
            container.innerHTML = suggestions
                .map(game => `
                    <div class="suggestion-item" onclick="advancedFeatures.selectSuggestion('${game.name}')">
                        <img src="${game.thumbnail}" alt="${game.name}">
                        <span>${game.name}</span>
                    </div>
                `).join('');
        } else {
            container.innerHTML = '<div class="no-suggestions">لا توجد اقتراحات</div>';
        }
    }

    // اختيار اقتراح
    selectSuggestion(gameName) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = gameName;
            searchInput.dispatchEvent(new Event('input'));
        }
        
        document.querySelector('.search-suggestions').innerHTML = '';
    }

    // الحصول على لعبة بالمعرف
    getGameById(gameId) {
        const games = window.gameManager ? window.gameManager.games : [];
        return games.find(game => game.id == gameId);
    }

    // تحميل البيانات من localStorage
    loadFavorites() {
        const saved = localStorage.getItem('4gamer_favorites');
        return saved ? JSON.parse(saved) : [];
    }

    loadRatings() {
        const saved = localStorage.getItem('4gamer_ratings');
        return saved ? JSON.parse(saved) : {};
    }

    loadViewHistory() {
        const saved = localStorage.getItem('4gamer_view_history');
        return saved ? JSON.parse(saved) : [];
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('4gamer_preferences');
        return saved ? JSON.parse(saved) : {
            preferredPlatform: '',
            preferredGenre: '',
            darkMode: false,
            autoPlay: false
        };
    }

    // حفظ البيانات في localStorage
    saveFavorites() {
        localStorage.setItem('4gamer_favorites', JSON.stringify(this.favorites));
    }

    saveRatings() {
        localStorage.setItem('4gamer_ratings', JSON.stringify(this.ratings));
    }

    saveViewHistory() {
        localStorage.setItem('4gamer_view_history', JSON.stringify(this.viewHistory));
    }

    // إحصائيات الاستخدام
    getUsageStats() {
        return {
            totalFavorites: this.favorites.length,
            totalRatings: Object.keys(this.ratings).length,
            totalViews: this.viewHistory.length,
            averageRating: this.calculateAverageRating(),
            mostViewedPlatform: this.getMostViewedPlatform()
        };
    }

    // حساب متوسط التقييم
    calculateAverageRating() {
        const ratings = Object.values(this.ratings);
        if (ratings.length === 0) return 0;
        
        const sum = ratings.reduce((a, b) => a + b, 0);
        return (sum / ratings.length).toFixed(1);
    }

    // الحصول على المنصة الأكثر مشاهدة
    getMostViewedPlatform() {
        const platformCounts = {};
        
        this.viewHistory.forEach(item => {
            const game = this.getGameById(item.gameId);
            if (game) {
                platformCounts[game.platform] = (platformCounts[game.platform] || 0) + 1;
            }
        });
        
        return Object.keys(platformCounts).reduce((a, b) => 
            platformCounts[a] > platformCounts[b] ? a : b, ''
        );
    }

    // تصدير البيانات
    exportUserData() {
        const userData = {
            favorites: this.favorites,
            ratings: this.ratings,
            viewHistory: this.viewHistory,
            preferences: this.userPreferences,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = '4gamer_user_data.json';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('تم تصدير بياناتك بنجاح', 'success');
    }

    // استيراد البيانات
    importUserData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const userData = JSON.parse(e.target.result);
                
                if (userData.favorites) this.favorites = userData.favorites;
                if (userData.ratings) this.ratings = userData.ratings;
                if (userData.viewHistory) this.viewHistory = userData.viewHistory;
                if (userData.preferences) this.userPreferences = userData.preferences;
                
                this.saveFavorites();
                this.saveRatings();
                this.saveViewHistory();
                localStorage.setItem('4gamer_preferences', JSON.stringify(this.userPreferences));
                
                this.updateFavoriteDisplay();
                this.updateRatingDisplay();
                this.applyUserPreferences();
                
                this.showNotification('تم استيراد البيانات بنجاح', 'success');
            } catch (error) {
                this.showNotification('خطأ في استيراد البيانات', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// تهيئة الميزات المتقدمة
let advancedFeatures;

document.addEventListener('DOMContentLoaded', () => {
    advancedFeatures = new AdvancedFeatures();
    
    // إضافة أزرار الميزات المتقدمة إلى الواجهة
    setTimeout(() => {
        addAdvancedFeatureButtons();
    }, 2000);
});

// إضافة أزرار الميزات المتقدمة
function addAdvancedFeatureButtons() {
    // زر التفضيلات في الهيدر
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const preferencesBtn = document.createElement('button');
        preferencesBtn.className = 'nav-link preferences-btn';
        preferencesBtn.innerHTML = '⚙️ التفضيلات';
        preferencesBtn.onclick = () => {
            document.getElementById('preferencesPanel').style.display = 'flex';
        };
        navMenu.appendChild(preferencesBtn);
    }
    
    // زر المفضلة في الفوتر
    const footerSection = document.querySelector('.footer-section');
    if (footerSection) {
        const favoritesLink = document.createElement('div');
        favoritesLink.innerHTML = `
            <h4 class="footer-subtitle">المفضلة</h4>
            <p>عدد الألعاب المفضلة: <span id="favoritesCount">${advancedFeatures.favorites.length}</span></p>
            <button onclick="showFavorites()" class="contact-link">عرض المفضلة</button>
        `;
        footerSection.appendChild(favoritesLink);
    }
}

// عرض المفضلة
function showFavorites() {
    if (window.gameManager) {
        const favoriteGames = window.gameManager.games.filter(game => 
            advancedFeatures.favorites.includes(game.id.toString())
        );
        
        if (favoriteGames.length > 0) {
            // تطبيق فلتر لإظهار المفضلة فقط
            window.gameManager.filteredGames = favoriteGames;
            window.gameManager.renderGames();
            window.gameManager.scrollToSection('games');
            advancedFeatures.showNotification(`عرض ${favoriteGames.length} من الألعاب المفضلة`, 'info');
        } else {
            advancedFeatures.showNotification('لا توجد ألعاب في المفضلة', 'info');
        }
    }
}

// تصدير للاستخدام العام
window.advancedFeatures = advancedFeatures;
