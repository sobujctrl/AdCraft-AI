export type InputType = 'text' | 'document';

export type ToneType = 
  | 'high_converting' 
  | 'emotional' 
  | 'storytelling' 
  | 'controversial' 
  | 'urgency' 
  | 'humorous' 
  | 'value_first';

export type LanguageType = 'auto' | 'bangla' | 'english' | 'banglish';

export type ThemeType = 'midnight' | 'royal' | 'emerald' | 'slate' | 'light';

export interface AdConcept {
  id: string;
  timestamp: number;
  angleName: string;

  // 1. AD CONCEPT (অ্যাড কনসেপ্ট)
  adConcept: {
    idea: string;
    customerAvatar: string;
    angles: string;
    uniquePoint: string;
  };

  // 2. AD SCRIPT (অ্যাড স্ক্রিপ্ট)
  adScript: {
    hook: string;
    pinpointPain: string;
    solution: string;
    callToAction: string;
    uniqueDirection: string;
  };

  // 3. AD CAPTION (সোশ্যাল মিডিয়া ক্যাপশন)
  adCaption: {
    title: string;
    pinpoint: string;
    brandwiseSolution: string;
    uniqueOffer: string;
  };

  // 4. IMAGE AD COPY & PROMPT (ছবির ব্যানার টেক্সট ও এআই প্রম্পট)
  imageAdCopy: {
    headline: string;
    subline: string;
    imgContent: string;
    imgPrompt: string;
  };

  // Backwards compatibility / summary fields
  idea: string;
  hook: string;
  painPoint: string;
  solution: string;
  cta: string;
  fullScript: string;
  caption: string;

  metadata: {
    targetAudienceSummary: string;
    estimatedDuration: string;
    languageDetected: string;
    toneUsed: string;
    recommendedVisuals: string[];
  };
}

export interface AdGenerationParams {
  inputType: InputType;
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  problemSolved?: string;
  offerOrPrice?: string;
  tone: ToneType;
  language: LanguageType;
  angleStyle?: string;
  fileData?: {
    name: string;
    mimeType: string;
    content: string; // Base64 data or plain text
  };
  customInstructions?: string;
  variationsCount?: number;
}

export interface PresetTemplate {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  icon: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  problemSolved: string;
  offerOrPrice: string;
  tone: ToneType;
}

export interface SavedCampaign {
  id: string;
  title: string;
  productName: string;
  createdAt: number;
  concepts: AdConcept[];
  inputType: InputType;
  tone: ToneType;
  language: LanguageType;
}
