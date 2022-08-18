const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const axios = require('axios').default;
const User = require('../models/User');
const generateRedisKey = require('../services/generateUserToken');
const redis = require('../config/redis');

const auth = {

  generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRE}s` });
  },

  generateCookie(res, name, value) {
    res.cookie(name, value, {
      httpOnly: true,
    });
  },

  async getCoordinates(city) {
    const result = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${city}&type=municipality&limit=1`);
    const geometry = result.data;
    const { coordinates } = geometry.features[0].geometry;

    return coordinates;
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

    const token = auth.generateToken(createdUser);

    const coordinates = await auth.getCoordinates(createdUser.city);

    createdUser = { ...createdUser, coordinates };

    const userUUID = generateRedisKey(createdUser, token);

    auth.generateCookie(res, 'tokenId', userUUID);

    const user = createdUser;
    res.json(user);
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

    const userUUID = generateRedisKey(user, token);

    auth.generateCookie(res, 'tokenId', userUUID);

    delete user.password;

    res.json(user);
  },

  async logout(req, res) {
    const { tokenId } = req.cookies;

    if (!tokenId) {
      res.status(401).json({ msg: 'Le token n\'existe pas' });
      return;
    }

    redis.del(tokenId);

    res.clearCookie(tokenId);
  },
};

module.exports = auth;
