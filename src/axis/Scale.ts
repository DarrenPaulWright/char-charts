import type { IBandDomain, IChartDataInternal, INumericDomain } from '../types';

export default abstract class Scale {
	private _size = 0;

	protected _isGrouped = false;

	minTickOffset = 7;
	domain: INumericDomain | Array<IBandDomain> = [0, 1];
	start = 0;
	end = 0;
	tickValue = 0;
	shouldGetTickValue = true;
	shouldGetStart = true;
	shouldGetEnd = true;
	maxLabelWidth = 0;
	showFullRange = true;

	constructor(data: Array<IChartDataInternal>, showFullRange = true) {
		this.showFullRange = showFullRange;
		this.processData(data);
	}

	get size(): number {
		return this._size;
	}

	set size(size: number) {
		this._size = size;
		this.setRange();
	}

	private getValue = (data: IChartDataInternal, isMin: boolean, origin: number): number => {
		if (Array.isArray(data.value)) {
			return data.value.reduce<number>((result, item) => result + item, 0);
		}

		if (data.value !== undefined) {
			return data.value;
		}

		if (data.data) {
			if (this.showFullRange) {
				return data.data[isMin ? 'first' : 'last']() as number ?? origin;
			}

			return data[isMin ? 'min' : 'max'] ?? origin;
		}

		return origin;
	};

	protected processData(data: Array<IChartDataInternal>): void {
		if (data.length > 1) {
			this.domain = data.reduce<INumericDomain>((result, value) => {
				result[0] = Math.min(result[0], this.getValue(value, true, result[0]));
				result[1] = Math.max(result[1], this.getValue(value, false, result[1]));

				return result;
			}, [Infinity, -Infinity]);
		}
		else if (data.length === 1) {
			const value1 = this.getValue(data[0], true, 0);
			const value2 = this.getValue(data[0], false, 0);

			if (value1 !== value2) {
				this.domain = [value1, value2];
			}
			else if (value1) {
				this.domain = [0, value1];
			}
			else {
				this.domain = [0, 1];
			}
		}

		if (this.domain[0] === 0 && this.domain[1] === 0) {
			this.domain = [0, 1];
		}
	}

	abstract setRange(): void;

	abstract ticks(): Array<number>;

	isGrouped(): boolean {
		return this._isGrouped;
	}
}
