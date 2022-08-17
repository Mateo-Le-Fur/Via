const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const axios = require('axios').default;
const User = require('../models/User');
const client = require('../config/redis');

const auth = {

  generateToken(user) {
    return new Promise((resolve, reject) => {
      jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1800s' }, (err, token) => {
        if (err) {
          reject(err);
        }

        client.set(user.user.id.toString(), token);

        resolve(token);
      });
    });
  },

  // generateToken(user) {
  //   return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1800s' });
  // },

  async register(req, res) {
    const {
      nickname,
      city,
      email,
      password,
      confirmPassword,
    } = req.body;
    if (
      !nickname
      || !city
      || !email
      || !password
      || !confirmPassword
    ) {
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

    try {
      const hashPassword = await argon2.hash(password);

      const createdUser = await User.create({
        email,
        password: hashPassword,
        nickname,
        city,
      });

      let createdUserValues = createdUser.get();

      // !!
      await auth.generateToken({ user: createdUserValues });

      delete createdUser.dataValues.password;

      const result = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${createdUser.dataValues.city}&type=municipality&limit=1`);

      const geometry = result.data;
      const { coordinates } = geometry.features[0].geometry;

      createdUserValues = { ...createdUserValues, coordinates };

      res.cookie('tokenId', createdUserValues.id, {
        httpOnly: true,
      });

      res.json({ user: createdUserValues });
    } catch (err) {
      res.json(err);
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({ msg: 'Utilisateur introuvable' });
      return;
    }

    const goodPassword = await argon2.verify(user.password, password);

    if (!goodPassword) {
      res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
      return;
    }

    delete user.dataValues.password;

    const token = auth.generateToken({ user });

    res.json({ user, token });
  },

  async protect(req, res, next) {
    const { tokenId } = req.cookies;

    const token = await client.get(tokenId);

    if (!token) {
      res.status(401).json('Aucun token trouvé');
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        res.status(403).json({ msg: 'Token invalide' });
        return;
      }

      next();
    });
  },
};

module.exports = auth;
