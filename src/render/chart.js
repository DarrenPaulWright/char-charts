import processSettings from './processSettings.js';
export default (settings, RowClass) => {
    let output = [];
    const internalSettings = processSettings(settings);
    const row = new RowClass(internalSettings);
    if (internalSettings.title) {
        output.push(row.title());
    }
    output.push(row.top());
    internalSettings.yAxis.domain()
        .forEach((value) => {
        row.preProcess(value);
    });
    internalSettings.yAxis.domain()
        .forEach((value, index) => {
        if (!internalSettings.yAxis.scale.isGrouped() || index !== 0) {
            output = output.concat(...row.render(value));
        }
    });
    output.push(row.bottom(), row.bottomLabels());
    if (internalSettings.xAxis.label) {
        output.push(row.xAxisLabel());
    }
    return output;
};
