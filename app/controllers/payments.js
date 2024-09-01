const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { addPayments, getAllPayments, getAllPaymentsByID} = require('../models/payments');
const nodeMailer = require('nodemailer');

const InfoBip = require('infobip-nodejs')
const APIKEY = '2aff6a1a34147d1c4c5e83c82ad5a4e5-3f4ab32f-055b-4958-8513-6c366bf27055'
const environment = process.env.NODE_ENV
const isProduction = (environment === 'production')
// const Infobip = require('infobip');
// const infobipClient = infobip({ apiKey: 'YOUR_INFOBIP_API_KEY' });

const infobip = new InfoBip(APIKEY, isProduction, {
  authType:'basic',
  username:'Malith1', // Infobip Username used for registration
  password:'Malith@123', // Infobip Password used for registration
  encrypted:false,
  baseHost: 'okllaq.api.infobip.com'
})

// const sendSmsNotification = async (paymentData) => {
//   try {
//       // const infobip = require('infobip');
//       const infobipClient = infobip({ apiKey: '2aff6a1a34147d1c4c5e83c82ad5a4e5-3f4ab32f-055b-4958-8513-6c366bf27055' });

//       const smsPromise = infobipClient.sms.send({
//           // from: 'Max Fitness Center',
//           // to: paymentData.phone,
//           to: +94719783009,
//           // text: `Dear Customer, Thanks for registering with our service.`
//           text: `Dear Customer, Thanks for registering with our service.`
//       });

//       await smsPromise; // Wait for the SMS to be sent

//       console.log("SMS notification sent");
//   } catch (error) {
//       console.log("Error sending SMS notification:", error);
//   }
// };

const sendSmsNotification = async (paymentData) => {
  try {
      const sendSms = infobip.sendSMS({
          messages: [{
              from: 'Max Fitness Center',
              destinations: [
                  { to: '+94719783009' } // Replace with the actual phone number
              ],
              text: `Dear Member ${paymentData.first_name} ${paymentData.last_name}, Thank you for your payment of LKR ${paymentData.amount}.`,
          }],
          bulkId: 'BULK-ID-awq6545pOu7ye6',
      });

      await sendSms;

      console.log("SMS notification sent successfully");
  } catch (error) {
      console.log("Error sending SMS notification:", error);
  }
};


 //////
const sendEmailNotification = async (paymentData) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com', // Replace with the correct SMTP server host
            port: 465,
            secure: true,
            auth: {
                user: 'maxxfitnessratnapura@gmail.com',
                pass: 'zdsj gjmn qxgs ofgj',
                //pass: 'hdww jyrw hlxu qnqf',
            }
        });

        const html = `<h3>Acknowledgement of Payment</h3><br>
        <p>Dear Member ${paymentData.first_name}&nbsp;${paymentData.last_name},</p><br>
        <p>Thank you for your payment of LKR ${paymentData.amount} towards your Email Address:
        </p><p>User Email: ${paymentData.email}</p><br>
        <h6><Disclaimer and Confidentiality Notice:</h6>
        <p>This email (and any attachments) may contain confidential, privileged information, intended for the recipient specified in the message only. If you are not the addressee you may not copy, forward, disclose or use any part of it. If you have received this email by mistake, please notify the sender immediately and follow with its deletion.
        Internet communications cannot be guaranteed to be secure, and error or virus-free. The sender does not accept liability for any errors or viruses that might affect the computer or IT system where it is received and read.</p>`;

        const info = await transporter.sendMail({
            from: 'Max Fitness Center <maxxfitnessratnapura@gmail.com>',
            to: 'mranawakaarachchi@gmail.com',
            subject: 'New Payment Notification',
            html: html,
        });

        console.log("Email notification sent: " + info.messageId);
    } catch (error) {
        console.log("Error sending email notification:", error);
    }
};



async function handleAddPayments(req, res) {
    try {
        const paymentsData = req.body.payments;

        //paymentsData.added_time = new Date().toLocaleTimeString('en-US', { hour12: false });

        const newPayments = await addPayments(paymentsData);
        await sendSmsNotification(newPayments);
        await sendEmailNotification(newPayments);
 
        res.status(200).send(newPayments);
    } catch (error) {
        res.status(500).send({ err: error.message });
    }
}

async function handleGetAllPayments(req, res) {
    try {
      const allPayments = await getAllPayments();
      res.status(200).send(allPayments);
    } catch (error) {
      res.status(500).send({ err: error.message });
    }
  }

  async function handleGetAllPaymentsByID(req, res) {
    try {
      const userId = req.params.userId; // Assuming you get the userId from the request parameters
      const allPayments = await getAllPaymentsByID(userId);
      res.status(200).send(allPayments);
    } catch (error) {
      res.status(500).send({ err: error.message });
    }
  }
  





module.exports = { handleAddPayments, handleGetAllPayments, handleGetAllPaymentsByID }