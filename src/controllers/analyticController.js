// controllers/analyticsController.js
const Student = require('../models/student');
const Attendance = require('../models/attendance');
const Message = require('../models/message');

exports.getAnalytics = async (req, res) => {
  const { schoolId } = req.params;
  try {
    // Student Analytics
    const totalStudents = await Student.countDocuments({ schoolId });

    // Attendance Analytics
    const attendanceToday = await Attendance.countDocuments({
      schoolId,
      timestamp: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });
    const lastWeekAttendance = await Attendance.countDocuments({
      schoolId,
      timestamp: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    });
    const inCount = await Attendance.countDocuments({ schoolId, event: 'in' });
    const outCount = await Attendance.countDocuments({ schoolId, event: 'out' });

    // Message Analytics
    const totalMessages = await Message.countDocuments({ schoolId });
    const messagesToday = await Message.countDocuments({
      schoolId,
      timestamp: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });
    const lastWeekMessages = await Message.countDocuments({
      schoolId,
      timestamp: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    });
    const sentCount = await Message.countDocuments({ schoolId, status: 'sent' });
    const failedCount = await Message.countDocuments({ schoolId, status: 'failed' });

    res.json({
      // Student Metrics
      totalStudents,
      // Attendance Metrics
      attendanceToday,
      lastWeekAttendance,
      inCount,
      outCount,
      // Message Metrics
      totalMessages,
      messagesToday,
      lastWeekMessages,
      sentCount,
      failedCount,
      // General
      lastUpdate: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSuperAdminAnalytics = async (req, res) => {
  try {
    // Student Analytics
    const totalStudents = await Student.countDocuments({});

    // Attendance Analytics
    const attendanceToday = await Attendance.countDocuments({
      timestamp: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });
    const lastWeekAttendance = await Attendance.countDocuments({
      timestamp: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    });
    const inCount = await Attendance.countDocuments({ event: 'in' });
    const outCount = await Attendance.countDocuments({ event: 'out' });

    // Message Analytics
    const totalMessages = await Message.countDocuments({});
    const messagesToday = await Message.countDocuments({
      timestamp: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });
    const lastWeekMessages = await Message.countDocuments({
      timestamp: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    });
    const sentCount = await Message.countDocuments({ status: 'sent' });
    const failedCount = await Message.countDocuments({ status: 'failed' });

    res.json({
      // Student Metrics
      totalStudents,
      // Attendance Metrics
      attendanceToday,
      lastWeekAttendance,
      inCount,
      outCount,
      // Message Metrics
      totalMessages,
      messagesToday,
      lastWeekMessages,
      sentCount,
      failedCount,
      // General
      lastUpdate: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};