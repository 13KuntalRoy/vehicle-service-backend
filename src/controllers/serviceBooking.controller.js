const ServiceBooking = require('../models/service-booking.model');

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const booking = new ServiceBooking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking created', data: booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await ServiceBooking.find()
      .populate('service_id', 'name base_charge')
      .populate('user_id', 'first_name last_name email')
      .populate('center_id', 'name')
      .populate('vehicle_id');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
};

// Get bookings by user
exports.getBookingsByUser = async (req, res) => {
  try {
    const bookings = await ServiceBooking.find({ user_id: req.params.userId })
      .populate('service_id')
      .populate('center_id')
      .populate('vehicle_id');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user bookings', details: error.message });
  }
};

// Get bookings by service center
exports.getBookingsByCenter = async (req, res) => {
  try {
    const bookings = await ServiceBooking.find({ center_id: req.params.centerId })
      .populate('service_id')
      .populate('user_id')
      .populate('vehicle_id');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch center bookings', details: error.message });
  }
};

// Get one booking
exports.getBookingById = async (req, res) => {
  try {
    const booking = await ServiceBooking.findById(req.params.id)
      .populate('service_id')
      .populate('user_id')
      .populate('center_id')
      .populate('vehicle_id');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking', details: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, started_at, ended_at } = req.body;
    const updated = await ServiceBooking.findByIdAndUpdate(
      req.params.id,
      { status, started_at, ended_at },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json({ message: 'Booking updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking', details: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await ServiceBooking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking', details: error.message });
  }
};
