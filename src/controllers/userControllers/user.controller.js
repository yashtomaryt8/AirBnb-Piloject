const User = require('../../models/userModels/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { resetPasswordTemplate } = require('../../utils/emailTemplate')
const sendEmail = require('../../utils/email')
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
    const token = req.cookies.token;
    if (!token) {
      return next(new CustomError('No token found', 401));
    }
    const isBlacklisted = await cacheClient.get(token);
    if (isBlacklisted) {
      return next(new CustomError('Token is blacklisted', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -__v');
    if (!user) {
      return next(new CustomError('User not found', 404));
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
}

const updateUserProfile = async (req, res, next) => {
  try {
    const { username, email, mobile, address, newPassword } = req.body

    const user = await User.findOne({ email: req.user.email })

    if (!user) {
      return next(new CustomError('User not found', 404))
    }

    if (username) {
      user.username = username
    }
    if (email) {
      user.email = email
    }
    if (mobile) {
      user.mobile = mobile
    }
    if (address) {
      user.address = address
    }
    
    await user.save()
    
    const newToken = await user.generateAuthToken()


    if (!newToken && newPassword) {
      return next(new CustomError('Token not generated', 500))
    }

    res.cookie('token', newToken, {
      httpOnly: true,
      sameSite: 'none'
    })

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address
      },
      token: newToken
    })
  }
  catch (error) {
    console.log('Error updating profile ',error);
    return next(new CustomError(error.message, 500));
  }
}

const resetPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return next(new CustomError('Email is required', 400))
    }

    const user = await User.findOne({ email })

    if (!user) {
      return next(new CustomError('User not found', 404))
    }

    const rawToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    const resetLink = `http://localhost/api/user/reset-password/${rawToken}`

    const emailTemplate = resetPasswordTemplate(user.username, resetLink)
  
    sendEmail(
      "yashtomar.yt8@gmail.com",  // req.user.email, // Uncomment this line to send email to the user
      'Reset Password',
      emailTemplate
    ).catch(err => console.error('📧 Email failed:', err.message));

    res.status(200).json({
      success: true,
      message: 'Reset password link sent to your email'
    })
  }
  catch (error) {
    console.log('Error sending reset password email ',error);
    return next(new CustomError(error.message, 500));
  }
}

// to check blacklist token
// first register -> login copy the token -> logout -> paste the token in currentUser postman and check the response

module.exports = {
  registerController,
  loginController,
  logoutController,
  currentUserController,
  updateUserProfile,
  resetPasswordController
};

