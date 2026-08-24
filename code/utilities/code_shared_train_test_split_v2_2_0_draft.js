class TrainTestSplitUtil {
  constructor(config) {
    this.config = config || {};
    this.trainRatio = config.trainRatio || 0.8;
    this.testRatio = config.testRatio || 0.2;
    this.shuffle = config.shuffle || false;
    this.seed = config.seed || null;
  }

  execute(data) {
    if (!data || data.length === 0) {
      return { train: [], test: [], train_indices: [], test_indices: [] };
    }
    var indices = [];
    var index = 0;
    var count = data.length;
    while (index < count) {
      indices.push(index);
      index = index + 1;
    }
    if (this.shuffle) {
      indices = this.shuffleArray(indices);
    }
    var splitPoint = Math.floor(data.length * this.trainRatio);
    var trainIndices = [];
    var testIndices = [];
    index = 0;
    while (index < indices.length) {
      if (index < splitPoint) {
        trainIndices.push(indices[index]);
      } else {
        testIndices.push(indices[index]);
      }
      index = index + 1;
    }
    var train = [];
    var trainIdxIndex = 0;
    while (trainIdxIndex < trainIndices.length) {
      train.push(data[trainIndices[trainIdxIndex]]);
      trainIdxIndex = trainIdxIndex + 1;
    }
    var test = [];
    var testIdxIndex = 0;
    while (testIdxIndex < testIndices.length) {
      test.push(data[testIndices[testIdxIndex]]);
      testIdxIndex = testIdxIndex + 1;
    }
    return {
      train: train,
      test: test,
      train_indices: trainIndices,
      test_indices: testIndices
    };
  }

  shuffleArray(array) {
    var result = [];
    var index = 0;
    var count = array.length;
    while (index < count) {
      result.push(array[index]);
      index = index + 1;
    }
    var currentIndex = result.length - 1;
    while (currentIndex > 0) {
      var randomIndex = Math.floor(Math.random() * (currentIndex + 1));
      var temp = result[currentIndex];
      result[currentIndex] = result[randomIndex];
      result[randomIndex] = temp;
      currentIndex = currentIndex - 1;
    }
    return result;
  }

  executeWithLabels(data, labels) {
    if (!data || data.length === 0) {
      return {
        train_data: [],
        test_data: [],
        train_labels: [],
        test_labels: [],
        train_indices: [],
        test_indices: []
      };
    }
    var indices = [];
    var index = 0;
    var count = data.length;
    while (index < count) {
      indices.push(index);
      index = index + 1;
    }
    if (this.shuffle) {
      indices = this.shuffleArray(indices);
    }
    var splitPoint = Math.floor(data.length * this.trainRatio);
    var trainIndices = [];
    var testIndices = [];
    index = 0;
    while (index < indices.length) {
      if (index < splitPoint) {
        trainIndices.push(indices[index]);
      } else {
        testIndices.push(indices[index]);
      }
      index = index + 1;
    }
    var trainData = [];
    var trainLabels = [];
    var trainIdxIndex = 0;
    while (trainIdxIndex < trainIndices.length) {
      trainData.push(data[trainIndices[trainIdxIndex]]);
      if (labels && labels.length > trainIndices[trainIdxIndex]) {
        trainLabels.push(labels[trainIndices[trainIdxIndex]]);
      }
      trainIdxIndex = trainIdxIndex + 1;
    }
    var testData = [];
    var testLabels = [];
    var testIdxIndex = 0;
    while (testIdxIndex < testIndices.length) {
      testData.push(data[testIndices[testIdxIndex]]);
      if (labels && labels.length > testIndices[testIdxIndex]) {
        testLabels.push(labels[testIndices[testIdxIndex]]);
      }
      testIdxIndex = testIdxIndex + 1;
    }
    return {
      train_data: trainData,
      test_data: testData,
      train_labels: trainLabels,
      test_labels: testLabels,
      train_indices: trainIndices,
      test_indices: testIndices
    };
  }
}

module.exports = TrainTestSplitUtil;