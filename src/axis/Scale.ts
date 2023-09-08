import type { IBandDomain, IChartDataInternal, INumericDomain } from '../types';

const getValue = (value: IChartDataInternal, loc: 'first' | 'last', origin: number): number => {
	if (value.value !== undefined) {
		return value.value;
	}
	else if (value.data && value.data[loc]() !== undefined) {
		return value.data[loc]() as number;
	}

	return origin;
};

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

	constructor(data: Array<IChartDataInternal>) {
		this.processData(data);
	}

	get size(): number {
		return this._size;
	}

	set size(size: number) {
		this._size = size;
		this.setRange();
	}

	protected processData(data: Array<IChartDataInternal>): void {
		if (data.length > 1) {
			this.domain = data.reduce<INumericDomain>((result, value) => {
				result[0] = Math.min(result[0], getValue(value, 'first', result[0]));
				result[1] = Math.max(result[1], getValue(value, 'last', result[1]));

				return result;
			}, [Infinity, -Infinity]);
		}
		else if (data.length === 1) {
			const value1 = getValue(data[0], 'first', 0);
			const value2 = getValue(data[0], 'last', 0);

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
	}

	abstract setRange(): void;

	abstract ticks(): Array<number>;

	isGrouped(): boolean {
		return this._isGrouped;
	}
}
