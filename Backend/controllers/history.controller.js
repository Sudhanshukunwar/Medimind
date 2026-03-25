import { History } from "../models/history.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all history for the logged-in user
const getUserHistory = asyncHandler(async (req, res) => {
    const history = await History.find({ owner: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, history, "History fetched successfully")
    );
});

// Get analytics stats (How many of each test)
const getHistoryStats = asyncHandler(async (req, res) => {
    const stats = await History.aggregate([
        { $match: { owner: req.user._id } },
        { $group: { _id: "$testType", count: { $sum: 1 } } }
    ]);

    return res.status(200).json(
        new ApiResponse(200, stats, "Stats fetched successfully")
    );
});

export { getUserHistory, getHistoryStats };