const jwt = require('jsonwebtoken');

const auth = {

  generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1800s' });
  },

  register(req, res) {
    if (
      !req.body.nickname
      || !req.body.city
      || !req.body.email
      || !req.body.password
      || !req.body.confirm_password
    ) {
      res.json({ msg: 'Tous les champs sont requis !' });
    }

    // TODO Ajouté des verification avec JOI

    if (req.body.password !== req.body.confirm_password) {
      res.json({ msg: 'Les deux mots de passes ne sont pas indentiques !' });
    }

    // TODO Vérifié si l'utilisateur n'est pas deja dans la DB

    delete req.body.confirm_password;

    // TODO Chiffrer le mot de passe avec argon2

    // TODO Enregistrer l'utilisateur en DB
  },

  login(req, res) {
    const { email, password } = req.body;

    // TODO récupérer l'utilisateur en DB

    let user;

    if (email !== user.mail || password !== user.password) {
      res.json(401, { msg: 'Email ou mot de passe incorrect' });
      return;
    }

    const token = auth.generateToken(user);

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
        res.json(401, { msg: 'Token invalide' });
      }

      req.user = user;
      next();
    });
  },
};

module.exports = auth;
