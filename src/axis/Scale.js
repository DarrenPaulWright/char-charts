const getValue = (value, loc, origin) => {
    if (value.value !== undefined) {
        return value.value;
    }
    else if (value.data && value.data[loc]() !== undefined) {
        return value.data[loc]();
    }
    return origin;
};
export default class Scale {
    _size = 0;
    _isGrouped = false;
    minTickOffset = 7;
    domain = [0, 1];
    start = 0;
    end = 0;
    tickValue = 0;
    shouldGetTickValue = true;
    shouldGetStart = true;
    shouldGetEnd = true;
    maxLabelWidth = 0;
    constructor(data) {
        this.processData(data);
    }
    get size() {
        return this._size;
    }
    set size(size) {
        this._size = size;
        this.setRange();
    }
    processData(data) {
        if (data.length > 1) {
            this.domain = data.reduce((result, value) => {
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
    isGrouped() {
        return this._isGrouped;
    }
}
