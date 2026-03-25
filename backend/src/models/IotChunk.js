const mongoose = require("mongoose");

const IotChunkSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation", required: true },
  data: { type: Buffer, required: true },
  chunkIndex: { type: Number, required: true },
}, { timestamps: true });

IotChunkSchema.index({ consultationId: 1, chunkIndex: 1 });

module.exports = mongoose.model("IotChunk", IotChunkSchema);
