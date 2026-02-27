"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosineSimilarity = cosineSimilarity;
exports.searchChunks = searchChunks;
function cosineSimilarity(vecA, vecB) {
    var dotProduct = 0;
    var normA = 0;
    var normB = 0;
    for (var i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
function searchChunks(queryEmbedding, chunks, topK) {
    if (topK === void 0) { topK = 5; }
    return chunks
        .map(function (chunk) { return (__assign(__assign({}, chunk), { score: cosineSimilarity(queryEmbedding, chunk.embedding) })); })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, topK);
}
