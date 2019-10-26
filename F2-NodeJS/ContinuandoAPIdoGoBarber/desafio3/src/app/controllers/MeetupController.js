import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, parseISO, toDate, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

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
