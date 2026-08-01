/**
 * Helper utility to attach a signed JWT to an HTTP-Only cookie.
 * @param {Object} res - Express response object
 * @param {String} token - Signed JWT token
 */
export const sendTokenResponse = (res, token) => {
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('token', token, options);
};
