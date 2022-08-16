const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('../models/User');

const auth = {

  generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1800s' });
  },

  async register(req, res) {
    const {
      nickname, city, email, password, confirmPassword,
    } = req.body;

    if (
      !nickname
      || !city
      || !email
      || !password
      || !confirmPassword
    ) {
      res.json({ msg: 'Tous les champs sont requis !' });
      return;
    }

    // TODO Ajouté des verification avec JOI

    if (req.body.password !== req.body.confirm_password) {
      res.json({ msg: 'Les deux mots de passes ne sont pas indentiques !' });
      return;
    }

    // TODO Vérifié si l'utilisateur n'est pas deja dans la DB

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      res.json({ msg: 'Cet utilisateur existe déjà' });
      return;
    }

    delete req.body.confirm_password;

    try {
      const hashPassword = await argon2.hash(password);

      User.create({
        email,
        password: hashPassword,
        nickname,
        city,
      });
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

    if (email !== user.email || password !== user.password) {
      res.status(401).json({ msg: 'Email ou mot de passe incorrect' });
      return;
    }

    const token = auth.generateToken({ user });

    res.json({ token });
  },

  protect(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(401);
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(401).json({ msg: 'Token invalide' });
        return;
      }

      req.user = { ...user, token };
      next();
    });
  },
};

module.exports = auth;
