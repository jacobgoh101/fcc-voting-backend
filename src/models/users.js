import mongoose from "mongoose";
import findOneOrCreate from "mongoose-find-one-or-create";

const userSchema = mongoose.Schema({
  email: { type: String, trim: true },
  google_id: { type: String, trim: true }
});
userSchema.plugin(findOneOrCreate);
// export default userSchema;
export default mongoose.model("User", userSchema);
