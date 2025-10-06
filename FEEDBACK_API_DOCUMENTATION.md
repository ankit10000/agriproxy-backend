# Feedback API Documentation

## Overview
Complete feedback system with email notifications to admin and active/inactive status control.

---

## Setup Instructions

### 1. Configure Email Settings

Update `.env` file with your Gmail credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
ADMIN_EMAIL=admin@agriproxy.com
```

**Important:** For Gmail, you need to create an App Password:
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new App Password for "Mail"
5. Use this password in `EMAIL_PASSWORD`

---

## API Endpoints

### Public Endpoints

#### 1. Submit Feedback
```http
POST /api/feedback/submit
```

**Request Body:**
```json
{
    "name": "Ramesh Kumar",
    "occupation": "Farmer",
    "rating": 5,
    "review": "Great service! Very helpful for my farming business."
}
```

**Response:**
```json
{
    "success": true,
    "message": "Feedback submitted successfully",
    "data": {
        "_id": "...",
        "name": "Ramesh Kumar",
        "occupation": "Farmer",
        "rating": 5,
        "review": "Great service! Very helpful for my farming business.",
        "isActive": false,
        "createdAt": "2025-01-10T10:30:00.000Z",
        "updatedAt": "2025-01-10T10:30:00.000Z"
    }
}
```

**Features:**
- Automatically sends email notification to admin
- Feedback is created with `isActive: false` by default
- Validation for all required fields
- Rating must be between 1-5

---

#### 2. Get Active Feedbacks
```http
GET /api/feedback/active
```

**Response:**
```json
{
    "success": true,
    "count": 5,
    "data": [
        {
            "_id": "...",
            "name": "Ramesh Kumar",
            "occupation": "Farmer",
            "rating": 5,
            "review": "Great service!",
            "isActive": true,
            "createdAt": "2025-01-10T10:30:00.000Z",
            "updatedAt": "2025-01-10T10:30:00.000Z"
        }
    ]
}
```

**Use Case:** Display only approved feedbacks on your website

---

### Admin Endpoints (Require Authentication)

Add authentication token to headers:
```http
Authorization: Bearer your_jwt_token
```

#### 3. Get All Feedbacks
```http
GET /api/feedback/all
```

**Response:**
```json
{
    "success": true,
    "count": 25,
    "data": [...]
}
```

**Use Case:** Admin panel to view all submitted feedbacks

---

#### 4. Toggle Feedback Status
```http
PATCH /api/feedback/:id/toggle-status
```

**Response:**
```json
{
    "success": true,
    "message": "Feedback activated successfully",
    "data": {
        "_id": "...",
        "isActive": true,
        ...
    }
}
```

**Use Case:** Activate/deactivate feedbacks for public display

---

#### 5. Delete Feedback
```http
DELETE /api/feedback/:id
```

**Response:**
```json
{
    "success": true,
    "message": "Feedback deleted successfully"
}
```

---

#### 6. Get Feedback Statistics
```http
GET /api/feedback/stats
```

**Response:**
```json
{
    "success": true,
    "data": {
        "totalFeedbacks": 25,
        "activeFeedbacks": 15,
        "inactiveFeedbacks": 10,
        "averageRating": "4.32",
        "ratingDistribution": [
            { "_id": 1, "count": 2 },
            { "_id": 2, "count": 3 },
            { "_id": 3, "count": 5 },
            { "_id": 4, "count": 8 },
            { "_id": 5, "count": 7 }
        ]
    }
}
```

**Use Case:** Dashboard analytics for admin

---

## Email Notification

When a feedback is submitted, an automatic email is sent to the admin with:

- User's name and occupation
- Star rating (visual stars)
- Complete review text
- Submission timestamp (India timezone)

**Email Preview:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  New Feedback Received!
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: Ramesh Kumar
Occupation: Farmer
Rating: ⭐⭐⭐⭐⭐ (5/5)

Review:
Great service! Very helpful
for my farming business.

Submitted on: Jan 10, 2025, 4:00 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Frontend Integration

### Update your FeedbackForm component:

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:3001/api/feedback/submit', formData);

        if (response.data.success) {
            setSubmitted(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({
                    name: '',
                    occupation: '',
                    rating: 5,
                    review: ''
                });
                setSubmitted(false);
                setShowModal(false);
            }, 3000);
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
    }
};
```

### Display Active Feedbacks:

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackDisplay = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/feedback/active');
                setFeedbacks(response.data.data);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="container">
            <h2>Customer Reviews</h2>
            <div className="row">
                {feedbacks.map((feedback) => (
                    <div key={feedback._id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5>{feedback.name}</h5>
                                <p className="text-muted">{feedback.occupation}</p>
                                <div className="text-warning">
                                    {'⭐'.repeat(feedback.rating)}
                                </div>
                                <p className="mt-3">{feedback.review}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
```

---

## Database Schema

```javascript
{
    name: String,           // Required
    occupation: String,     // Required
    rating: Number,         // 1-5, Required
    review: String,         // Required
    isActive: Boolean,      // Default: false
    createdAt: Date,       // Auto
    updatedAt: Date        // Auto
}
```

---

## Testing

Run the test script:

```bash
node test-feedback-api.js
```

This will test the public endpoints. For admin endpoints, you'll need to authenticate first.

---

## Workflow

1. **User submits feedback** → `POST /api/feedback/submit`
2. **System saves to database** with `isActive: false`
3. **Email sent to admin** automatically
4. **Admin reviews feedback** → `GET /api/feedback/all`
5. **Admin activates good feedback** → `PATCH /api/feedback/:id/toggle-status`
6. **Public sees only active feedback** → `GET /api/feedback/active`

---

## Security Notes

- Public can only submit and view active feedbacks
- Admin endpoints are protected with JWT authentication
- Email credentials should be kept secure
- Use environment variables for sensitive data
- Never commit `.env` file to version control

---

## Troubleshooting

### Email not sending?
- Check Gmail App Password is correct
- Ensure 2-Step Verification is enabled
- Check `EMAIL_USER` and `ADMIN_EMAIL` are valid
- Review server logs for email errors

### Feedback not showing?
- Check if feedback is marked as `isActive: true`
- Only active feedbacks appear in public endpoint
- Use admin endpoint to see all feedbacks

---

## Support

For issues or questions, contact the development team.
