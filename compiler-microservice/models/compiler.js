const mongoose = require("mongoose");

const CompilerSchema = mongoose.Schema({
    language: {
    type: String,
    required: true,
    enum: ["js","cpp", "py"],
    },
    filepath: {
    type: String,
    required: true,
    },
    submittedAt: {
    type: Date,
    default: Date.now,
    },
    startedAt: {
    type: Date,
    },
    completedAt: {
    type: Date,
    },
    status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
    },
    output: {
    type: String,
    },
});

// default export
module.exports = mongoose.model("Compiler", CompilerSchema);