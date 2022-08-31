const router = require('express').Router();
const userController = require('../controllers/userController');
const validator = require('../validation/validator');
const userValidator = require('../validation/schema/profil');
const activityValidator = require('../validation/schema/activity');
const controllerHandler = require('../helpers/controllerHandler');

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    UserProfile:
 *      type: object
 *      required:
 *        - firstname
 *        - lastname
 *        - description
 *        - address
 *        - phone
 *        - avatar
 *      properties:
 *        id:
 *          type: integer
 *          description: The ID of the user
 *        firstname:
 *          type: string
 *          description: The first name of the user
 *        lastname:
 *          type: string
 *          description: The last name of the user
 *        description:
 *          type: string
 *          description: The description of the user
 *        address:
 *          type: string
 *          description: The address of the user
 *        phone:
 *          type: string
 *          description: The phone number of the user
 *        avatar:
 *          type: string
 *          description: The profile image of the user
 *        lat:
 *          type: string
 *          description: The latitude of the user address
 *        long:
 *          type: string
 *          description: The longitude of the user address
 *    UserActivity:
 *      type: object
 *      required:
 *        - name
 *        - description
 *        - date
 *        - address
 *        - city
 *      properties:
 *        id:
 *          type: integer
 *          description: The id of the activity
 *        name:
 *          type: string
 *          description: The name of the activity
 *        description:
 *          type: string
 *          description: The description of the activity
 *        date:
 *          type: string
 *          description: The date of the activity
 *        city:
 *          type: string
 *          description: The city of the activity
 *        lat:
 *          type: string
 *          description: The latitude of the activity address
 *        long:
 *          type: string
 *          description: The longitude of the activity address
 */

/**
 * @swagger
 * tags:
 *   name: /user
 *   description: User routes
 */

router
  .route('/:id')
  /**
   * @swagger
   * /api/user/{userId}:
   *    get:
   *      summary: Retrieves a single user by ID
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user to get
   *      responses:
   *        '200':
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserProfile'
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .get(controllerHandler(userController.getUser)) // Gets user profile
  /**
   * @swagger
   * /api/user/{userId}:
   *    put:
   *      summary: Modifies a single user details
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user to get
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserProfile'
   *      responses:
   *        '200':
   *          description: User modified
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserProfile'
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .put(
    validator('body', userValidator),
    controllerHandler(userController.updateUser),
  ) // Modify user profile
  /**
   * @swagger
   * /api/user/{userId}:
   *    delete:
   *      summary: Modifies a single user details
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user to get
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserProfile'
   *      responses:
   *        '204':
   *          description: User deleted
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .delete(controllerHandler(userController.deleteUser)); // Delete user account

router
  .route('/:id/activity')
  /**
   * @swagger
   * /api/user/{userId}/activity:
   *    get:
   *      summary: Gets all activity the user created
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user to get activities from
   *      responses:
   *        '200':
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserActivity'
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .get(controllerHandler(userController.getUserActivities)) // Gets all activities created by user
  /**
   * @swagger
   * /api/user/{userId}/activity:
   *    post:
   *      summary: Creates one activity
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserActivity'
   *      responses:
   *        '200':
   *          description: Activity created
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserActivity'
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .post(
    validator('body', activityValidator),
    controllerHandler(userController.createActivity),
  ); // Creates a user  activity

router
  .route('/:userId/activity/:activityId')
  /**
   * @swagger
   * /api/user/{userId}/activity/{activityId}:
   *    put:
   *      summary: Modify one user activity
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user to get activities from
   *        - in: path
   *          name: activityId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the activity
   *      responses:
   *        '200':
   *          description: Activity modified
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserActivity'
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .put(
    validator('body', activityValidator),
    controllerHandler(userController.updateUserActivity),
  ) // Modify one activity created by user
  // eslint-disable-next-line max-len
  /**
   * @swagger
   * /api/user/{userId}/activity/{activityId}:
   *    delete:
   *      summary: Delete one user activity
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user to get activities from
   *        - in: path
   *          name: activityId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the activity
   *      responses:
   *        '204':
   *          description: Activity deleted
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .delete(controllerHandler(userController.deleteUserActivity)); // Delete one activity created by
// user;

router
  .route('/:userId/bookmark')
  /**
   * @swagger
   * /api/user/{userId}/bookmark:
   *    get:
   *      summary: Gets all bookmarks the user created
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user
   *      responses:
   *        '200':
   *          description: OK
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserActivity'
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .get(controllerHandler(userController.getUserBookmarks)) // Gets all bookmarks created by user
  /**
   * @swagger
   * /api/user/{userId}/bookmark:
   *    post:
   *      summary: Creates one bookmark
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user
   *      responses:
   *        '200':
   *          description: Bookmark created
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/UserActivity'
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  .post(controllerHandler(userController.addBookmark)); // Creates one bookmark by user

router
  .route('/:userId/bookmark/:bookmarkId')
  /**
   * @swagger
   * /api/user/{userId}/bookmark/{bookmarkId}:
   *    delete:
   *      summary: Creates one bookmark
   *      tags: [/user]
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user
   *        - in: path
   *          name: bookmarkId
   *          schema:
   *            type: integer
   *          required: true
   *          description: ID of the user bookmark
   *      responses:
   *        '204':
   *          description: Bookmark deleted
   *        '403':
   *          description: Forbidden
   *        '500':
   *          description: Internal server error.
   */
  // eslint-disable-next-line max-len
  .delete(controllerHandler(userController.deleteUserBookmark)); // Delete one bookmark created by user

router.route('/:userId/avatar')
  .get(controllerHandler(userController.getUserAvatar))
  .post(controllerHandler(userController.uploadUserAvatar));

router.route('/sse/:city').get(controllerHandler(userController.getCreatedActivitiesInRealTime));

router.route('/sse/:city').get(controllerHandler(userController.getCreatedActivitiesInRealTime));

module.exports = router;
