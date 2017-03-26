var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/201613chat");
var MessageSchema = new mongoose.Schema({
    username: String,
    content: String,
    createAt: { type: Date, default: Date.now }
});
exports.Message = mongoose.model("Message", MessageSchema);

//# sourceMappingURL=model-compiled.js.map