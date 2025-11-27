const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email } = data;

    // Validate required fields
    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name and email are required' })
      };
    }

    // Create transporter using Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtppro.zoho.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD
      }
    });

    // Mongolian email content
    const mailOptions = {
      from: `"Webico" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Webico-д холбогдсонд баярлалаа!',
      text: `${name} ээ,

Бидэнтэй холбогдсонд баярлалаа! Таны үнийн санал хүссэн хүсэлтийг бид хүлээн авч, нарийвчлан хянаж үзэх болно.

Дараа нь юу болох вэ:
• Манай баг таны төслийн шаардлагыг хянана
• Бид таны хэрэгцээнд үндэслэн дэлгэрэнгүй үнийн санал бэлтгэнэ
• Та 1-2 ажлын өдрийн дотор биднээс хариу сонсох болно

Энэ хооронд, хэрэв танд ямар нэгэн асуулт байгаа эсвэл хүсэлтэдээ нэмэлт мэдээлэл оруулахыг хүсвэл энэ имэйлд хариу бичээрэй.

Бид тантай хамтран ажиллахыг тэсэн ядан хүлээж байна!

Хүндэтгэсэн,
Хосбаяр
Webico
+976-99147147
webico.mn`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Webico-д холбогдсонд баярлалаа!</h2>

          <p>${name} ээ,</p>

          <p>Бидэнтэй холбогдсонд баярлалаа! Таны үнийн санал хүссэн хүсэлтийг бид хүлээн авч, нарийвчлан хянаж үзэх болно.</p>

          <h3 style="color: #2563eb;">Дараа нь юу болох вэ:</h3>
          <ul style="line-height: 1.8;">
            <li>Манай баг таны төслийн шаардлагыг хянана</li>
            <li>Бид таны хэрэгцээнд үндэслэн дэлгэрэнгүй үнийн санал бэлтгэнэ</li>
            <li>Та 1-2 ажлын өдрийн дотор биднээс хариу сонсох болно</li>
          </ul>

          <p>Энэ хооронд, хэрэв танд ямар нэгэн асуулт байгаа эсвэл хүсэлтэдээ нэмэлт мэдээлэл оруулахыг хүсвэл энэ имэйлд хариу бичээрэй.</p>

          <p>Бид тантай хамтран ажиллахыг тэсэн ядан хүлээж байна!</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

          <p style="color: #6b7280; font-size: 14px;">
            Хүндэтгэсэн,<br>
            <strong>Хосбаяр</strong><br>
            Webico<br>
            +976-99147147<br>
            <a href="https://webico.mn" style="color: #2563eb;">webico.mn</a>
          </p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Confirmation email sent successfully' })
    };

  } catch (error) {
    console.error('Email send error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send confirmation email', details: error.message })
    };
  }
};
