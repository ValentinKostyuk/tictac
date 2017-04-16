import {Cell} from './Cell'
import {CellStates} from '../../shared/enums/CellStates'
import {Coordinates} from '../../shared/models/Coordinates'
import * as Chalk from "chalk";

export class GameField {
	public cells: Cell[][];
	private scores: number[];
	private fieldSize: number;

	public constructor(fieldSize: number = 3) {
		this.cells = [];

		for (let i = 0; i < fieldSize; i++) {

			this.cells[i] = [];

			for (let j = 0; j < fieldSize; j++) {
				this.cells[i][j] = new Cell();
			}
		}

		this.fieldSize = fieldSize;
		this.scores = Array.apply(null, Array(2 * fieldSize + 2)).map(Number.prototype.valueOf, 0);
	}

	public saveMove(coordinates: Coordinates, playerMark: CellStates): void {  //sets state of chosen cell and adds scores for each field dimension
		let point = playerMark === CellStates.cross ? 1 : -1;

		this.cells[coordinates.x][coordinates.y].state = playerMark;

		this.scores[coordinates.x] += point;

		this.scores[this.fieldSize + coordinates.y] += point;

		if (coordinates.x == coordinates.y) {
			this.scores[2 * this.fieldSize] += point;
		}

		if (this.fieldSize - 1 - coordinates.y == coordinates.x) {
			this.scores[2 * this.fieldSize + 1] += point;
		}
	}

	public getFieldState(): CellStates {//returns winner player type or null
		let length = 2 * this.fieldSize + 2;
		for (let i = 0; i < length; i += 1) {
			if (Math.abs(this.scores[i]) === this.fieldSize) {
				let result = this.scores[i] > 0 ? CellStates.cross : CellStates.nought;
				console.log(Chalk.bgBlue.black("And Winner is: " + result));
				return result;
			}
		}
		return CellStates.empty;
	}

	public isCellValidForMove(coordinates: Coordinates): boolean {
		let x = coordinates.x;
		let y = coordinates.y;
		return x < this.fieldSize && y < this.fieldSize && this.cells[x][y].state === CellStates.empty;
	}
}