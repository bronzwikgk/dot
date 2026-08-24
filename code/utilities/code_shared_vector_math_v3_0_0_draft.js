/**
 * @entity vector_math
 * @meta project: shared | file_name: code_shared_vector_math_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide euclidean distance and cosine similarity for equal-length numeric vectors, single and batch.
 * @purpose_and_problem_statement find_information and manage_entities intents need one coherent vector comparison surface; two sibling files duplicated guards and batch loops.
 * @usage const vm_util = new VectorMathUtil(); vm_util.distance([1,2],[2,3]); vm_util.similarityBatch(t, candidates);
 * @timing used by search ranking and dedup passes.
 * @scope_boundaries in_scope: distance, similarity, batch variants. out_of_scope: sparse vectors, weighted metrics.
 * @dependencies none.
 * @keywords vector, distance, similarity, euclidean, cosine
 * @invariants returns 0 for null, mismatched length, or zero-magnitude inputs; never mutates its arguments.
 * @changelog - 2026-08-24: 3.0.0: merged code_shared_euclidean_distance_v2_2_0_draft + code_shared_cosine_similarity_v2_2_0_draft into one survivor; behavior preserved exactly
 */
export class VectorMathUtil {
  constructor(config) {
    this.config = config || {};
  }

  distance(vectorA, vectorB) {
    if (!vectorA || !vectorB) {
      return 0;
    }
    if (vectorA.length !== vectorB.length) {
      return 0;
    }
    var sumSquaredDiffs = 0;
    var index = 0;
    var count = vectorA.length;
    while (index < count) {
      var diff = vectorA[index] - vectorB[index];
      sumSquaredDiffs = sumSquaredDiffs + (diff * diff);
      index = index + 1;
    }
    return Math.sqrt(sumSquaredDiffs);
  }

  similarity(vectorA, vectorB) {
    if (!vectorA || !vectorB) {
      return 0;
    }
    if (vectorA.length !== vectorB.length) {
      return 0;
    }
    var dotProduct = 0;
    var magnitudeA = 0;
    var magnitudeB = 0;
    var index = 0;
    var count = vectorA.length;
    while (index < count) {
      dotProduct = dotProduct + (vectorA[index] * vectorB[index]);
      magnitudeA = magnitudeA + (vectorA[index] * vectorA[index]);
      magnitudeB = magnitudeB + (vectorB[index] * vectorB[index]);
      index = index + 1;
    }
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }
    return dotProduct / (magnitudeA * magnitudeB);
  }

  distanceBatch(targetVector, candidateVectors) {
    var distances = [];
    var index = 0;
    var count = candidateVectors.length;
    while (index < count) {
      distances.push(this.distance(targetVector, candidateVectors[index]));
      index = index + 1;
    }
    return distances;
  }

  similarityBatch(targetVector, candidateVectors) {
    var similarities = [];
    var index = 0;
    var count = candidateVectors.length;
    while (index < count) {
      similarities.push(this.similarity(targetVector, candidateVectors[index]));
      index = index + 1;
    }
    return similarities;
  }

  execute(vectorA, vectorB) {
    return this.distance(vectorA, vectorB);
  }

  executeBatch(targetVector, candidateVectors) {
    return this.distanceBatch(targetVector, candidateVectors);
  }
}

export default VectorMathUtil;
