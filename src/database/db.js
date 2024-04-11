import mongoose from "mongoose";

try {
    await mongoose.connect("mongodb://localhost/gallery");
} catch (error) {
    console.log(error);
}
