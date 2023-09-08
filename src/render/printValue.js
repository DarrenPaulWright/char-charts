export default (value, desiredFractionDigits = 0) => {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: desiredFractionDigits,
        maximumFractionDigits: desiredFractionDigits
    });
};
