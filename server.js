const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your static HTML/CSS/JS from /public

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
    to: 'your-email@gmail.com',
    subject: `New Contact Form Message from ${name}`,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br>${message}</p>`,
  });

  // 3. Send autoresponse to user
  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Thanks for contacting Siyto Trust Finance!',
    html: `<p>Hi ${name},</p>
           <p>Thanks for reaching out. We've received your message and will get back to you shortly.</p>
           <p><strong>Siyto Trust Finance Team</strong></p>`,
  });

  res.json({ success: true, message: 'Emails sent successfully!' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
