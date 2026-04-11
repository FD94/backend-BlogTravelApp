const router = require("express").Router();
const Post = require("../models/Post.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/posts", isAuthenticated, async (req, res) => {
	const { title, description, image } = req.body;

	try {
		const newPost = await Post.create({
			title,
			description,
			image,
			author: req.payload._id,
		});
		res.status(201).json(newPost);
	} catch (error) {
		console.log("Error creating the next post", error);
		res.status(500).json({ Error: "Failed to create the new post" });
	}
});

router.get("/posts", async (req, res) => {
	try {
		const listOfPost = await Post.find();
		res.status(200).json(listOfPost);
	} catch (error) {
		console.log("Error to getting the list of post", error);
		res.status(500).json({ Error: "Failed to get the list of post" });
	}
});

router.get("/posts/:postId", isAuthenticated, async (req, res) => {
	const { postId } = req.params;

	try {
		const specificPost = await Post.findById(postId);
		res.status(200).json(specificPost);
	} catch (err) {
		console.log("Error to getting an specific post", err);
		res.status(500).json({ Error: "Failed to get an specific post " });
	}
});

router.put("/posts/:postId", isAuthenticated, async (req, res) => {
	const { postId } = req.params;
	const update = req.body;

	try {
		const postUpdated = await Post.findByIdAndUpdate(postId, update, {
			new: true,
			runValidators: true,
		});

		if (!postUpdated) {
			return res.status(404).json({ message: "Post no encontrado" });
		}

		res.status(200).json(postUpdated);
	} catch (error) {
		console.log("Error to updating the post...", error);
		res.status(500).json({ Error: "Failed to updated the post..." });
	}
});

router.delete("/posts/:postId", isAuthenticated, async (req, res) => {
	const { postId } = req.params;

	try {
		const postDeleted = await Post.findByIdAndDelete(postId);
		res.status(200).json(postDeleted);
	} catch (error) {
		console.log("Error to deleting the post...", error);
		res.status(500).json({ Error: "Failed to deleting the post..." });
	}
});

module.exports = router;
