exports.toDto = (user) => {
  if (!user) return null;
  return {
    _id: user._id,
    email: user.email,
  };
}; 