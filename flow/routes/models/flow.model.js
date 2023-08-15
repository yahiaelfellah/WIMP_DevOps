const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.mongoDbUrl, {
  useUnifiedTopology: true,
  bufferCommands: true,
  useNewUrlParser: true,
  autoCreate: true,
});

const Schema = mongoose.Schema;

const flowSchema = new Schema({
  userId: String,
  pid: Number, 
  port : Number,
  data: String,
  address : String,
});

flowSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

flowSchema.set("toJSON", {
  virtuals: true,
});

flowSchema.findById = function (cb) {
  return this.model("flows").find({ userId: this.id }, cb);
};

const Flow = mongoose.model("flows", flowSchema);

exports.findById = (id) => {
  return Flow.findOne({ userId: id }).then((result) => {
    return result;
  });
};

exports.create = async (data) => { 
  const flow = new Flow(data);
  try {
    return await flow.save();
  } catch (err) {
    return Promise.resolve(null);
  }
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Flow.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};

exports.patchFlowByUserId = (id, data) => {
  return Flow.findOneAndUpdate(
    {
      userId: id,
    },
    data,
    {
      returnOriginal: true,
    }
  );
};
