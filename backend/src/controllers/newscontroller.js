import News from "../models/news.models.js";

export const getAllNews = async (req, res) => {
  try {
    const { category } = req.params;

    let query = {};
    if (category && category !== "all") {
      query.category = category;
    }

    const news = await News.find(query).sort({ createdAt: -1 });

    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getNewsById = async (req, res) => {
  try {
    const { id } = req.body;
    const news = await News.findById(id); // Get news by ID
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createNews = async (req, res) => {
  console.log("Creating news:", req.body);

  try {
    const { title, content, category } = req.body;

    // Create and save the news document
    const news = new News({ title, content, category });
    await news.save();

    // Emit real-time news update to all clients in the category room
    const io = req.app.get("io"); // Get io instance from app
    console.log("📢 Emitting to category:", category);
    io.to(category).emit("new-news", news);
    console.log("📢 Emitted to category:", category);
    res.status(201).json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.body; // Get the ID from the request body
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const news = await News.findByIdAndDelete(id); // Delete news by ID
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
