const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send feedback email to admin
const sendFeedbackEmail = async (feedbackData) => {
    const transporter = createTransporter();

    const stars = '⭐'.repeat(feedbackData.rating) + '☆'.repeat(5 - feedbackData.rating);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Feedback Received - ${feedbackData.rating} Stars`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #28a745; text-align: center;">New Feedback Received!</h2>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Name:</strong> ${feedbackData.name}</p>
                    <p><strong>Occupation:</strong> ${feedbackData.occupation}</p>
                    <p><strong>Rating:</strong> ${stars} (${feedbackData.rating}/5)</p>
                </div>

                <div style="background-color: #fff; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Review:</h3>
                    <p style="line-height: 1.6;">${feedbackData.review}</p>
                </div>

                <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p style="color: #6c757d; font-size: 14px;">
                        Submitted on: ${new Date(feedbackData.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            timeZone: 'Asia/Kolkata'
                        })}
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Feedback email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending feedback email:', error);
        throw error;
    }
};

module.exports = { sendFeedbackEmail };
