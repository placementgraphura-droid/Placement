import mongoose from "mongoose";

const interndataSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
  },
);


const Interndata = mongoose.model("interndata", interndataSchema, "interndata");

export default Interndata;
