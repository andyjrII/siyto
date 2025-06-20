const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Your form handler
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  // 1. Create a transporter (use your own email credentials or test account)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // 2. Send main email to you
  await transporter.sendMail({
    from: email,
    to: process.env.GMAIL_USER,
    subject: `New Contact Form Message from ${name}`,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br>${message}</p>`,
  });

  // 3. Send autoresponse to user
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Thank You for Applying - Siyto Trust Finance',
    html: `<p>Dear ${name},</p>
           <p>Thank you for submitting your loan application to Siyto Trust Finance.</p>
           <p>We've received your request and our team is already reviewing it. You can expect to hear from us within 48 hours regarding the next steps.</p>
           <p>In the meantime, feel free to reply to this email or call us if you have any questions.</p>
           <p>Thank you for trusting us to be part of your journey.</p>
           <p>Warm regards,
           <br>The Siyto Trust Finance Team
           <br>Phone: 0810 871 0594</p>`,
  });

  res.json({ success: true, message: 'Emails sent successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
