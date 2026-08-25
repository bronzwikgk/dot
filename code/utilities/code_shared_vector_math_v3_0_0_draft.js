/**
 * @entity vector_math
 * @meta project: shared | file_name: code_shared_vector_math_v3_0_0_draft.js | version: 3.0.0 | status: draft | author: ox-alpha
 * @objective provide euclidean distance and cosine similarity for equal-length numeric vectors, single and batch.
 * @purpose_and_problem_statement find_information and manage_entities intents need one coherent vector comparison surface; two sibling files duplicated guards and batch loops.
 * @usage const vm_util = new vector_math_util(); vm_util.distance([1,2],[2,3]); vm_util.similarity_batch(t, candidates);
 * @timing used by search ranking and dedup passes.
 * @scope_boundaries in_scope: distance, similarity, batch variants. out_of_scope: sparse vectors, weighted metrics.
 * @dependencies none.
 * @keywords vector, distance, similarity, euclidean, cosine
 * @invariants returns 0 for null, mismatched length, or zero-magnitude inputs; never mutates its arguments.
 * @changelog - 2026-08-24: 3.0.0: merged code_shared_euclidean_distance_v2_2_0_draft + code_shared_cosine_similarity_v2_2_0_draft into one survivor; behavior preserved exactly
 */
export class vector_math_util {
  constructor(config = {}) {
    this.config = config || {};
  }

  distance(vector_a, vector_b) {
    if (!vector_a || !vector_b) {
      return 0;
    }
    if (vector_a.length !== vector_b.length) {
      return 0;
    }
    var sum_squared_diffs = 0;
    var index = 0;
    var count = vector_a.length;
    while (index < count) {
      var diff = vector_a[index] - vector_b[index];
      sum_squared_diffs = sum_squared_diffs + (diff * diff);
      index = index + 1;
    }
    return Math.sqrt(sum_squared_diffs);
  }

  similarity(vector_a, vector_b) {
    if (!vector_a || !vector_b) {
      return 0;
    }
    if (vector_a.length !== vector_b.length) {
      return 0;
    }
    var dot_product = 0;
    var magnitude_a = 0;
    var magnitude_b = 0;
    var index = 0;
    var count = vector_a.length;
    while (index < count) {
      dot_product = dot_product + (vector_a[index] * vector_b[index]);
      magnitude_a = magnitude_a + (vector_a[index] * vector_a[index]);
      magnitude_b = magnitude_b + (vector_b[index] * vector_b[index]);
      index = index + 1;
    }
    magnitude_a = Math.sqrt(magnitude_a);
    magnitude_b = Math.sqrt(magnitude_b);
    if (magnitude_a === 0 || magnitude_b === 0) {
      return 0;
    }
    return dot_product / (magnitude_a * magnitude_b);
  }

  distance_batch(target_vector, candidate_vectors) {
    if (!candidate_vectors || candidate_vectors.length === 0) {
      return [];
    }
    var distances = [];
    var index = 0;
    var count = candidate_vectors.length;
    while (index < count) {
      distances.push(this.distance(target_vector, candidate_vectors[index]));
      index = index + 1;
    }
    return distances;
  }

  similarity_batch(target_vector, candidate_vectors) {
    if (!candidate_vectors || candidate_vectors.length === 0) {
      return [];
    }
    var similarities = [];
    var index = 0;
    var count = candidate_vectors.length;
    while (index < count) {
      similarities.push(this.similarity(target_vector, candidate_vectors[index]));
      index = index + 1;
    }
    return similarities;
  }

  execute(vector_a, vector_b) {
    return this.distance(vector_a, vector_b);
  }

  execute_batch(target_vector, candidate_vectors) {
    return this.distance_batch(target_vector, candidate_vectors);
  }
}

export default vector_math_util;
