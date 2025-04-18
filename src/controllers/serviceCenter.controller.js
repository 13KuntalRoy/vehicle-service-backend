const ServiceCenter = require('../models/service-center.model');

// Create new service center
exports.createServiceCenter = async (req, res) => {
  try {
    const serviceCenter = new ServiceCenter(req.body);
    await serviceCenter.save();
    res.status(201).json({ message: 'Service center created', data: serviceCenter });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service center', details: error.message });
  }
};

// Get all service centers
exports.getAllServiceCenters = async (req, res) => {
  try {
    const serviceCenters = await ServiceCenter.find()
      .populate('provider_id', 'first_name last_name email phone_number')
      .populate('address_id');
    res.status(200).json(serviceCenters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service centers', details: error.message });
  }
};

// Get one service center by ID
exports.getServiceCenterById = async (req, res) => {
  try {
    const serviceCenter = await ServiceCenter.findById(req.params.id)
      .populate('provider_id', 'first_name last_name email phone_number')
      .populate('address_id');
    if (!serviceCenter) return res.status(404).json({ error: 'Service center not found' });
    res.status(200).json(serviceCenter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service center', details: error.message });
  }
};

// Update service center
exports.updateServiceCenter = async (req, res) => {
  try {
    const updated = await ServiceCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Service center not found' });
    res.status(200).json({ message: 'Service center updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service center', details: error.message });
  }
};

// Delete service center
exports.deleteServiceCenter = async (req, res) => {
  try {
    const deleted = await ServiceCenter.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service center not found' });
    res.status(200).json({ message: 'Service center deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service center', details: error.message });
  }
};
