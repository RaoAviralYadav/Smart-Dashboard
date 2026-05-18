import { Response } from 'express';
import { validationResult } from 'express-validator';
import Lead, { ILead, LeadStatus, LeadSource } from '../models/Lead';
import { AuthRequest } from '../middleware/auth';
import Papa from 'papaparse';

export const createLead = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, status, source } = req.body;
    const lead = new Lead({
      name,
      email,
      status: status || LeadStatus.NEW,
      source,
      userId: req.user?.id
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = { userId: req.user?.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.source) {
      filter.source = req.query.source;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort
    let sortObj: any = { createdAt: -1 };
    if (req.query.sort === 'oldest') {
      sortObj = { createdAt: 1 };
    }

    const leads = await Lead.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(filter);

    res.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

export const getLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      userId: req.user?.id
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { name, email, status, source },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = { userId: req.user?.id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    const csv = Papa.unparse(leads.map(lead => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      'Created At': new Date(lead.createdAt).toLocaleDateString()
    })));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export leads' });
  }
};
