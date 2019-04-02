const kFormatter = (num: number):string => num >= 1000 ? (num/1000).toFixed(1) + 'k' : num.toString();

module.exports = { kFormatter }
