<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;

	let board = writable([]);
	onMount(() => {
		resetBoard();
	});

	let numRow = 20;
	let numCol = 20;
	let numMines = 30;

	function countNeighborMines(board, row, col) {
		let count = 0;
		for (let i = row - 1; i <= row + 1; i++) {
			for (let j = col - 1; j <= col + 1; j++) {
				if (i >= 0 && i < numRow && j >= 0 && j < numCol) {
					if (board[i][j].isMine) {
						count++;
					}
				}
			}
		}

		return count;
	}

	function revealAdjacentCells(board, row, col) {
		if ((row, 0 || row >= numRow || col < 0 || col >= numCol)) return;

		const cell = board[row][col];

		if (cell.isRevealed || cell.isMine) return;

		cell.isRevealed = true;

		const neighborMines = countNeighborMines(board, row, col);
		cell.neighborMines = neighborMines;

		if (neighborMines === 0) {
			for (let i = row - 1; i <= row + 1; i++) {
				for (let j = col - 1; j <= col + 1; j++) {
					if (i === row && j === col) continue;
						
					if (i >= 0 && i < numRow && j >= 0 && j < numCol) { 
						setTimeout(() => {revealAdjacentCells(board, i, j)}, 5)
					}
				}
			}
		}
	}

	function revealAllMines(board) {
		for (let i = 0; i < numRow; i++) {
			for (let j = 0; j < numCol; j++) {
				if (board[i][j].isMine) {
					board[i][j].isRevealed = true;
				}
			}
		}
		console.log('All mines revealed. Game Over!');
	}

	function clickedCellReveal(row, col) {
		console.log(`Cell clicked at row ${row}, col ${col}`);

		board.update((b) => {
			const cell = b[row][col];

			revealAdjacentCells(b, row, col);

			if (cell.isFlagged || cell.isRevealed) return b;

			cell.isRevealed = true;

			if (cell.isMine) {
				console.log('Game Over. You hit a mine.');
				revealAllMines(b);
			} else {
				const neighborMines = countNeighborMines(b, row, col);
				cell.neighborMines = neighborMines;

				if (neighborMines === 0) {
					revealAdjacentCells(b, row, col);
				}
			}

			return [...b];
		});
	}

	function clickedCellFlag(row, col) {
		board.update((b) => {
			const cell = b[row][col];

			if (!cell.isRevealed) {
				cell.isFlagged = !cell.isFlagged;
			}

			return b;
		});
	}

	function resetBoard() {
		const newBoard = [];
		for (let i = 0; i < numRow; i++) {
			let row = [];
			for (let j = 0; j < numCol; j++) {
				row.push({
					isRevealed: false,
					isMine: false,
					isFlagged: false,
					neighborMines: 0
				});
			}
			newBoard.push(row);
		}
		board.set(newBoard);

		placeMines();
	}

	function placeMines() {
		board.update((b) => {
			let minesPlaced = 0;
			while (minesPlaced < numMines) {
				const row = Math.floor(Math.random() * numRow);
				const col = Math.floor(Math.random() * numCol);

                const cell = b[row][col];

				if (!cell.isMine) {
					cell.isMine = true;
					minesPlaced++;
					console.log(`Mines placed at: (${row}, ${col})`);
				}
			}
			return b;
		});
	}

    function restarGame() {
        resetBoard();
    }

</script>

{#each $board as row, rowIndex}
	<div style="display:flex">
		{#each row as cell, colIndex}
			<button
				class="cell {cell.isRevealed ? 'clicked' : 'unclicked'}"
				on:click={() => clickedCellReveal(rowIndex, colIndex)}
				on:contextmenu|preventDefault={() => clickedCellFlag(rowIndex, colIndex)}
			>
				{#if cell.isFlagged}
					🚩
				{:else if cell.isRevealed}
					{#if cell.isMine}
						💣
					{:else}
						{cell.neighborMines > 0 ? cell.neighborMines : ''}
					{/if}
				{/if}
			</button>
		{/each}
	</div>
{/each}
<button on:click={restarGame}>Restart Game</button>

<style>
	.cell {
		height: 40px;
		aspect-ratio: 1 / 1;
		cursor: pointer;
		border: 1px solid black;
		font-size: 1.5em;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: gray;
		padding: 0;
	}

	.unclicked {
		background-color: gray;
	}
	.clicked {
		background-color: lightgray;
		border-width: 1px;
		border-color: black;
		border-style: solid;
	}
</style>
