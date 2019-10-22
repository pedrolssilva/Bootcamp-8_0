import * as Yup from 'yup';
import { isBefore, parseISO, toDate } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string()
        .required()
        .min(10),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'validation fails' });
    }

    const dateMeetup = toDate(parseISO(req.body.date));
    if (isBefore(dateMeetup, new Date())) {
      res.status(400).json({ error: 'Past dates are not permitted.' });
    }
    const user_id = req.userId;

    const meetup = await Meetup.create({ ...req.body, user_id });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string().min(10),
      location: Yup.string(),
      date: Yup.date(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'validation fails.' });
    }

    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (!meetup) {
      return res.status(400).json({ error: 'meetup not found.' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'You can not update past meetups.' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res
        .status(400)
        .json({ error: 'You can not update meetup with past dates.' });
    }

    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You can not change meetup that you are not organizer.',
      });
    }

    const {
      title,
      description,
      location,
      date,
      banner_id,
    } = await meetup.update(req.body);

    return res.json({ title, description, location, date, banner_id });
  }

  async delete(req, res) {
    const { meetupId } = req.params;

    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res.status(400).json({ error: 'meetup not found' });
    }
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: "it's not possible delete past meetups" });
    }
    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "you can't delete meetup that you are not organizer." });
    }

    await meetup.destroy();

    return res.json({ success: 'OK' });
  }
}

export default new MeetupController();
