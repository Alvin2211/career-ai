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

const interviewRpmLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,       
  max: 5,                          
  message: { error: "Too many requests. Try again after 1 minute." },
  standardHeaders: true,
  legacyHeaders: false,
});

const interviewRpdLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 20,                         
  message: { error: "Daily interview limit reached. Try again tomorrow." },
  standardHeaders: true,
  legacyHeaders: false,
});

const interviewLimiter = (req, res, next) => {
  interviewRpmLimiter(req, res, (err) => {
    if (err) return next(err);
    interviewRpdLimiter(req, res, next);
  });
};

export { roadmaplimiter, resumelimiter, interviewLimiter };