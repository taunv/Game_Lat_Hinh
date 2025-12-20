// --- KHO DỮ LIỆU KHỔNG LỒ (30+ hình mỗi chủ đề) ---
const themes = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🐢', '🐍', '🦎', '🐙', '🦑', '🦞', '🦀'],
    
    fruits: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍆', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🥕', '🥔', '🍠', '🥐', '🥯', '🍞'],
    
    sweets: ['🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '☕', '🍵', '🥤', '🧋', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝'],
    
    household: ['🏠', '🏡', '🏘️', '🚪', '🛏️', '🛋️', '🪑', '🚽', '🚿', '🛁', '🪞', '🪟', '🧼', '🧽', '🧴', '🪥', '🪒', '🧺', '🧹', '🗑️', '🍳', '🥘', '🍲', '🥣', '🍽️', '🍴', '🥄', '🔪', '🧊', '🏺', '💡', '🔦', '🕯️', '📚', '📦', '🗝️'],
    
    vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛺', '🚂', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚋', '🚃', '🚠', '🚡', '🛳️', '🚤', '✈️', '🚀', '🛸'],
    
    sports: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🥏', '🎳', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🎮', '🎰', '🎲'],
    
    // Với số và chữ, ta dùng ký tự text trực tiếp cho rõ ràng
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '💯', '💲', '➕', '➖', '✖️'],
    
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '🅰️', '🅱️', '🅾️', '🅿️', '🆗', '🆙', '🆒', '🆕', '🆓']
};

// --- CẤU HÌNH ---
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const themeSelect = document.getElementById('themeSelect');
const bgMusic = document.getElementById('bgMusic');
const clapSound = document.getElementById('clapSound');

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let countdown;
let timeLeft = 60;
let matchCount = 0;
let isMusicPlaying = false;

// Cài đặt âm lượng
bgMusic.volume = 0.3; 
clapSound.volume = 0.8;

// --- HÀM XỬ LÝ ---

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Hàm cố gắng phát nhạc (do trình duyệt chặn tự phát)
function tryPlayMusic() {
    if (!isMusicPlaying) {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
        }).catch(error => {
            console.log("Chờ người dùng tương tác để phát nhạc");
        });
    }
}

// Thêm sự kiện click vào body để kích hoạt nhạc lần đầu
document.body.addEventListener('click', tryPlayMusic, { once: true });

function getRandomIcons(themeKey) {
    const allIcons = [...themes[themeKey]];
    shuffle(allIcons);
    // Lấy 8 hình đầu tiên từ kho đã xáo trộn
    return allIcons.slice(0, 8);
}

function initGame() {
    clearInterval(countdown);
    timeLeft = 30;
    matchCount = 0;
    timerDisplay.innerText = `⏳ ${timeLeft}s`;
    timerDisplay.style.color = '#f1c40f'; // Reset màu
    gameBoard.innerHTML = '';
    
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];

    // Thử phát nhạc lại nếu đang bị pause
    tryPlayMusic();

    const selectedTheme = themeSelect.value;
    const selectedIcons = getRandomIcons(selectedTheme);
    const gameDeck = [...selectedIcons, ...selectedIcons];
    shuffle(gameDeck);

    gameDeck.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Kiểm tra nếu là chữ/số thì đổi style font to hơn một chút
        let contentStyle = '';
        if (selectedTheme === 'numbers' || selectedTheme === 'letters') {
            contentStyle = 'font-weight: bold; font-family: sans-serif;';
        }

        card.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back" style="${contentStyle}">${icon}</div>
        `;
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    startTimer();
}

function startTimer() {
    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `⏳ ${timeLeft}s`;

        // Đổi màu đỏ khi sắp hết giờ
        if (timeLeft < 10) {
            timerDisplay.style.color = '#e74c3c';
        }

        if (timeLeft <= 0) {
            clearInterval(countdown);
            lockBoard = true;
            // Dừng nhạc nền khi thua
            bgMusic.pause();
            alert("⏰ Hết giờ! Bạn cần nhanh tay hơn!");
        }
    }, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.querySelector('.card-back').innerText === 
                  secondCard.querySelector('.card-back').innerText;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // CHỌN ĐÚNG: Phát tiếng vỗ tay
    clapSound.currentTime = 0; // Tua lại đầu
    clapSound.play().catch(e => console.log("Lỗi âm thanh: " + e));

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchCount++;
    resetBoard();

    if (matchCount === 8) {
        clearInterval(countdown);
        setTimeout(() => {
            // Hiệu ứng chiến thắng
            alert(`🎉 XUẤT SẮC! Bạn hoàn thành trong ${30 - timeLeft} giây!`);
        }, 500);
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function restartGame() {
    initGame();
}

themeSelect.addEventListener('change', restartGame);
window.onload = initGame;
