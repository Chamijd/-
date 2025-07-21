const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OTP_STORE = {}; // in-memory storage, restart clears

// Send OTP
app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    const response = await axios.post('https://textbelt.com/text', {
      phone: phone,
      message: `Your verification code is: ${otp}`,
      key: 'e42bbac3ae63f7ea0f4e5b9d5d4aa27e3013282eaXLYVtZGt8UevlRbhe1WNH8V9'  // ← ඔයාගේ API key
    });

    if (response.data.success) {
      OTP_STORE[phone] = otp;
      return res.json({ success: true, message: 'OTP sent successfully.' });
    } else {
      return res.json({ success: false, message: response.data.error });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error sending OTP.' });
  }
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
  }
  if (OTP_STORE[phone] === otp) {
    delete OTP_STORE[phone];
    return res.json({ success: true, message: 'OTP verified!' });
  } else {
    return res.json({ success: false, message: 'Invalid OTP.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OTP server running on http://localhost:${PORT}`);
});
