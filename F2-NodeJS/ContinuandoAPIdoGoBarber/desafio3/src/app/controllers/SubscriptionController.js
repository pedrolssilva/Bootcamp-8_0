import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Notification from '../schemas/notification';
import User from '../models/User';
import Queue from '../../lib/queue';
import SubscriptionMail from '../jobs/subscriptionMail';

class SubscriptionController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: {
        model: User,
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

    const subscription = await Subscription.create({
      meetup_id: req.params.meetupId,
      user_id: req.userId,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
      formattedDate,
    });
    return res.json(subscription);
  }
}

export default new SubscriptionController();
