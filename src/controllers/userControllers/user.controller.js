const User = require('../../models/userModels/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cacheClient = require('../../services/cache.services')
const CustomError = require('../../utils/customError')


const registerController = async (req, res, next) => {
  const { username, email, mobile, address, password, isAdmin } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new CustomError('User already exists', 400))
    }

    const user = await User.create({
      username,
      email,
      mobile,
      address,
      password,
      isAdmin
    })

    const token = await user.generateAuthToken();
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none'
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        isAdmin: user.isAdmin
      },
      token
    })

  } catch (error) {
    next(new CustomError(error.message, 500));
  }
}

const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.authenticateUser(email, password);
    const token = await user.generateAuthToken();

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none'
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address
      },
      token
    });

  } catch (error) {
    // return next(new CustomError(error.message, 401));
    return next(new CustomError(error.message || 'Invalid credentials', 401));
  }
}

const logoutController = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token) {
      return next(new CustomError('No token found', 401));
    }
    const blacklistToken = await cacheClient.set(token, true, 'EX', 3600); // 1 hour expiration time
    if (blacklistToken !== 'OK') {
      return next(new CustomError('Failed to blacklist token', 500));
    }
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none'
    });
    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
}

const currentUserController = async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return next(new CustomError('User not found', 404));
    }
    res.status(200).json({
      message: 'User found successfully',
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address
      }
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
}

// to check blacklist token
// first register -> login copy the token -> logout -> paste the token in currentUser postman and check the response

module.exports = {
  registerController,
  loginController,
  logoutController,
  currentUserController
};

