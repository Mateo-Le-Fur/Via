const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { User } = require('../models');
const getCoordinates = require('../services/getCoordinates');
const ApiError = require('../errors/apiError');
// const generateRedisKey = require('../services/generateUserToken');
// const redis = require('../config/redis');

const auth = {

  generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRE}s` });
  },

  generateCookie(res, name, value) {
    res.cookie(name, value, {
      httpOnly: true,
      signed: true,
      secret: process.env.COOKIE_SECRET,
    });
  },

  async register(req, res) {
    const {
      nickname, city, email, password,
    } = req.body;

    const isUserExist = await User.findOne({
      where: {
        email,
      },
    });

    if (isUserExist) {
      throw new ApiError('Cet utilisateur existe déjà', 400);
    }

    delete req.body.confirmPassword;

    const hashPassword = await argon2.hash(password);

    const coordinates = await getCoordinates(city);

    let createdUser = await User.create({
      email,
      password: hashPassword,
      nickname,
      city,
      lat: coordinates[0],
      long: coordinates[1],
    });

    createdUser = createdUser.get();

    createdUser = { userId: createdUser.id, lat: createdUser.lat, long: createdUser.long };

    const token = auth.generateToken(createdUser);

    // const userUUID = generateRedisKey(createdUser, token);

    auth.generateCookie(res, 'token', token);

    res.json(createdUser);
  },

  async login(req, res) {
    const { email, password } = req.body;

    let user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError('Utilisateur introuvable', 400);
    }
    user = user.get();

    const isGoodPassword = await argon2.verify(user.password, password);

    if (!isGoodPassword) {
      throw new ApiError('Email ou mot de passe incorrect', 400);
    }

    user = { id: user.id, lat: user.lat, long: user.long };

    const token = auth.generateToken(user);

    // const userUUID = generateRedisKey(user, token);

    auth.generateCookie(res, 'token', token);

    delete user.password;

    res.json(user);
  },

  logout(req, res) {
    const { token } = req.signedCookies;

    if (!token) {
      throw new ApiError('Aucun token existant', 500);
    }

    // redis.del(token);

    res.clearCookie('token');

    res.json({ msg: 'déconnecter' });
  },
};

module.exports = auth;
