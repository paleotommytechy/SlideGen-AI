export enum Tone {
  PROFESSIONAL = 'Professional',
  ACADEMIC = 'Academic',
  CREATIVE = 'Creative',
  PERSUASIVE = 'Persuasive',
  SIMPLE = 'Simple',
}

export enum Audience {
  PROFESSIONALS = 'Professionals',
  STUDENTS = 'Students',
  GENERAL_PUBLIC = 'General Public',
  INVESTORS = 'Investors',
  CHILDREN = 'Children',
}

export interface SlideContent {
  title: string;
  bulletPoints: string[];
  speakerNotes: string;
  imageDescription: string; // Used to fetch/generate a relevant image
  citations?: string[];
}

export interface PresentationData {
  title: string;
  subtitle: string;
  slides: SlideContent[];
}

export interface PresentationConfig {
  topic: string;
  audience: Audience;
  tone: Tone;
  slideCount: number;
  includeImages: boolean;
  includeSpeakerNotes: boolean;
  includeCitations: boolean;
}