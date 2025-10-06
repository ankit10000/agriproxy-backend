const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// In-memory storage for demo (replace with actual database model)
let soilTestRequests = [];
let requestIdCounter = 1;

// Email configuration for sending to store support
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.SUPPORT_EMAIL,
      pass: process.env.SUPPORT_EMAIL_PASSWORD
    }
  });
};

const sendEmailToSupport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      crop,
      farmArea,
      surveyNumber,
      addressLine,
      city,
      state,
      pincode,
      contact,
      packageType,
      packagePrice,
      bagItems,
      totalBags
    } = req.body;

    // Validate required fields
    if (!crop || !farmArea || !addressLine || !city || !state || !pincode || !packageType || !bagItems) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: crop, farmArea, addressLine, city, state, pincode, packageType, bagItems'
      });
    }

    // Prepare email content
    const emailContent = `
New Soil Testing Request - AgriProxy

Farmer Details:
- Contact: ${contact}
- Address: ${addressLine}, ${city}, ${state} - ${pincode}

Farm Information:
- Crop: ${crop}
- Farm Area: ${farmArea} acres
- Survey Number: ${surveyNumber || 'Not provided'}

Package Details:
- Package Type: ${packageType}
- Package Price: ${packagePrice}
- Total Bags: ${totalBags}

Bag Items:
${bagItems.map(item => `- ${item.name}: ${item.quantity} unit(s)`).join('\n')}

Please process this soil testing request and contact the farmer for further details.

---
This request was generated automatically by AgriProxy App.
Timestamp: ${new Date().toISOString()}
    `;

    // Create email transporter
    const transporter = createEmailTransporter();

    // Send email to store support
    const mailOptions = {
      from: process.env.SUPPORT_EMAIL,
      to: process.env.STORE_SUPPORT_EMAIL || 'support@agriproxy.com',
      subject: `New Soil Testing Request - ${crop} (${farmArea} acres)`,
      text: emailContent
    };

    await transporter.sendMail(mailOptions);

    // Save request to database (optional for tracking)
    const newRequest = {
      id: requestIdCounter++,
      crop,
      farmArea,
      surveyNumber: surveyNumber || '',
      addressLine,
      city,
      state,
      pincode,
      contact,
      packageType,
      bagItems,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    soilTestRequests.push(newRequest);

    res.status(200).json({
      success: true,
      message: 'Email sent to store support successfully',
      data: {
        requestId: newRequest.id,
        status: newRequest.status
      }
    });

  } catch (error) {
    console.error('Error sending email to support:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email to store support',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getAllRequests = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Soil test requests retrieved successfully',
      data: soilTestRequests
    });
  } catch (error) {
    console.error('Error fetching soil test requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch soil test requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { crop, farmArea, surveyNumber, addressLine, city, state, pincode, packageType, bagItems } = req.body;

    // Validate required fields
    if (!crop || !farmArea || !addressLine || !city || !state || !pincode || !packageType || !bagItems) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: crop, farmArea, addressLine, city, state, pincode, packageType, bagItems'
      });
    }

    const newRequest = {
      id: requestIdCounter++,
      crop,
      farmArea,
      surveyNumber: surveyNumber || '',
      addressLine,
      city,
      state,
      pincode,
      packageType,
      bagItems,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    soilTestRequests.push(newRequest);

    res.status(201).json({
      success: true,
      message: 'Soil test request created successfully',
      data: newRequest
    });

  } catch (error) {
    console.error('Error creating soil test request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create soil test request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = soilTestRequests.find(req => req.id === parseInt(id));

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Soil test request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Soil test request retrieved successfully',
      data: request
    });

  } catch (error) {
    console.error('Error fetching soil test request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch soil test request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, in_progress, completed'
      });
    }

    const requestIndex = soilTestRequests.findIndex(req => req.id === parseInt(id));

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Soil test request not found'
      });
    }

    soilTestRequests[requestIndex].status = status;
    soilTestRequests[requestIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Soil test request status updated successfully',
      data: soilTestRequests[requestIndex]
    });

  } catch (error) {
    console.error('Error updating soil test request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update soil test request status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const requestIndex = soilTestRequests.findIndex(req => req.id === parseInt(id));

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Soil test request not found'
      });
    }

    soilTestRequests.splice(requestIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Soil test request deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting soil test request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete soil test request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  sendEmailToSupport,
  getAllRequests,
  createRequest,
  getRequestById,
  updateRequestStatus,
  deleteRequest
};