// متغيرات عامة
let allGames = [];
let filteredGames = [];
let currentPlatform = 'all';

// عناصر DOM
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    setupEventListeners();
});

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // البحث
    searchInput.addEventListener('input', handleSearch);
    
    // أزرار الفلترة
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
}

// تحميل الألعاب من ملف JSON
async function loadGames() {
    try {
        const response = await fetch('games.json');
        if (!response.ok) {
            throw new Error('فشل في تحميل بيانات الألعاب');
        }
        
        allGames = await response.json();
        filteredGames = [...allGames];
        displayGames();
        
    } catch (error) {
        console.error('خطأ في تحميل الألعاب:', error);
        showError('عذراً، حدث خطأ في تحميل الألعاب. يرجى المحاولة لاحقاً.');
    }
}

// عرض الألعاب
function displayGames() {
    if (filteredGames.length === 0) {
        showNoResults();
        return;
    }
    
    const gamesHTML = filteredGames.map(game => createGameCard(game)).join('');
    gamesGrid.innerHTML = gamesHTML;
}

// إنشاء بطاقة لعبة
function createGameCard(game) {
    const platformText = getPlatformText(game.platform);
    
    return `
        <a href="${game.link}" class="game-card" data-platform="${game.platform}">
            <img src="${game.thumbnail}" alt="${game.name}" class="game-thumbnail" 
                 onerror="this.src='assets/placeholder.jpg'">
            <div class="platform">${platformText}</div>
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <span class="download-btn">تحميل الآن</span>
        </a>
    `;
}

// الحصول على نص المنصة بالعربية
function getPlatformText(platform) {
    const platformMap = {
        'ps4': 'PlayStation 4',
        'ps3': 'PlayStation 3',
        'pc': 'PC',
        'xbox': 'Xbox',
        'switch': 'Nintendo Switch'
    };
    
    return platformMap[platform] || platform.toUpperCase();
}

// معالجة البحث
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredGames = allGames.filter(game => 
            currentPlatform === 'all' || game.platform === currentPlatform
        );
    } else {
        filteredGames = allGames.filter(game => {
            const matchesSearch = game.name.toLowerCase().includes(searchTerm) ||
                                game.description.toLowerCase().includes(searchTerm);
            const matchesPlatform = currentPlatform === 'all' || game.platform === currentPlatform;
            
            return matchesSearch && matchesPlatform;
        });
    }
    
    displayGames();
}

// معالجة الفلترة
function handleFilter(event) {
    const platform = event.target.dataset.platform;
    currentPlatform = platform;
    
    // تحديث الأزرار النشطة
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // تطبيق الفلترة
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredGames = allGames.filter(game => {
        const matchesPlatform = platform === 'all' || game.platform === platform;
        const matchesSearch = searchTerm === '' || 
                            game.name.toLowerCase().includes(searchTerm) ||
                            game.description.toLowerCase().includes(searchTerm);
        
        return matchesPlatform && matchesSearch;
    });
    
    displayGames();
}

// عرض رسالة عدم وجود نتائج
function showNoResults() {
    gamesGrid.innerHTML = `
        <div class="no-results">
            <h3>لا توجد ألعاب مطابقة</h3>
            <p>جرب تغيير كلمات البحث أو المنصة المحددة</p>
        </div>
    `;
}

// عرض رسالة خطأ
function showError(message) {
    gamesGrid.innerHTML = `
        <div class="no-results">
            <h3>حدث خطأ</h3>
            <p>${message}</p>
        </div>
    `;
}

// تحسين الأداء - تأخير البحث
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// تطبيق التأخير على البحث
const debouncedSearch = debounce(handleSearch, 300);
searchInput.addEventListener('input', debouncedSearch);

// إضافة تأثيرات تفاعلية
document.addEventListener('DOMContentLoaded', () => {
    // تأثير التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // تأثير الظهور التدريجي للبطاقات
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // مراقبة البطاقات الجديدة
    const observeCards = () => {
        document.querySelectorAll('.game-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    };
    
    // تشغيل المراقبة بعد تحميل الألعاب
    setTimeout(observeCards, 100);
});
