const Address = require('../models/address.model');
const User = require('../models/user.model');

/**
 * @desc Add a new address for the authenticated user
 * @route POST /api/user/addresses
 * @access Private
 */
exports.addAddress = async (req, res) => {
  try {
    const { line1, line2, city, state, country, postalCode, coordinates } = req.body;

    const newAddress = new Address({
      user: req.user._id, // user is added from the authentication middleware
      line1,
      line2,
      city,
      state,
      country,
      postalCode,
      coordinates,
    });

    await newAddress.save();

    res.status(201).json({
      message: 'Address added successfully',
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};

/**
 * @desc Update a specific address for the authenticated user
 * @route PUT /api/user/addresses/:addressId
 * @access Private
 */
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { line1, line2, city, state, country, postalCode, coordinates } = req.body;

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, user: req.user._id },
      { line1, line2, city, state, country, postalCode, coordinates },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found or does not belong to you' });
    }

    res.status(200).json({
      message: 'Address updated successfully',
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};

/**
 * @desc Delete a specific address for the authenticated user
 * @route DELETE /api/user/addresses/:addressId
 * @access Private
 */
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      user: req.user._id,
    });

    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found or does not belong to you' });
    }

    res.status(200).json({
      message: 'Address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};

/**
 * @desc Mark an address as the primary address for the authenticated user
 * @route PUT /api/user/addresses/primary/:addressId
 * @access Private
 */
exports.setPrimaryAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Remove primary flag from all addresses first
    await Address.updateMany(
      { user: req.user._id },
      { $set: { primary: false } }
    );

    // Set the selected address as primary
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, user: req.user._id },
      { primary: true },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found or does not belong to you' });
    }

    res.status(200).json({
      message: 'Primary address updated successfully',
      address: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating primary address', error: error.message });
  }
};

/**
 * @desc Get all addresses for the authenticated user
 * @route GET /api/user/addresses
 * @access Private
 */
exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({ message: 'No addresses found for this user' });
    }

    res.status(200).json({
      addresses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving addresses', error: error.message });
  }
};
