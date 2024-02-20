const modal = document.getElementById("nameModal");
const submitButton = document.getElementById("submitNames");
const nameErrorMessage = document.getElementById("nameErrorMessage");

submitButton.addEventListener("click", function () {
    const player1Name = document.getElementById("player1Name").value;
    const player2Name = document.getElementById("player2Name").value;

    if (player1Name && player2Name) {
        const player1Element = document.getElementById("player1");
        const player2Element = document.getElementById("player2");

        player1Element.querySelector('strong').textContent = player1Name;
        player2Element.querySelector('strong').textContent = player2Name;

        modal.style.display = "none";
        nameErrorMessage.textContent = "";
    } else {
        nameErrorMessage.textContent = "Both player names are required.";
    }
});
modal.style.display = "flex";




const Player1 = document.querySelector('.X');
const Player2 = document.querySelector('.O');

const cells = document.querySelectorAll('.cell');

const XCount = document.getElementById('Xcount');
const OCount = document.getElementById('Ocount');

const resultMessage = document.querySelector('.result');


const button = document.querySelector('#btn');

let currentPlayer = 'X';
let isGameOver = false;

XCount.innerText = 3;
OCount.innerText = 3;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkForWin() {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (cells[a].textContent === 'X' && cells[b].textContent === 'X' && cells[c].textContent === 'X') {
            resultMessage.innerText = 'Player X wins!';
            resultMessage.style.display = 'flex';
            button.style.display = 'block';
            isGameOver = true;

            cells[a].classList.add('player-x-win');
            cells[b].classList.add('player-x-win');
            cells[c].classList.add('player-x-win');

            break;
        } else if (cells[a].textContent === 'O' && cells[b].textContent === 'O' && cells[c].textContent === 'O') {
            resultMessage.innerText = 'Player O wins!';
            resultMessage.style.display = 'flex';
            button.style.display = 'block';
            isGameOver = true;


            cells[a].classList.add('player-o-win');
            cells[b].classList.add('player-o-win');
            cells[c].classList.add('player-o-win');
            break;
        }
    }
}
document.getElementById('btn').addEventListener('click', () => {
    resetGame();
});
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('player-x-win', 'player-o-win');
    });
    currentPlayer = 'X';
    XCount.innerText = 3;
    OCount.innerText = 3;
    isGameOver = false;
    resultMessage.innerText = '';
    resultMessage.style.display = 'flex';
    button.style.display = 'none';
}

Player1.addEventListener('dragstart', (e) => {
    if (!isGameOver && currentPlayer === 'X' && XCount.innerText > 0) {
        e.dataTransfer.setData('text', 'X');
    } else {
        e.preventDefault();
    }
});

Player2.addEventListener('dragstart', (e) => {
    if (!isGameOver && currentPlayer === 'O' && OCount.innerText > 0) {
        e.dataTransfer.setData('text', 'O');
    } else {
        e.preventDefault();
    }
});
cells.forEach((cell) => {
    cell.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    cell.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!isGameOver) {
            const data = e.dataTransfer.getData('text');
            if (data === 'X' && currentPlayer === 'X' && XCount.innerText > 0 && cell.textContent === '') {
                cell.textContent = 'X';
                XCount.innerText = parseInt(XCount.innerText) - 1;
                currentPlayer = 'O';
                checkForWin();
            } else if (data === 'O' && currentPlayer === 'O' && OCount.innerText > 0 && cell.textContent === '') {
                cell.textContent = 'O';
                OCount.innerText = parseInt(OCount.innerText) - 1;
                currentPlayer = 'X';
                checkForWin();
            }
        }
        if (XCount.innerText == 0 && OCount.innerText == 0) {
            let draggedCell = null;

            function isValidMove(from_row, from_col, to_row, to_col) {
                const rowdif = Math.abs(to_row - from_row);
                const coldif = Math.abs(to_col - from_col);

                return (rowdif <= 1 && coldif <= 1);
            }
            function updateTurn() {
                cells.forEach((c) => {
                    if (c.textContent === currentPlayer) {
                        c.setAttribute('draggable', true);
                        c.addEventListener('dragstart', (e) => {
                            if (!isGameOver) {
                                if (c.textContent === currentPlayer) {
                                    e.dataTransfer.setData('text', currentPlayer);
                                    draggedCell = c;
                                } else {
                                    e.preventDefault();
                                }
                            } else {
                                e.preventDefault();
                            }
                        });
                    } else {
                        c.setAttribute('draggable', false);
                    }
                });
            }
            updateTurn();

            cells.forEach((cell) => {
                cell.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });
                cell.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (!isGameOver && draggedCell) {
                        const data = e.dataTransfer.getData('text');
                        if (data === currentPlayer && cell.textContent === '' && isValidMove(
                            parseInt(draggedCell.getAttribute('data-row')),
                            parseInt(draggedCell.getAttribute('data-col')),
                            parseInt(cell.getAttribute('data-row')),
                            parseInt(cell.getAttribute('data-col'))
                        )) {
                            cell.textContent = currentPlayer;
                            if (draggedCell) {
                                draggedCell.textContent = '';
                            }
                            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
                            checkForWin();
                            updateTurn();
                        }
                        draggedCell = null;
                    }
                });
            });
        }
    });
});