// 搜索功能：处理关键词跳转
function search() {
    const searchTerm = document.getElementById('search-input').value;
    if (searchTerm.trim() !== '') {
        // 定义特殊关键词
        const loveKeywords = ['情', '爱', '辉', '0819', '0519', '0324'];
        const jokeKeyword = '好玩';
        
        // 检查是否包含触发关键词
        const shouldShowLove = loveKeywords.some(keyword => 
            searchTerm.toLowerCase().includes(keyword.toLowerCase())
        );
        const shouldShowJoke = searchTerm.trim() === jokeKeyword;
        
        // 根据关键词跳转到不同页面
        if (shouldShowLove) {
            window.location.href = 'love.html';
        } else if (shouldShowJoke) {
            window.location.href = 'joke.html';
        } else {
            window.location.href = `https://www.baidu.com/s?wd=${encodeURIComponent(searchTerm)}`;
        }
    }
}

// 性能优化：使用 RAF 和防抖
const RAF = window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame;

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 雪花效果相关配置
const maxSnowflakes = 50;
let currentSnowflakes = 0;

// 创建雪花元素
function createSnowflakes() {
    if (currentSnowflakes >= maxSnowflakes) return;
    
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.opacity = Math.random() * 0.6 + 0.4;
    snowflake.innerHTML = '❄';

    // 随机大小和动画时间
    const size = Math.random() * 0.8 + 0.8;
    const duration = Math.random() * 5 + 8;
    
    snowflake.style.transform = `scale(${size})`;
    snowflake.style.animation = `fall ${duration}s linear forwards, glow 2s ease-in-out infinite alternate`;
    
    document.body.appendChild(snowflake);
    currentSnowflakes++;

    // 动画结束后移除雪花
    snowflake.addEventListener('animationend', () => {
        snowflake.remove();
        currentSnowflakes--;
    });
}

// 定期创建雪花
setInterval(createSnowflakes, 200);

// 添加雪花摆动效果
function addWobble() {
    const snowflakes = document.getElementsByClassName('snowflake');
    for (let flake of snowflakes) {
        const currentTransform = flake.style.transform || '';
        const wobble = Math.sin(Date.now() / 1000 + parseInt(flake.style.left)) * 15;
        flake.style.transform = `${currentTransform} translateX(${wobble}px)`;
    }
    requestAnimationFrame(addWobble);
}

addWobble();