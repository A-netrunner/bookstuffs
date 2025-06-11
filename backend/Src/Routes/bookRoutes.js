import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Books.js"; // Adjust the path as necessary
import protectRoute from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //upload img to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl, // Save the URL of the uploaded image
      user: req.user._id,
      //
      //  // Assuming you have user authentication and req.user contains the user ID
    });
    await newBook.save();
    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.log("Error creating book:", error);

    res.status(500).json({ message: "Error creating book", error });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profilepic"); // Populate the user field with name and email

    const totalbooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalbooks,
      totalPages: Math.ceil(totalbooks / limit),
    });
  } catch (error) {
    console.log("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books", error });
  }
});

//books posted by usr in profile page

router.get("/users", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.log("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books", error });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const Book = await Book.findById(req.params.id);
    if (!Book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (Book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this book" });
    }

    //delete image from cloudinary before deleting the book(s)
    if (Book.image && Book.image.include("cloudinary")) {
      try {
        const publicId = Book.image.split("/").pop().split(".")[0]; // Extract the public ID from the URL
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      } catch (error) {
        console.log("Error deleting image from cloudinary:", error);
      }
    }
    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error deleting book:", error);
    res.status(500).json({ message: "Error deleting book", error });
  }
});
export default router;
