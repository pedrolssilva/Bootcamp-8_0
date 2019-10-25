import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Notification from '../schemas/notification';
import User from '../models/User';
import mail from '../../lib/mail';

class SubscriptionController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: {
        model: User,
        as: 'user',
        attributes: ['name', 'email'],
      },
    });

    if (!meetup) {
      return res.status(404).json({ error: 'meetup not found' });
    }
    if (meetup.past) {
      return res.status(400).json({
        error: "It's not possibile subscribe a past meetup.",
      });
    }
    if (meetup.user_id === req.userId) {
      return res.status(400).json({
        error: "It's not possibile subscribe a meetup that you are organizer.",
      });
    }

    const subscriptionExist = await Subscription.findOne({
      where: { user_id: req.userId, meetup_id: meetup.id },
    });

    if (subscriptionExist) {
      return res.status(400).json({
        error: 'Already subscribed this meetup.',
      });
    }

    const checkData = await Subscription.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          required: true,
          where: { date: meetup.date },
        },
      ],
    });

    if (checkData) {
      return res.status(400).json({
        error: 'Already subscribed a meetup in the same date.',
      });
    }

    /* Notify subcription organizer */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      meetup.date,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `Nova inscrição de ${user.name} no meetup "${meetup.title}" do ${formattedDate}`,
      user: meetup.user_id,
    });

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

    const subscription = await Subscription.create({
      meetup_id: req.params.meetupId,
      user_id: req.userId,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
