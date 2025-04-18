const Vehicle = require('../models/vehicle.model');

// Add new vehicle
exports.addVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json({ message: 'Vehicle added', data: vehicle });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add vehicle', details: err.message });
  }
};

// Get all vehicles of a user
exports.getUserVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user_id: req.params.userId });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles', details: err.message });
  }
};

// Get single vehicle
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get vehicle', details: err.message });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json({ message: 'Vehicle updated', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vehicle', details: err.message });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vehicle', details: err.message });
  }
};

// Add service log
exports.addServiceLog = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const serviceLog = req.body;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { $push: { service_logs: serviceLog } },
      { new: true }
    );

    if (!updatedVehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.status(200).json({ message: 'Service log added', data: updatedVehicle });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add service log', details: err.message });
  }
};
