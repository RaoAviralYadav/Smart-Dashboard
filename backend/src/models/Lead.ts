import mongoose, { Schema, Document } from 'mongoose';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  LOST = 'lost'
}

export enum LeadSource {
  WEBSITE = 'website',
  INSTAGRAM = 'instagram',
  REFERRAL = 'referral'
}

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Valid email is required']
  },
  status: {
    type: String,
    enum: Object.values(LeadStatus),
    default: LeadStatus.NEW
  },
  source: {
    type: String,
    enum: Object.values(LeadSource),
    required: [true, 'Lead source is required']
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true });

leadSchema.index({ userId: 1, createdAt: -1 });
leadSchema.index({ userId: 1, status: 1 });
leadSchema.index({ userId: 1, source: 1 });

export default mongoose.model<ILead>('Lead', leadSchema);
