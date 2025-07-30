// Мобільне меню бургер
const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('mobile-menu-open');
    });

    // Закрити меню при кліку по пункту або поза меню
    mobileMenu.addEventListener('click', function(e) {
        if (e.target.tagName === "A" || e.target === mobileMenu) {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('mobile-menu-open');
        }
    });

    // Закрити меню при зміні розміру вікна (наприклад, якщо з мобільного перейти на десктоп)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1023 && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('mobile-menu-open');
        }
    });

    // Закрити меню по ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('mobile-menu-open');
        }
    });
}

// ----- ПІДСВІЧУВАННЯ АКТИВНОЇ ВКЛАДКИ МЕНЮ ПРИ СКРОЛІ -----
const sectionIds = ['home', 'promo', 'products', 'about', 'contact', 'footer'];
const menuLinks = document.querySelectorAll('.menu-btn');

function setActiveMenu() {
    let found = false;
    const scrollY = window.scrollY + window.innerHeight * 0.28;
    for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollY) {
            menuLinks.forEach(link => link.classList.remove('active'));
            menuLinks.forEach(link => {
                if (link.getAttribute('href') === '#' + sectionIds[i]) {
                    link.classList.add('active');
                }
            });
            found = true;
            break;
        }
    }
    if (!found) menuLinks.forEach(link => link.classList.remove('active'));
}
window.addEventListener('scroll', setActiveMenu);
window.addEventListener('load', setActiveMenu);

// ----- WHEEL SNAP SCROLL (1 колесо = 1 секція, блокування wheel під час анімації) -----
(function() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
    if (isTouch) return; // На мобільних не застосовуємо
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    let isWheelLocked = false;
    let currentIndex = 0;

    function getCurrentSectionIndex() {
        let idx = 0;
        const y = window.scrollY + window.innerHeight * 0.33;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop <= y) idx = i;
        }
        return idx;
    }
    currentIndex = getCurrentSectionIndex();

    function scrollToSection(idx) {
        isWheelLocked = true;
        currentIndex = idx;
        sections[currentIndex].scrollIntoView({behavior: 'smooth', block: 'start'});
        let finished = false;
        function finish() {
            if (finished) return;
            finished = true;
            isWheelLocked = false;
        }
        let checker = setInterval(() => {
            const y = window.scrollY;
            const targetY = sections[currentIndex].offsetTop;
            if (Math.abs(y - targetY) < 2) {
                finish();
                clearInterval(checker);
            }
        }, 28);
        setTimeout(() => {
            finish();
            clearInterval(checker);
        }, 700);
    }

    window.addEventListener('wheel', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('open')) return;
        if (isWheelLocked) {
            e.preventDefault();
            return false;
        }
        const dir = e.deltaY > 0 ? 1 : -1;
        let idx = getCurrentSectionIndex();
        idx += dir;
        if (idx < 0 || idx >= sections.length) return;
        e.preventDefault();
        scrollToSection(idx);
    }, {passive: false});
})();

// Subscribe form effect + AJAX-запис у бекенд
const subscribeForm = document.getElementById('subscribe-form');
if(subscribeForm){
    subscribeForm.addEventListener('submit', async function(e){
        e.preventDefault();
        const name = this.elements['name'].value.trim();
        const phone = this.elements['phone'].value.trim();
        // Відправка на Flask backend
        try {
            const res = await fetch('/subscribe', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, phone })
            });
            if (res.ok) {
                document.getElementById('subscribe-success').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('subscribe-success').classList.add('hidden');
                }, 4000);
                this.reset();
            } else {
                const data = await res.json();
                alert(data.message || "Сталася помилка!");
            }
        } catch (err) {
            alert("Сталася помилка при відправці форми!");
        }
    });
}

// Зберемо всі секції, які треба скролити
const sections = Array.from(document.querySelectorAll('.fullpage-section'));
let scrolling = false;
let currentSection = 0;

// Знайти індекс секції, що зараз у viewport (на початку)
function getCurrentSectionIndex() {
    const scroll = window.scrollY;
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop - 50 <= scroll) idx = i;
    }
    return idx;
}
currentSection = getCurrentSectionIndex();

window.addEventListener('wheel', function(e) {
    if (scrolling) return;
    scrolling = true;

    // deltaY > 0 — вниз, < 0 — вгору
    if (e.deltaY > 5 && currentSection < sections.length - 1) {
        currentSection++;
    } else if (e.deltaY < -5 && currentSection > 0) {
        currentSection--;
    } else {
        scrolling = false;
        return;
    }

    sections[currentSection].scrollIntoView({behavior: 'smooth'});
    setTimeout(() => scrolling = false, 600); // блокування, щоб не перескочити кілька секцій одразу

    e.preventDefault();
}, {passive: false});

// ===== Показ/приховування додаткового тексту для "Дізнатися більше" =====
document.querySelectorAll('.learn-more-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const content = this.nextElementSibling;
        if (content && content.classList.contains('learn-more-content')) {
            content.classList.toggle('open');
            this.textContent = content.classList.contains('open') ? 'Сховати' : 'Дізнатися більше';
        }
    });
});