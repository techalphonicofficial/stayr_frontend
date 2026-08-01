import { asyncHandler } from '../utils/asyncHandler.js';

export const getHealth = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running successfully"
  });
});
