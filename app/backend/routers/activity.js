const router = require("express").Router();
const activityController = require("../controllers/activityController");

/**
 * @swagger
 *
 *  components:
 *    schemas:
 *      Activity:
 *        type: object
 *        required:
 *          - name
 *          - description
 *          - date
 *          - address
 *          - city
 *          - lat
 *          - long
 *        properties:
 *          id:
 *            type: integer
 *            description: The id of the activity
 *          name:
 *            type: string
 *            description: The name of the activity
 *          description:
 *            type: string
 *            description: The description of the activity
 *          date:
 *            type: string
 *            description: The date of the activity
 *          city:
 *            type: string
 *            description: The city of the activity
 *          lat:
 *            type: string
 *            description: The latitude of the activity address
 *          long:
 *            type: string
 *            description: The longitude of the activity address
 */

/**
 * @swagger
 * tags:
 *   name: /activity
 *   description: Acitivity routes
 */

/**
 * @swagger
 * /api/activity:
 *    get:
 *      summary: Retrieves one activity
 *      tags: [/activity]
 *      responses:
 *        200:
 *          description: Activity details
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Activity'
 */

router.route("/").get(activityController.getActivities); // Gets all activities

/**
 * @swagger
 * /api/activity/{activityId}:
 *    get:
 *      summary: Retrieves one activity by id
 *      tags: [/activity]
 *      parameters:
 *        - in: path
 *          name: activityId
 *          schema:
 *            type: integer
 *          required: true
 *          description: ID of the activity to get
 *      responses:
 *        200:
 *          description: Activity details
 *          content:
 *            application/json:
 *              schema:
 *                items:
 *                  $ref: '#/components/schemas/Activity'
 */

router.route("/:id").get(activityController.getActivity); // Gets one activity

module.exports = router;
