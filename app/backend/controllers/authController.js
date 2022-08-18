const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { User } = require('../models');
const getCoordinates = require('../services/getCoordinates');
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

    delete req.body.confirm_password;

    const hashPassword = await argon2.hash(password);

    let createdUser = await User.create({
      email,
      password: hashPassword,
      nickname,
      city,
    });

    createdUser = createdUser.get();

    const coordinates = await getCoordinates(createdUser.city);

    createdUser = { ...createdUser, coordinates };

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

    user = user.get();

    if (!user) {
      res.status(400).json({ msg: 'Utilisateur introuvable' });
      return;
    }

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

  async logout(req, res) {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({ msg: 'Le token n\'existe pas' });
      return;
    }

    // redis.del(token);

    res.clearCookie(token);
  },
};

module.exports = auth;
