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
}

// Відгуки (3 неонових)
const reviews = [
    {text: "Аромати, які дарують нові емоції!", author: "Олексій Т.", stars: 5},
    {text: "Сервіс на висоті, асортимент — супер!", author: "Анна Л.", stars: 5},
    {text: "Замовляю вже втретє — все ідеально!", author: "Марія П.", stars: 5},
    {text: "Зручно, швидко, дуже приємно!", author: "Дмитро К.", stars: 5},
    {text: "Смак і аромат — просто космос!", author: "Олена М.", stars: 5},
    {text: "Кожна покупка — радість!", author: "Петро В.", stars: 5},
];
const reviewList = document.getElementById('review-list');
function renderReviews() {
    reviewList.innerHTML = '';
    let shown = [];
    while (shown.length < 3) {
        const idx = Math.floor(Math.random() * reviews.length);
        if (!shown.includes(idx)) {
            shown.push(idx);
            const r = reviews[idx];
            const star = '<span class="stars">★★★★★</span>';
            const card = document.createElement('div');
            card.className = 'review-card flex flex-col items-center animate-fade-in';
            card.innerHTML = `<div>${star}</div>
                <p class="text-xl neon-gradient my-4 text-center">${r.text}</p>
                <span class="font-bold neon-link">${r.author}</span>`;
            reviewList.appendChild(card);
        }
    }
}
renderReviews();
setInterval(renderReviews, 4800);

// Subscribe form effect
const subscribeForm = document.getElementById('subscribe-form');
if(subscribeForm){
    subscribeForm.addEventListener('submit', function(e){
        e.preventDefault();
        document.getElementById('subscribe-success').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('subscribe-success').classList.add('hidden');
        }, 4000);
        this.reset();
    });
}