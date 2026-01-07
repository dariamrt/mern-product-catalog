const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Not authorized as admin',
  });
};

export { admin };