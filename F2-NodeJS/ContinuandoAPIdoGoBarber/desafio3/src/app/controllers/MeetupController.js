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
      user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'validation fails' });
    }

    const { date, user_id } = req.body;

    if (user_id != req.userId) {
      res.status(401).json({ error: 'user_id is different of user logged.' });
    }

    const dateMeetup = toDate(parseISO(date));
    if (isBefore(dateMeetup, new Date())) {
      res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    const meetup = await Meetup.create(req.body);

    return res.json(meetup);
  }
}

export default new MeetupController();
