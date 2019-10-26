import mail from '../../lib/mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user, formattedDate } = data;

    await mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: `Nova inscrição no meetup ${meetup.title}`,
      template: 'subscription',
      context: {
        organizer: meetup.user.name,
        meetupTitle: meetup.title,
        userName: user.name,
        date: formattedDate,
      },
    });
  }
}

export default new SubscriptionMail();
