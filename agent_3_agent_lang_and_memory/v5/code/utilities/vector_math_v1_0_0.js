// vector_math.js
// Vector math utility for distance and similarity

class vector_math {
  constructor(config = {}) {
    this.config = config;
  }

  distance(vector_a, vector_b) {
    if (!vector_a || !vector_b) return 0;
    if (vector_a.length !== vector_b.length) return 0;
    let sum = 0;
    for (let i = 0; i < vector_a.length; i++) {
      const diff = vector_a[i] - vector_b[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  similarity(vector_a, vector_b) {
    if (!vector_a || !vector_b) return 0;
    if (vector_a.length !== vector_b.length) return 0;
    let dot = 0, mag_a = 0, mag_b = 0;
    for (let i = 0; i < vector_a.length; i++) {
      dot += vector_a[i] * vector_b[i];
      mag_a += vector_a[i] * vector_a[i];
      mag_b += vector_b[i] * vector_b[i];
    }
    const denom = Math.sqrt(mag_a) * Math.sqrt(mag_b);
    return denom === 0 ? 0 : dot / denom;
  }

  distance_batch(query, candidates) {
    return candidates.map(c => ({ id: c.id, distance: this.distance(query, c.vector) }));
  }

  similarity_batch(query, candidates) {
    return candidates.map(c => ({ id: c.id, similarity: this.similarity(query, c.vector) }));
  }
}

export default vector_math;
export { vector_math };
