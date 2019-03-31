module.exports = {
  formatNumber: function(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  },

  toSecondDecimalPoint: function(num) {
    if (num >= 10 || num <= -10) {
      return Math.round(num);
    } else {
      return Math.round(num * 100) / 100;
    }
  }
};
