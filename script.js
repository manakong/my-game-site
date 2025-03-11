// 全局变量
let currentPage = 1;
let digitCount = 0;
let playerNumber = '';
let opponentNumber = '';
let guessCount = 0;
let history = [];

// 获取元素
const pages = document.querySelectorAll('.page');
const readyPopup = document.getElementById('readyPopup');
const confirmPopup = document.getElementById('confirmPopup');
const winPopup = document.getElementById('winPopup');
const startButton = document.getElementById('startButton');
const onlineUsers = document.getElementById('onlineUsers');
const noUsersMessage = document.getElementById('noUsersMessage');
const networkErrorMessage = document.getElementById('networkErrorMessage');
const digitSelect = document.getElementById('digitSelect');
const confirmDigit = document.getElementById('confirmDigit');
const digitGrid = document.getElementById('digitGrid');
const keypad = document.getElementById('keypad');
const deleteButton = document.getElementById('deleteButton');
const clearButton = document.getElementById('clearButton');
const confirmNumber = document.getElementById('confirmNumber');
const guessButton = document.getElementById('guessButton');
const historyTable = document.getElementById('historyTable').querySelector('tbody');
const drawCanvas = document.getElementById('drawCanvas');
const ctx = drawCanvas.getContext('2d');
const paintColor = document.getElementById('paintColor');
const paintSize = document.getElementById('paintSize');

// 显示页面
function showPage(pageNumber) {
    pages.forEach((page, index) => {
        if (index + 1 === pageNumber) {
            page.style.display = 'block';
        } else {
            page.style.display = 'none';
        }
    });
    currentPage = pageNumber;
}

// 第一页面按钮点击事件
startButton.addEventListener('click', () => {
    showPage(2);
    // 模拟在线用户获取
    setTimeout(() => {
        // 模拟网络异常
        if (Math.random() < 0.1) {
            networkErrorMessage.classList.remove('hidden');
            return;
        }
        // 模拟没有在线用户
        if (Math.random() < 0.2) {
            noUsersMessage.classList.remove('hidden');
            return;
        }
        for (let i = 1; i <= 5; i++) {
            const userDiv = document.createElement('div');
            userDiv.textContent = `用户${i}`;
            userDiv.addEventListener('click', () => {
                readyPopup.style.display = 'block';
            });
            onlineUsers.appendChild(userDiv);
        }
    }, 1000);
});

// 准备弹窗按钮点击事件
document.getElementById('readyYes').addEventListener('click', () => {
    readyPopup.style.display = 'none';
    if (Math.random() < 0.5) {
        // 假设自己是房主
        showPage(3);
    } else {
        // 假设自己是房客
        alert('请稍等，房主在配置游戏选项');
    }
});

document.getElementById('readyNo').addEventListener('click', () => {
    readyPopup.style.display = 'none';
    showPage(2);
});

// 第三页面确认按钮点击事件
confirmDigit.addEventListener('click', () => {
    digitCount = parseInt(digitSelect.value);
    showPage(4);
    // 生成数字格子
    for (let i = 0; i < digitCount; i++) {
        const digitDiv = document.createElement('div');
        digitGrid.appendChild(digitDiv);
    }
    // 生成数字键盘
    const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
    numbers.forEach(num => {
        const button = document.createElement('button');
        button.textContent = num;
        button.dataset.value = num;
        keypad.appendChild(button);
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '删除';
    deleteBtn.id = 'deleteButton';
    keypad.appendChild(deleteBtn);
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '清空';
    clearBtn.id = 'clearButton';
    keypad.appendChild(clearBtn);
});

// 第四页面数字键盘点击事件
keypad.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const value = event.target.dataset.value;
        if (value) {
            if (playerNumber.length < digitCount) {
                playerNumber += value;
                digitGrid.children[playerNumber.length - 1].textContent = value;
                if (playerNumber.length === digitCount) {
                    confirmNumber.disabled = false;
                }
            }
        } else if (event.target.id === 'deleteButton') {
            if (playerNumber.length > 0) {
                playerNumber = playerNumber.slice(0, -1);
                digitGrid.children[playerNumber.length].textContent = '';
                confirmNumber.disabled = true;
            }
        } else if (event.target.id === 'clearButton') {
            playerNumber = '';
            digitGrid.childNodes.forEach((node) => {
                node.textContent = '';
            });
            confirmNumber.disabled = true;
        }
    }
});

// 确认数字按钮点击事件
confirmNumber.addEventListener('click', () => {
    if (playerNumber.length === digitCount) {
        confirmPopup.style.display = 'block';
    }
});

// 确认弹窗按钮点击事件
document.getElementById('confirmYes').addEventListener('click', () => {
    confirmPopup.style.display = 'none';
    showPage(5);
    // 模拟对方数字
    opponentNumber = '';
    for (let i = 0; i < digitCount; i++) {
        opponentNumber += Math.floor(Math.random() * 10);
    }
    const opponentNumberGrid = document.getElementById('opponentNumberGrid');
    for (let i = 0; i < digitCount; i++) {
        const digitDiv = document.createElement('div');
        digitDiv.textContent = '●';
        opponentNumberGrid.appendChild(digitDiv);
    }
});

document.getElementById('confirmNo').addEventListener('click', () => {
    confirmPopup.style.display = 'none';
});

// 猜测按钮点击事件
guessButton.addEventListener('click', () => {
    let guess = prompt('请输入猜测的数字');
    if (guess.length === digitCount) {
        guessCount++;
        let hits = 0;
        for (let i = 0; i < digitCount; i++) {
            if (guess[i] === opponentNumber[i]) {
                hits++;
            }
        }
        history.push({ guess, hits });
        const row = document.createElement('tr');
        const seqCell = document.createElement('td');
        const guessCell = document.createElement('td');
        const hitsCell = document.createElement('td');
        seqCell.textContent = guessCount;
        guessCell.textContent = guess;
        hitsCell.textContent = hits;
        row.appendChild(seqCell);
        row.appendChild(guessCell);
        row.appendChild(hitsCell);
        historyTable.appendChild(row);
        if (hits === digitCount) {
            winPopup.style.display = 'block';
            document.getElementById('guessCount').textContent = guessCount;
            const opponentNumberGrid = document.getElementById('opponentNumberGrid');
            opponentNumberGrid.childNodes.forEach((node, index) => {
                node.textContent = opponentNumber[index];
            });
        }
    } else {
        alert('请输入正确位数的数字');
    }
});

// 胜利弹窗按钮点击事件
document.getElementById('restartButton').addEventListener('click', () => {
    winPopup.style.display = 'none';
    showPage(1);
    // 重置变量
    currentPage = 1;
    digitCount = 0;
    playerNumber = '';
    opponentNumber = '';
    guessCount = 0;
    history = [];
    digitGrid.innerHTML = '';
    document.getElementById('