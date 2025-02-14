// Constants
const LOVE_START_DATE = new Date(2024, 7, 13); 
const LOVE_CODE = "13072024";
const STORAGE_KEY = "loveBoxUnlocked";
const TOTAL_PAGES = 5;

// State management with better encapsulation
class AppState {
    constructor() {
        this._currentPage = 0;
        this._isBookOpen = false;
        this._memories = [
            {
                date: '01/08/2024',
                title: 'Bữa đi chơi đầu tiên với nhau',
                description: 'Ngày đặc biệt đầu tiên của chúng mình.'
            },
            {
                date: '15/02/2024',
                title: 'Buổi hẹn đầu tiên',
                description: 'Những khoảnh khắc ngọt ngào và đáng nhớ.'
            }
        ];

    }

    get currentPage() { return this._currentPage; }
    set currentPage(value) {
        if (value >= 0 && value <= TOTAL_PAGES) {
            this._currentPage = value;
            this.updateUI();
        }
    }

    get isBookOpen() { return this._isBookOpen; }
    set isBookOpen(value) {
        this._isBookOpen = value;
        if (value) {
            this.handleBookOpen();
        }
    }

    updateUI() {
	console.log('abcajsbcjkasb')
        this.updatePageVisibility();
        this.updateNavigation();
    }

    updatePageVisibility() {
        document.querySelectorAll('.book-page').forEach((page, index) => {
            page.style.display = index + 1 === this._currentPage ? 'block' : 'none';
        });
    }

    updateNavigation() {
        const prevBtns = document.querySelectorAll('.prev-btn');
        const nextBtns = document.querySelectorAll('.next-btn');
        
        prevBtns.forEach(btn => {
            btn.style.visibility = this._currentPage === 1 ? 'hidden' : 'visible';
        });
        
        nextBtns.forEach(btn => {
            btn.style.visibility = this._currentPage === TOTAL_PAGES ? 'hidden' : 'visible';
        });
    }

    handleBookOpen() {
        const book = document.getElementById('book');
        if (!book) return;

        book.classList.add('open');
        setTimeout(() => {
            this.currentPage = 1;
            this.createHeartBurst();
        }, 1000);
    }

    createHeartBurst() {
        const burstCount = 20;
        const radius = 100;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                const heart = this.createHeartElement(centerX, centerY, radius, i, burstCount);
                document.body.appendChild(heart);
                
                const duration = 2 + Math.random() * 3;
                setTimeout(() => heart.remove(), duration * 1000);
            }, i * 100);
        }
    }

    createHeartElement(centerX, centerY, radius, index, total) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '💝';
        
        const angle = (Math.PI * 2 * index) / total;
        heart.style.left = `${centerX + Math.cos(angle) * radius}px`;
        heart.style.top = `${centerY + Math.sin(angle) * radius}px`;
        
        const duration = 2 + Math.random() * 3;
        heart.style.animation = `float ${duration}s linear`;
        
        return heart;
    }
}

// Application initialization
class App {
    constructor() {
        this.state = new AppState();
        this.heartParticleThrottle = this.throttle(this.createHeartParticle.bind(this), 100);
	document.querySelectorAll(".next-btn").forEach(btn => {
            btn.addEventListener("click", () => this.nextPage());
        });
        document.querySelectorAll(".prev-btn").forEach(btn => {
            btn.addEventListener("click", () => this.prevPage());
        });
    }

    async init() {
        try {
            await this.setupLoading();
            this.setupEventListeners();
            this.setupBook();
            this.checkPreviousUnlock();
            this.updateDaysCounter();
            this.startAutoUpdate();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    async setupLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        return new Promise(resolve => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    resolve();
                }, 500);
            }, 1500);
        });
    }

    setupEventListeners() {
        this.setupLoveCodeInput();
        this.setupKeyboardNavigation();
        document.addEventListener('mousemove', this.heartParticleThrottle);
    }

    setupLoveCodeInput() {
        const input = document.getElementById('loveCode');
        if (!input) return;

        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.checkLoveCode();
        });

        input.addEventListener('input', e => {
            e.target.value = this.sanitizeInput(e.target.value);
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', e => {
            if (!this.state.isBookOpen) return;

            if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
                this.nextPage();
            } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
                this.prevPage();
            }
        });
    }

    setupBook() {
        const book = document.getElementById('book');
        if (!book) return;

        book.addEventListener('click', () => {
            if (!this.state.isBookOpen) {
                this.state.isBookOpen = true;
            }
        });
    }

    checkLoveCode() {
        const input = document.getElementById('loveCode');
        if (!input) return;

        if (input.value === LOVE_CODE) {
            this.unlockContent();
        } else {
            this.showError(input);
        }
    }

    unlockContent() {
        const lockScreen = document.getElementById('lockScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (lockScreen && mainContent) {
            lockScreen.classList.add('hidden');
            setTimeout(() => {
                mainContent.classList.add('visible');
                this.state.createHeartBurst();
            }, 500);
            
            localStorage.setItem(STORAGE_KEY, 'true');
            this.updateDaysCounter();
        }
    }

    showError(input) {
        input.classList.add('error');
        alert('Thử lại nhé! Gợi ý: Hãy nghĩ về ngày Valentine của chúng mình ❤️');
        
        setTimeout(() => input.classList.remove('error'), 1000);
    }

    checkPreviousUnlock() {

    }

    updateDaysCounter() {
        const element = document.getElementById('daysCounter');
        if (!element) return;

        const daysSinceStart = Math.floor((new Date() - LOVE_START_DATE) / (1000 * 60 * 60 * 24));
        element.innerHTML = `
            <p class="days-counter-text">
                Chúng mình đã bên nhau được 216 ngày rồi đó 💑
            </p>
        `;
    }

    createHeartParticle(e) {
        if (Math.random() > 0.95) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.innerHTML = '💝';
            heart.style.left = `${e.clientX}px`;
            heart.style.top = `${e.clientY}px`;
            
            const duration = 2 + Math.random() * 3;
            heart.style.animation = `float ${duration}s linear`;
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), duration * 1000);
        }
    }

    startAutoUpdate() {
        setInterval(() => this.updateDaysCounter(), 1000 * 60 * 60);
    }

    sanitizeInput(input) {
        return input.replace(/[^0-9]/g, '').slice(0, 8);
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    nextPage() {
        if (this.state.currentPage < TOTAL_PAGES) {
            this.state.currentPage++;
        }
    }

    prevPage() {
        if (this.state.currentPage > 1) {
            this.state.currentPage--;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
