const router = require("express").Router();
const authController = require("../controllers/authController");
const controllerHandler = require("../helpers/controllerHandler");
const validator = require("../validation/validator");
const registerValidator = require("../validation/schema/register");
const loginValidator = require("../validation/schema/login");

/**
 * @swagger
 *
 *  components:
 *    schemas:
 *      UserRegistration:
 *        type: object
 *        required:
 *          - nickname
 *          - email
 *          - city
 *          - password
 *          - confirmPassword
 *        properties:
 *          nickname:
 *            type: string
 *            description: The nickname of the user
 *          email:
 *            type: string
 *            description: The email of the user
 *          city:
 *            type: string
 *            description: The city of the user
 *          password:
 *            type: string
 *            description: The password of the user
 *          confirmPassword:
 *            type: string
 *            description: Confirmation of the user password
 *      UserLogin:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            description: The email of the user
 *          password:
 *            type: string
 *            description: The password of the user
 */

/**
 * @swagger
 * tags:
 *   name: /auth
 *   description: Authentification routes
 */

/**
 * @swagger
 * /api/auth/register:
 *    post:
 *      summary: Creates a new user
 *      tags: [/auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserRegistration'
 *      responses:
 *        200:
 *          description: User details
 *          content:
 *            application/json:
 *              schema:
 *                items:
 *                  $ref: '#/components/schemas/UserRegistration'
 */

router
  .route("/register")
  .post(
    validator("body", registerValidator),
    controllerHandler(authController.register)
  ); // Sends user registration info

/**
 * @swagger
 * /api/auth/login:
 *    post:
 *      summary: Log in an existing user
 *      tags: [/auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLogin'
 *      responses:
 *        200:
 *          description: User details
 *          content:
 *            application/json:
 *              schema:
 *                items:
 *                  $ref: '#/components/schemas/UserLogin'
 */
router
  .route("/login")
  .post(
    validator("body", loginValidator),
    controllerHandler(authController.login)
  ); // Sends user login info

/**
 * @swagger
 * /api/auth/logout:
 *    get:
 *      summary: Log out an existing user
 *      tags: [/auth]
 *      responses:
 *        200:
 *          description: Utilisateur déconnecté
 */
router.route("/logout").get(controllerHandler(authController.logout)); // Log out user from app

module.exports = router;
