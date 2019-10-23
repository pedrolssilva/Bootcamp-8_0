import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

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

    const subscription = await Subscription.create({
      meetup_id: req.params.meetupId,
      user_id: req.userId,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
