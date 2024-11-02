<script>
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	/**
	 * @type {Element | null}
	 */
	let statusDisplay;
	let gameActive = true;
	let currentPlayer = 'X';
	let gameState = ['', '', '', '', '', '', '', '', ''];
	const winningMessage2 = `Player ${currentPlayer} has won!`;
	const winningMessage = () => `Player ${currentPlayer} has won!`;
	const drawMessage = () => `Game ended in a draw!`;
	const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
	onMount(docLoad);

	function docLoad() {
		statusDisplay.innerHTML = currentPlayerTurn();
		// @ts-ignore
		document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
		console.log(winningMessage, winningMessage2);
	}

	// @ts-ignore
	function handleCellClick(clickedCellEvent) {
		const clickedCell = clickedCellEvent.target;
		const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

		if (gameState[clickedCellIndex] !== '' || !gameActive) {
			return;
		}

		handleCellPlayed(clickedCell, clickedCellIndex);
		handleResultValidation();
	}

	// @ts-ignore
	function handleCellPlayed(clickedCell, clickedCellIndex) {
		gameState[clickedCellIndex] = currentPlayer;
		clickedCell.innerHTML = currentPlayer;
		console.log(winningMessage, winningMessage2);
	}
	function handlePlayerChange() {
		currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
		// @ts-ignore
		statusDisplay.innerHTML = currentPlayerTurn();
	}

	const winningConditions = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	function handleResultValidation() {
		let roundWon = false;
		for (let i = 0; i <= 7; i++) {
			const winCondition = winningConditions[i];
			let a = gameState[winCondition[0]];
			let b = gameState[winCondition[1]];
			let c = gameState[winCondition[2]];
			if (a === '' || b === '' || c === '') {
				continue;
			}
			if (a === b && b === c) {
				roundWon = true;
				break;
			}
		}
		if (roundWon) {
			// @ts-ignore
			statusDisplay.innerHTML = winningMessage();
			gameActive = false;
			return;
		}

		let roundDraw = !gameState.includes('');
		if (roundDraw) {
			// @ts-ignore
			statusDisplay.innerHTML = drawMessage();
			gameActive = false;
			return;
		}

		handlePlayerChange();
	}

	function handleRestartGame() {
		gameActive = true;
		currentPlayer = 'X';
		gameState = ['', '', '', '', '', '', '', '', ''];
		// @ts-ignore
		statusDisplay.innerHTML = currentPlayerTurn();
		document.querySelectorAll('.cell').forEach((cell) => (cell.innerHTML = ''));
	}
</script>

<h1 class="game--title">Tic Tac Toe</h1>
<div class="game--container">
	{#each { length: 9 } as _, i}
		<div data-cell-index={i} class="cell" on:click={handleCellClick}></div>
	{/each}
</div>
<h2 bind:this={statusDisplay}></h2>
<button on:click={handleRestartGame}>Restart Game</button>

<style>
	body {
		font-family: 'Arial', sans-serif;
	}
	section {
		text-align: center;
	}
	.game--container {
		display: grid;
		grid-template-columns: repeat(3, auto);
		width: 306px;
		margin: 50px auto;
	}
	.cell {
		font-family: 'Permanent Marker', cursive;
		width: 100px;
		height: 100px;
		box-shadow: 0 0 0 1px #333333;
		border: 1px solid #333333;
		cursor: pointer;
		line-height: 100px;
		font-size: 60px;
		display: flex;
		justify-content: center;
	}
</style>
