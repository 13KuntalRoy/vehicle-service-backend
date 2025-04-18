const OnRoadService = require('../models/onroad-service.model');
const Vehicle = require('../models/vehicle.model');

exports.requestService = async (req, res) => {
  try {
    const { vehicle_id, problem_description, location } = req.body;
    const user_id = req.user._id;

    const newRequest = new OnRoadService({
      user_id,
      vehicle_id,
      problem_description,
      location
    });

    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const services = await OnRoadService.find({ user_id: req.user._id }).populate('vehicle_id mechanic_id');
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNearbyRequests = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;
    const services = await OnRoadService.find({
      status: 'requested',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: 5000, // 5km radius
        },
      },
    }).populate('user_id vehicle_id');

    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignMechanic = async (req, res) => {
  try {
    const { service_id } = req.params;
    const mechanic_id = req.user._id;

    const service = await OnRoadService.findById(service_id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.mechanic_id = mechanic_id;
    service.status = 'assigned';
    service.assigned_at = new Date();
    await service.save();

    res.json({ success: true, message: 'Service assigned', data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateServiceStatus = async (req, res) => {
  try {
    const { service_id } = req.params;
    const { status } = req.body;

    const service = await OnRoadService.findById(service_id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.status = status;
    if (status === 'completed') service.completed_at = new Date();

    await service.save();
    res.json({ success: true, message: 'Status updated', data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
