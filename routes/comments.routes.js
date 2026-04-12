const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Comment = require("../models/Comment.model");

router.post("/comments", isAuthenticated, async (req, res) => {
	const { text, post } = req.body;

	try {
		if (!text) {
			return res.status(422).json({ message: "El texto es obligatorio" });
		}

		const newComment = await Comment.create({
			text,
			post,
			author: req.payload._id,
		});
		const populatedComment = await newComment.populate("post author");

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
		const allComments = await Comment.find({ post: postId })
			.populate("author")
			.populate("post");

		res.status(200).json(allComments);
	} catch (error) {
		console.log("Error to getting all comments in this post...", error);
		res.status(500).json({ Error: "Failed to get all comment in this post" });
	}
});

router.delete("/comments/:commentId", isAuthenticated, async (req, res) => {
	const { commentId } = req.params;

	try {
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comentario no encontrado" });
		}

		// 👇 comprobación de dueño
		if (comment.author.toString() !== req.payload._id) {
			return res
				.status(403)
				.json({ message: "No tienes permiso para borrar este comentario" });
		}

		await Comment.findByIdAndDelete(commentId);

		res.status(200).json({ message: "Comentario eliminado" });
	} catch (error) {
		console.log("Error deleting comment", error);
		res.status(500).json({ message: "Error deleting comment" });
	}
});

module.exports = router;
