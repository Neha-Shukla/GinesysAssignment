const jwt = require('jsonwebtoken');

// Secret key for JWT
const secretKey = process.env.JWT_SECRET || 'defaultKey123';


// Generate a token for the user
exports.generateToken = (req, res) => {
  try {
    const token = jwt.sign(
      {
        email: req.body.email,
      },
      secretKey,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({
      message: 'Token generated successfully',
      token,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};
