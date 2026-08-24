class LabelGenerationUtil {
  constructor(config) {
    this.config = config || {};
    this.closeColumnIndex = config.closeColumnIndex || 4;
    this.lookforwardBars = config.lookforwardBars || 5;
    this.buyThreshold = config.buyThreshold || 0.01;
    this.sellThreshold = config.sellThreshold || -0.01;
  }

  execute(data) {
    if (!data || data.length === 0) {
      return [];
    }
    var labels = [];
    var index = 0;
    var maxIndex = data.length - this.lookforwardBars;
    while (index < maxIndex) {
      var currentClose = data[index][this.closeColumnIndex];
      var futureClose = data[index + this.lookforwardBars][this.closeColumnIndex];
      var futureReturn = (futureClose - currentClose) / currentClose;
      var label = 0;
      if (futureReturn > this.buyThreshold) {
        label = 1;
      } else {
        if (futureReturn < this.sellThreshold) {
          label = -1;
        }
      }
      labels.push(label);
      index = index + 1;
    }
    var paddingIndex = maxIndex;
    while (paddingIndex < data.length) {
      labels.push(0);
      paddingIndex = paddingIndex + 1;
    }
    return labels;
  }

  calculateFutureReturn(data, index) {
    var futureIndex = index + this.lookforwardBars;
    if (futureIndex >= data.length) {
      return 0;
    }
    var currentClose = data[index][this.closeColumnIndex];
    var futureClose = data[futureIndex][this.closeColumnIndex];
    return (futureClose - currentClose) / currentClose;
  }
}

module.exports = LabelGenerationUtil;