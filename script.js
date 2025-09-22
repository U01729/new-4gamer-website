// نظام إدارة الألعاب والواجهة الرئيسية لموقع 4GAMER
class GameIndexManager {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.gamesPerPage = 9;
        this.searchQuery = '';
        this.isLoading = false;
        
        this.init();
    }

    // تهيئة النظام
    async init() {
        this.showLoadingScreen();
        await this.loadGames();
        this.setupEventListeners();
        this.setupNavigation();
        this.setupScrollEffects();
        this.renderGames();
        this.updateStats();
        this.hideLoadingScreen();
    }

    // إظهار شاشة التحميل
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    // إخفاء شاشة التحميل
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    // تحميل الألعاب
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
                } else {
                    // بيانات افتراضية في حالة عدم وجود الملف
                    this.games = this.getDefaultGames();
                }
            }
            this.filteredGames = [...this.games];
        } catch (error) {
            console.error('خطأ في تحميل الألعاب:', error);
            this.games = this.getDefaultGames();
            this.filteredGames = [...this.games];
        }
    }

    // الحصول على بيانات الألعاب الافتراضية
    getDefaultGames() {
        return [
            {
                id: 1,
                name: "Ghost of Tsushima",
                description: "لعبة مغامرات وقتال رائعة تدور أحداثها في اليابان الإقطاعية. اكتشف عالماً مفتوحاً خلاباً واستمتع بقتال السيوف المذهل.",
                platform: "ps4",
                thumbnail: "assets/ghost_of_tsushima_thumb.jpg",
                downloadLinks: ["#", "#", "#"],
                link: "game-pages/ps4/ghost-of-tsushima/index.html",
                dateAdded: "2025-01-01"
            },
            {
                id: 2,
                name: "Far Cry 3 Classic Edition",
                description: "النسخة الكلاسيكية من لعبة Far Cry 3 المحبوبة. استكشف جزيرة استوائية خطيرة وواجه أعداء لا يرحمون.",
                platform: "ps4",
                thumbnail: "assets/far_cry_3_thumb.jpg",
                downloadLinks: ["#", "#"],
                link: "game-pages/ps4/far-cry-3-classic/index.html",
                dateAdded: "2025-01-02"
            },
            {
                id: 3,
                name: "The Last of Us Part II",
                description: "تكملة ملحمة البقاء المذهلة. انضم إلى إيلي في رحلة عاطفية مليئة بالإثارة والتشويق في عالم ما بعد الكارثة.",
                platform: "ps4",
                thumbnail: "assets/last_of_us_2_thumb.jpg",
                downloadLinks: ["#", "#", "#", "#"],
                link: "game-pages/ps4/the-last-of-us-part-2/index.html",
                dateAdded: "2025-01-03"
            },
            {
                id: 4,
                name: "God of War (2018)",
                description: "إعادة تصور رائعة لسلسلة God of War. انطلق مع كريتوس وابنه أتريوس في مغامرة أسطورية عبر الأساطير الإسكندنافية.",
                platform: "ps4",
                thumbnail: "assets/god_of_war_thumb.jpg",
                downloadLinks: ["#", "#", "#"],
                link: "game-pages/ps4/god-of-war-2018/index.html",
                dateAdded: "2025-01-04"
            },
            {
                id: 5,
                name: "Marvel's Spider-Man",
                description: "كن الرجل العنكبوت في هذه اللعبة المذهلة. تأرجح عبر نيويورك وواجه الأشرار في قصة أصلية مثيرة.",
                platform: "ps4",
                thumbnail: "assets/spiderman_thumb.jpg",
                downloadLinks: ["#", "#"],
                link: "game-pages/ps4/spider-man-ps4/index.html",
                dateAdded: "2025-01-05"
            },
            {
                id: 6,
                name: "Horizon Zero Dawn",
                description: "استكشف عالماً مستقبلياً مليئاً بالآلات الضخمة. انضم إلى آلوي في مغامرة لكشف أسرار الماضي.",
                platform: "ps4",
                thumbnail: "assets/horizon_zero_dawn_thumb.jpg",
                downloadLinks: ["#", "#", "#"],
                link: "game-pages/ps4/horizon-zero-dawn/index.html",
                dateAdded: "2025-01-06"
            },
            {
                id: 7,
                name: "Uncharted 4: A Thief's End",
                description: "المغامرة الأخيرة لناثان دريك. استمتع بقصة مليئة بالإثارة والكنوز المفقودة في أجمل الأماكن حول العالم.",
                platform: "ps4",
                thumbnail: "assets/uncharted_4_thumb.jpg",
                downloadLinks: ["#", "#"],
                link: "game-pages/ps4/uncharted-4/index.html",
                dateAdded: "2025-01-07"
            },
            {
                id: 8,
                name: "Bloodborne",
                description: "لعبة رعب وأكشن مظلمة من صناع Dark Souls. استكشف مدينة يارنام الملعونة وواجه مخلوقات كابوسية.",
                platform: "ps4",
                thumbnail: "assets/bloodborne_thumb.jpg",
                downloadLinks: ["#", "#", "#"],
                link: "game-pages/ps4/bloodborne/index.html",
                dateAdded: "2025-01-08"
            },
            {
                id: 9,
                name: "Red Dead Redemption 2",
                description: "ملحمة الغرب الأمريكي الأعظم. عش حياة الخارجين عن القانون في عالم مفتوح مذهل مليء بالتفاصيل.",
                platform: "ps4",
                thumbnail: "assets/red_dead_2_thumb.jpg",
                downloadLinks: ["#", "#", "#", "#"],
                link: "game-pages/ps4/red-dead-redemption-2/index.html",
                dateAdded: "2025-01-09"
            },
            {
                id: 10,
                name: "Persona 5 Royal",
                description: "النسخة المحسنة من لعبة الـ JRPG الرائعة. انضم إلى فريق Phantom Thieves وغير قلوب الفاسدين.",
                platform: "ps4",
                thumbnail: "assets/persona_5_thumb.jpg",
                downloadLinks: ["#", "#"],
                link: "game-pages/ps4/persona-5-royal/index.html",
                dateAdded: "2025-01-10"
            },
            {
                id: 11,
                name: "The Last of Us",
                description: "اللعبة التي غيرت مفهوم ألعاب البقاء. انضم إلى جويل وإيلي في رحلة عبر أمريكا المدمرة.",
                platform: "ps3",
                thumbnail: "assets/last_of_us_ps3_thumb.jpg",
                downloadLinks: ["#", "#", "#"],
                link: "game-pages/ps3/the-last-of-us/index.html",
                dateAdded: "2025-01-11"
            },
            {
                id: 12,
                name: "Grand Theft Auto V",
                description: "لعبة العالم المفتوح الأشهر على الإطلاق. استكشف لوس سانتوس وعش حياة الجريمة مع ثلاث شخصيات مختلفة.",
                platform: "ps3",
                thumbnail: "assets/gta_v_ps3_thumb.jpg",
                downloadLinks: ["#", "#", "#", "#"],
                link: "game-pages/ps3/grand-theft-auto-v/index.html",
                dateAdded: "2025-01-12"
            },
            {
                id: 13,
                name: "Cyberpunk 2077",
                description: "استكشف مدينة Night City المستقبلية في هذه اللعبة الملحمية. عش حياة المرتزق في عالم السايبربانك.",
                platform: "pc",
                thumbnail: "assets/cyberpunk_2077_thumb.jpg",
                downloadLinks: ["#", "#", "#"],
                link: "game-pages/pc/cyberpunk-2077/index.html",
                dateAdded: "2025-01-13"
            },
            {
                id: 14,
                name: "The Witcher 3: Wild Hunt",
                description: "أعظم ألعاب الـ RPG على الإطلاق. انضم إلى جيرالت في مغامرة ملحمية عبر عالم خيالي مذهل.",
                platform: "pc",
                thumbnail: "assets/witcher_3_thumb.jpg",
                downloadLinks: ["#", "#", "#", "#"],
                link: "game-pages/pc/witcher-3-wild-hunt/index.html",
                dateAdded: "2025-01-14"
            },
            {
                id: 15,
                name: "Elden Ring",
                description: "تحفة فنية من صناع Dark Souls وبالتعاون مع جورج آر آر مارتن. استكشف عالماً مفتوحاً مظلماً وخطيراً.",
                platform: "pc",
                thumbnail: "assets/elden_ring_thumb.jpg",
                downloadLinks: ["#", "#", "#"],
                link: "game-pages/pc/elden-ring/index.html",
                dateAdded: "2025-01-15"
            }
        ];
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // البحث
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterGames();
            }, 300));

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // أزرار الفلترة
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.currentFilter = e.target.dataset.platform;
                this.filterGames();
            });
        });

        // زر تحميل المزيد
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreGames();
            });
        }

        // زر العودة للأعلى
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        // مراقبة التمرير
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // تغيير حجم النافذة
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // إعداد التنقل
    setupNavigation() {
        // التنقل السلس
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.setActiveNavLink(link);
            });
        });

        // قائمة الهاتف المحمول
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // إغلاق القائمة عند النقر خارجها
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    // إعداد تأثيرات التمرير
    setupScrollEffects() {
        // تأثير الظهور التدريجي
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // مراقبة العناصر
        const elementsToObserve = document.querySelectorAll('.game-card, .platform-card, .feature-item, .stat-showcase');
        elementsToObserve.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // فلترة الألعاب
    filterGames() {
        this.filteredGames = this.games.filter(game => {
            const matchesSearch = this.searchQuery === '' || 
                                game.name.toLowerCase().includes(this.searchQuery) ||
                                game.description.toLowerCase().includes(this.searchQuery);
            
            const matchesPlatform = this.currentFilter === 'all' || 
                                  game.platform === this.currentFilter;
            
            return matchesSearch && matchesPlatform;
        });

        this.currentPage = 1;
        this.renderGames();
        this.updateLoadMoreButton();
    }

    // تعيين الفلتر النشط
    setActiveFilter(activeTab) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    // تعيين رابط التنقل النشط
    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // عرض الألعاب
    renderGames() {
        const gamesGrid = document.getElementById('gamesGrid');
        if (!gamesGrid) return;

        if (this.filteredGames.length === 0) {
            gamesGrid.innerHTML = `
                <div class="no-results">
                    <h3>لم يتم العثور على ألعاب</h3>
                    <p>جرب تغيير كلمات البحث أو الفلتر المحدد</p>
                </div>
            `;
            return;
        }

        const gamesToShow = this.filteredGames.slice(0, this.currentPage * this.gamesPerPage);
        
        gamesGrid.innerHTML = gamesToShow.map(game => this.createGameCard(game)).join('');
        
        // إضافة تأثيرات الحركة للبطاقات الجديدة
        const newCards = gamesGrid.querySelectorAll('.game-card');
        newCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }

    // إنشاء بطاقة لعبة
    createGameCard(game) {
        const platformName = this.getPlatformName(game.platform);
        
        return `
            <a href="${game.link}" class="game-card" data-game-id="${game.id}">
                <img src="${game.thumbnail}" alt="${game.name}" class="game-thumbnail" 
                     onerror="this.src='assets/default_thumb.jpg'">
                <div class="game-info">
                    <h2 class="game-title">${game.name}</h2>
                    <span class="game-platform">${platformName}</span>
                    <p class="game-description">${this.truncateText(game.description, 120)}</p>
                    <div class="game-actions">
                        <span class="game-link">عرض التفاصيل</span>
                    </div>
                </div>
            </a>
        `;
    }

    // اقتطاع النص
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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

    // تحميل المزيد من الألعاب
    loadMoreGames() {
        this.currentPage++;
        this.renderGames();
        this.updateLoadMoreButton();
    }

    // تحديث زر تحميل المزيد
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        const totalShown = this.currentPage * this.gamesPerPage;
        const hasMore = totalShown < this.filteredGames.length;

        if (hasMore) {
            loadMoreBtn.style.display = 'inline-flex';
            loadMoreBtn.textContent = `تحميل المزيد (${this.filteredGames.length - totalShown} متبقية)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    // تحديث الإحصائيات
    updateStats() {
        const stats = {
            total: this.games.length,
            ps4: this.games.filter(game => game.platform === 'ps4').length,
            ps3: this.games.filter(game => game.platform === 'ps3').length,
            pc: this.games.filter(game => game.platform === 'pc').length
        };

        // تحديث إحصائيات الصفحة الرئيسية
        const totalGamesCount = document.getElementById('totalGamesCount');
        if (totalGamesCount) {
            totalGamesCount.textContent = `${stats.total}+`;
        }

        // تحديث إحصائيات المنصات
        const ps4Count = document.getElementById('ps4Count');
        const ps3Count = document.getElementById('ps3Count');
        const pcCount = document.getElementById('pcCount');

        if (ps4Count) ps4Count.textContent = stats.ps4;
        if (ps3Count) ps3Count.textContent = stats.ps3;
        if (pcCount) pcCount.textContent = stats.pc;
    }

    // معالجة التمرير
    handleScroll() {
        const backToTopBtn = document.getElementById('backToTop');
        const header = document.querySelector('.main-header');
        
        // إظهار/إخفاء زر العودة للأعلى
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // تأثير الهيدر عند التمرير
        if (header) {
            if (window.pageYOffset > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.boxShadow = 'none';
            }
        }

        // تحديث التنقل النشط
        this.updateActiveNavigation();
    }

    // تحديث التنقل النشط بناءً على الموضع
    updateActiveNavigation() {
        const sections = ['home', 'games', 'platforms', 'about'];
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = sectionId;
                }
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // معالجة تغيير حجم النافذة
    handleResize() {
        // إعادة حساب التخطيط إذا لزم الأمر
        this.updateLoadMoreButton();
    }

    // التمرير إلى قسم معين
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // العودة إلى الأعلى
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // تنفيذ البحث
    performSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            this.scrollToSection('games');
        }
    }

    // فلترة حسب المنصة (للاستخدام من الفوتر)
    filterByPlatform(platform) {
        this.currentFilter = platform;
        
        // تحديث الفلتر النشط
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.platform === platform) {
                tab.classList.add('active');
            }
        });

        this.filterGames();
        this.scrollToSection('games');
    }

    // تأخير تنفيذ الوظائف (debounce)
    debounce(func, wait) {
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
}

// وظائف عامة للاستخدام من HTML
function scrollToSection(sectionId) {
    if (window.gameManager) {
        window.gameManager.scrollToSection(sectionId);
    }
}

function scrollToTop() {
    if (window.gameManager) {
        window.gameManager.scrollToTop();
    }
}

function performSearch() {
    if (window.gameManager) {
        window.gameManager.performSearch();
    }
}

function filterByPlatform(platform) {
    if (window.gameManager) {
        window.gameManager.filterByPlatform(platform);
    }
}

function loadMoreGames() {
    if (window.gameManager) {
        window.gameManager.loadMoreGames();
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameIndexManager();
});

// تحسينات الأداء
document.addEventListener('DOMContentLoaded', () => {
    // تحسين تحميل الصور
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // تحسين الحركات
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
    }
});

// معالجة الأخطاء العامة
window.addEventListener('error', (e) => {
    console.error('خطأ في التطبيق:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('خطأ في Promise:', e.reason);
});

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameIndexManager };
}
