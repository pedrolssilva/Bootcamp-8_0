import mail from '../../lib/mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user, formattedDate } = data;

    await mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: `Nova inscrição no meetup ${meetup.title}`,
      template: 'subscription',
      context: {
        organizer: meetup.organizer.name,
        meetupTitle: meetup.title,
        userName: user.name,
        date: formattedDate,
      },
    });
  }
}

export default new SubscriptionMail();
