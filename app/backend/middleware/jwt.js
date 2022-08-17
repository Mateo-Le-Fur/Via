const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('../models/User');

const auth = {

  generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1800s' });
  },

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

      const token = auth.generateToken({ user: createdUser });

      delete createdUser.dataValues.password;

      res.json({ user: createdUser.dataValues, token });
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

    const token = auth.generateToken({ user });

    res.json({ user, token });
  },

  protect(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(401).json('Aucun token trouvé');
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
