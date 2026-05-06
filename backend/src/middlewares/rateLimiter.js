import rateLimit from "express-rate-limit";

const roadmaplimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many requests. Try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const resumelimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    error: "Too many requests. Try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { roadmaplimiter, resumelimiter };