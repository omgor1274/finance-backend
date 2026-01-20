import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import app from "./app";
import mongoose from "mongoose";


app.set("trust proxy", 1);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
