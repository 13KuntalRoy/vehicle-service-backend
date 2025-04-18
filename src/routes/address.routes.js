const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const addressController = require('../controllers/address.controller');

/**
 * @swagger
 * /api/user/addresses:
 *   get:
 *     summary: Get all addresses of the authenticated user
 *     description: Retrieves a list of all addresses associated with the authenticated user.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       404:
 *         description: No addresses found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No addresses found for this user"
 */
router.get('/addresses', authMiddleware, addressController.getUserAddresses);

/**
 * @swagger
 * /api/user/addresses:
 *   post:
 *     summary: Add a new address for the authenticated user
 *     description: Adds a new address for the authenticated user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               line1:
 *                 type: string
 *                 example: "123 Main St"
 *               line2:
 *                 type: string
 *                 example: "Apt 4B"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 example: "NY"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               postalCode:
 *                 type: string
 *                 example: "10001"
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [40.7128, -74.0060]
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address added successfully"
 *       500:
 *         description: Error adding address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error adding address"
 */
router.post('/addresses', authMiddleware, addressController.addAddress);

/**
 * @swagger
 * /api/user/addresses/{addressId}:
 *   put:
 *     summary: Update a specific address for the authenticated user
 *     description: Updates an existing address for the authenticated user.
 *     tags: [User]
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: The ID of the address to update
 *         schema:
 *           type: string
 *           example: "60b8d2954f2b0b10c8e4e89f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               line1:
 *                 type: string
 *                 example: "123 Main St"
 *               line2:
 *                 type: string
 *                 example: "Apt 4B"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 example: "NY"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               postalCode:
 *                 type: string
 *                 example: "10001"
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [40.7128, -74.0060]
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address updated successfully"
 *       500:
 *         description: Error updating address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating address"
 */
router.put('/addresses/:addressId', authMiddleware, addressController.updateAddress);

/**
 * @swagger
 * /api/user/addresses/{addressId}:
 *   delete:
 *     summary: Delete a specific address for the authenticated user
 *     description: Deletes a specific address for the authenticated user.
 *     tags: [User]
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: The ID of the address to delete
 *         schema:
 *           type: string
 *           example: "60b8d2954f2b0b10c8e4e89f"
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address deleted successfully"
 *       500:
 *         description: Error deleting address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting address"
 */
router.delete('/addresses/:addressId', authMiddleware, addressController.deleteAddress);

/**
 * @swagger
 * /api/user/addresses/primary/{addressId}:
 *   put:
 *     summary: Mark an address as the primary address for the authenticated user
 *     description: Marks an address as the primary address for the authenticated user.
 *     tags: [User]
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: The ID of the address to mark as primary
 *         schema:
 *           type: string
 *           example: "60b8d2954f2b0b10c8e4e89f"
 *     responses:
 *       200:
 *         description: Address marked as primary successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Primary address updated successfully"
 *       500:
 *         description: Error updating primary address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating primary address"
 */
router.put('/addresses/primary/:addressId', authMiddleware, addressController.setPrimaryAddress);

module.exports = router;
