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
      secret: 'yourSecretGoesHere',
    });
  },

  async register(req, res) {
    const {
      nickname, city, email, password, confirmPassword,
    } = req.body;

    if (!nickname || !city || !email || !password || !confirmPassword) {
      res.status(400).json({ msg: 'Tous les champs sont requis !' });
      return;
    }

    if (req.body.password !== req.body.confirmPassword) {
      res.status(401).json({ msg: 'Les deux mots de passes ne sont pas indentiques !' });
      return;
    }

    const isUserExist = await User.findOne({
      where: {
        email,
      },
    });

    if (isUserExist) {
      res.status(400).json({ msg: 'Cet utilisateur existe déjà' });
      return;
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

    delete createdUser.password;

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
      res.status(400).json({ msg: 'Utilisateur introuvable' });
      return;
    }

    user = user.get();

    const goodPassword = await argon2.verify(user.password, password);

    if (!goodPassword) {
      res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
      return;
    }
    const token = auth.generateToken(user);

    // const userUUID = generateRedisKey(user, token);

    auth.generateCookie(res, 'token', token);

    delete user.password;

    res.json(user);
  },

  logout(req, res) {
    const { token } = req.signedCookies;

    if (!token) {
      res.status(401).json({ msg: 'Le token n\'existe pas' });
      return;
    }

    // redis.del(token);

    res.clearCookie('token');

    res.json({ msg: 'déconnecté' });
  },
};

module.exports = auth;
