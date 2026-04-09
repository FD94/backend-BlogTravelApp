const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Comment = require("../models/Comment.model");

router.post("/comments", isAuthenticated, async (req, res) => {
	const { text, author, post } = req.body;

	try {
		if (!text) {
			return res.status(422).json({ message: "El texto es obligatorio" });
		}

		const newComment = await Comment.create({ text, author, post });
		const populatedComment = await newComment.populate("author post");
		res.status(201).json(populatedComment);
	} catch (error) {
		console.log("Error creating comment...", error);

		res.status(500).json({
			message: error.message,
		});
	}
});

router.get("/comments/:postId", async (req, res) => {
	const { postId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return res.status(400).json({ message: "ID inválido" });
	}

	try {
		const allComments = await Comment.find({ postId })
			.populate("author")
			.populate("post");

		res.status(200).json(allComments);
	} catch (error) {
		console.log("Error to getting all comments in this post...", error);
		res.status(500).json({ Error: "Failed to get all comment in this post" });
	}
});

module.exports = router;
