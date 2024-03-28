const nodemailer = require('nodemailer');
const Queue = require('bull');

const config = require('../config/config');
const logger = require('../config/winston.config');

const sendMailHelper = async (to, subject, html) => {
  const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: config.mail
  });

  await transport.sendMail({
    from: 'HIT Circle <no_reply@hit.circle.com>',
    to,
    subject,
    html
  });
};

const mailQueue = new Queue('mail', { redis: config.redis });

mailQueue.process(async (job, done) => {
  try {
    const { email, subject, template } = job.data;
    await sendMailHelper(email, subject, template);
    done();
  } catch (error) {
    logger.error(error, { label: 'mail queue' });
    done(new Error('error mail queue'));
  }
});

const sendMail = (email, subject, template) => {
  mailQueue.add({ email, subject, template });
};

module.exports = { sendMail };
