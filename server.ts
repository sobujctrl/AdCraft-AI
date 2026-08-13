import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Body parser middleware with generous limits for file uploads / documents
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize GoogleGenAI
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper function to call Gemini API with retries and fallback models for transient errors (e.g. 503 UNAVAILABLE / 429)
async function callGeminiWithRetry(ai: GoogleGenAI, requestOptions: any) {
  const modelsToTry = [
    requestOptions.model || 'gemini-3.6-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...requestOptions,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);
        const isTransient =
          errStr.includes('503') ||
          errStr.includes('UNAVAILABLE') ||
          errStr.includes('HIGH_DEMAND') ||
          errStr.includes('RESOURCE_EXHAUSTED') ||
          errStr.includes('429') ||
          err?.status === 503 ||
          err?.code === 503;

        if (isTransient) {
          console.warn(`[Gemini API] Call (model: ${modelName}, attempt: ${attempt}) failed with transient error: ${errStr}. Retrying in ${attempt * 1000}ms...`);
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          continue;
        } else {
          // If non-transient or invalid config, break out of retry loop for this model
          break;
        }
      }
    }
  }

  throw lastError;
}

// Helper to normalize concept object
function normalizeConcept(c: any, index: number = 0) {
  const adConceptObj = c.adConcept || {};
  const adScriptObj = c.adScript || {};
  const adCaptionObj = c.adCaption || {};
  const imgObj = c.imageAdCopy || {};

  const idea = adConceptObj.idea || c.idea || '';
  const hook = adScriptObj.hook || c.hook || '';
  const painPoint = adScriptObj.pinpointPain || c.painPoint || '';
  const solution = adScriptObj.solution || c.solution || '';
  const cta = adScriptObj.callToAction || c.cta || '';
  const fullScript = adScriptObj.uniqueDirection || c.fullScript || '';

  const captionText = c.caption || [
    adCaptionObj.title ? `🔥 ${adCaptionObj.title}` : '',
    adCaptionObj.pinpoint ? `❌ ${adCaptionObj.pinpoint}` : '',
    adCaptionObj.brandwiseSolution ? `✅ ${adCaptionObj.brandwiseSolution}` : '',
    adCaptionObj.uniqueOffer ? `👉 ${adCaptionObj.uniqueOffer}` : '',
  ].filter(Boolean).join('\n\n');

  return {
    id: c.id || `concept-${Date.now()}-${index + 1}`,
    timestamp: c.timestamp || Date.now(),
    angleName: c.angleName || 'Custom Ad Angle',
    adConcept: {
      idea: adConceptObj.idea || idea,
      customerAvatar: adConceptObj.customerAvatar || c.metadata?.targetAudienceSummary || 'টার্গেট অডিয়েন্স',
      angles: adConceptObj.angles || c.angleName || 'মার্কেটিং অ্যাঙ্গেল',
      uniquePoint: adConceptObj.uniquePoint || solution,
    },
    adScript: {
      hook: adScriptObj.hook || hook,
      pinpointPain: adScriptObj.pinpointPain || painPoint,
      solution: adScriptObj.solution || solution,
      callToAction: adScriptObj.callToAction || cta,
      uniqueDirection: adScriptObj.uniqueDirection || fullScript,
    },
    adCaption: {
      title: adCaptionObj.title || 'বিজ্ঞাপনের বিশেষ সুযোগ!',
      pinpoint: adCaptionObj.pinpoint || painPoint,
      brandwiseSolution: adCaptionObj.brandwiseSolution || solution,
      uniqueOffer: adCaptionObj.uniqueOffer || cta,
    },
    imageAdCopy: {
      headline: imgObj.headline || '',
      subline: imgObj.subline || '',
      imgContent: imgObj.imgContent || `Headline: ${imgObj.headline || ''}\nSubline: ${imgObj.subline || ''}`,
      imgPrompt: imgObj.imgPrompt || `Professional commercial banner photo, high quality 8k, modern aesthetic`,
    },
    // Top-level summary
    idea,
    hook,
    painPoint,
    solution,
    cta,
    fullScript,
    caption: captionText,
    metadata: c.metadata || {
      targetAudienceSummary: adConceptObj.customerAvatar || '',
      estimatedDuration: '45 Seconds',
      languageDetected: 'Bengali',
      toneUsed: 'High-Converting',
      recommendedVisuals: [],
    },
  };
}

// Response schema for Ad Concept Generation
const adConceptSchema = {
  type: Type.OBJECT,
  properties: {
    angleName: {
      type: Type.STRING,
      description: "Unique marketing angle name (e.g., 'The Frustration to Breakthrough Angle', 'The Trust Protector Angle')",
    },
    // 1. AD CONCEPT (অ্যাড কনসেপ্ট)
    adConcept: {
      type: Type.OBJECT,
      properties: {
        idea: {
          type: Type.STRING,
          description: "1. IDEA (মূল কনসেপ্ট/আইডিয়া): Core ad strategy in 1-2 powerful lines.",
        },
        customerAvatar: {
          type: Type.STRING,
          description: "2. CUSTOMER AVATAR (কাস্টমার অ্যাভাটার): Target audience demographics, pain points, desires, and avatar profile.",
        },
        angles: {
          type: Type.STRING,
          description: "3. ANGLES (মার্কেটিং অ্যাঙ্গেল ও পজিশনিং): Specific positioning angle and psychological hook approach.",
        },
        uniquePoint: {
          type: Type.STRING,
          description: "4. UNIQUE VALUE PROPOSITION (ইউনিক সেল পয়েন্ট): Unique Selling Proposition (USP) distinguishing from competitors.",
        },
      },
      required: ["idea", "customerAvatar", "angles", "uniquePoint"],
    },
    // 2. AD SCRIPT (অ্যাড স্ক্রিপ্ট)
    adScript: {
      type: Type.OBJECT,
      properties: {
        hook: {
          type: Type.STRING,
          description: "1. HOOK (প্রথম ৩ সেকেন্ডের হুক): Scroll-stopping 3-second hook line.",
        },
        pinpointPain: {
          type: Type.STRING,
          description: "2. PINPOINT / PAIN POINT (সমস্যা চিহ্নিতকরণ): Relatable core problem and frustration.",
        },
        solution: {
          type: Type.STRING,
          description: "3. SOLUTION (সমাধান): Product benefit breakdown solving the problem.",
        },
        callToAction: {
          type: Type.STRING,
          description: "4. CALL TO ACTION / REACTION (কল টু অ্যাকশন): Urgency-driven action line.",
        },
        uniqueDirection: {
          type: Type.STRING,
          description: "5. UNIQUE SCRIPT DIRECTION (ইউনিক ভিডিও ও অডিও নির্দেশিকা): Complete 30-60 sec video script with scene directions [Visual: ...] and voiceover lines [VO: ...].",
        },
      },
      required: ["hook", "pinpointPain", "solution", "callToAction", "uniqueDirection"],
    },
    // 3. AD CAPTION (পোস্ট ক্যাপশন)
    adCaption: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "1. TITLE / HEADLINE (ক্যাপশন টাইটেল): Catchy social media title with emojis.",
        },
        pinpoint: {
          type: Type.STRING,
          description: "2. PINPOINT PAIN (পেইনপয়েন্ট হাইলাইট): Highlighting the customer's dilemma in the caption.",
        },
        brandwiseSolution: {
          type: Type.STRING,
          description: "3. BRANDWISE SOLUTION (ব্র্যান্ডওয়াইজ সমাধান): How the brand delivers the ultimate solution.",
        },
        uniqueOffer: {
          type: Type.STRING,
          description: "4. UNIQUE OFFER & CTA (ইউনিক অফার ও অ্যাকশন লিংক): Special deal/discount and call to action with hashtags.",
        },
      },
      required: ["title", "pinpoint", "brandwiseSolution", "uniqueOffer"],
    },
    // 4. IMAGE AD COPY & PROMPT (ছবির ব্যানার টেক্সট ও এআই প্রম্পট)
    imageAdCopy: {
      type: Type.OBJECT,
      properties: {
        headline: {
          type: Type.STRING,
          description: "Punchy main headline for image ad banner (max 5-8 words).",
        },
        subline: {
          type: Type.STRING,
          description: "Supporting sub-headline highlighting core benefit (max 5-7 words).",
        },
        imgContent: {
          type: Type.STRING,
          description: "IMAGE CONTENT (ছবিতে বসানোর টেক্সট): Banner overlay copy combining headline and subline.",
        },
        imgPrompt: {
          type: Type.STRING,
          description: "IMAGE AI PROMPT (ইউনিক ইমেজ প্রম্পট): Detailed AI prompt for Midjourney/DALL-E/Canva specifying subject, studio lighting, palette, framing, and mood.",
        },
      },
      required: ["headline", "subline", "imgContent", "imgPrompt"],
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        targetAudienceSummary: { type: Type.STRING, description: "Brief summary of identified target audience" },
        estimatedDuration: { type: Type.STRING, description: "e.g., '45 Seconds'" },
        languageDetected: { type: Type.STRING, description: "e.g., 'Bengali', 'English', or 'Banglish'" },
        toneUsed: { type: Type.STRING, description: "The tone adopted" },
        recommendedVisuals: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-4 visual scene suggestions for video editing",
        },
      },
      required: ["targetAudienceSummary", "estimatedDuration", "languageDetected", "recommendedVisuals"],
    },
  },
  required: ["angleName", "adConcept", "adScript", "adCaption", "imageAdCopy", "metadata"],
};

// API Endpoint: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// API Endpoint: Generate Ad Concept
app.post('/api/generate-ad', async (req, res) => {
  try {
    const {
      inputType,
      productName,
      productDescription,
      targetAudience,
      problemSolved,
      offerOrPrice,
      tone,
      language,
      angleStyle,
      fileData,
      customInstructions,
      variationsCount = 1,
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured in server environment. Please configure GEMINI_API_KEY in Secrets.',
      });
    }

    const ai = getAIClient();

    // Construct master prompt
    let promptContent = `You are an elite Direct Response Copywriter, Ad Strategist, and Video Scriptwriter specializing in high-converting Facebook, Instagram, TikTok, YouTube, and Google ads.

Your goal is to construct completely unique, high-converting direct-response ad concepts based on the user's input.

--- USER INPUT DATA ---
Input Mode: ${inputType}
${productName ? `Product/Service Name: ${productName}` : ''}
${productDescription ? `Product/Service Description: ${productDescription}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${problemSolved ? `Problem Solved: ${problemSolved}` : ''}
${offerOrPrice ? `Offer / Price / Discount: ${offerOrPrice}` : ''}
Requested Tone: ${tone || 'High Converting'}
Requested Language Preference: ${language || 'Auto-detect (match input language)'}
${angleStyle ? `Special Marketing Angle: ${angleStyle}` : ''}
${customInstructions ? `Additional Custom Instructions: ${customInstructions}` : ''}

--- MANDATORY RULES ---
1. Detect or strictly adhere to the language specified:
   - If language preference is "bangla" or input is in Bengali: Write ALL output (idea, hook, painPoint, solution, cta, fullScript, caption, imageAdCopy) in clean, natural, persuasive Bengali (বাংলা).
   - If language preference is "english" or input is in English: Write in compelling Direct Response English.
   - If "banglish": Write in Banglish (Bengali spoken language written in Roman script).
   - If "auto": Automatically match the primary language of the input (Bengali or English).
2. DO NOT include generic templates or placeholders. Be extremely specific to this exact product/service and audience.
3. Hook MUST stop the scroll in the first 3 seconds (shocking stat, relatable question, pattern interrupt, or bold statement).
4. Pain Point MUST evoke genuine emotional resonance and empathy.
5. Solution MUST focus strictly on tangible benefits and results, NOT raw technical specs.
6. Full Ad Script MUST be formatted with visual directions [Visual: ...] and spoken narration [VO: ...], timed for 30-60 seconds, sounding completely conversational and human.
7. Image Ad Copy MUST be punchy and under 15 total words (headline + sub-line combined).
8. Make every variation distinct, creative, and strategically sharp.
`;

    const parts: any[] = [];

    // If file is uploaded
    if (inputType === 'document' && fileData && fileData.content) {
      let mimeType = fileData.mimeType || 'text/plain';
      const base64Data = fileData.content.includes(',') 
        ? fileData.content.split(',')[1] 
        : fileData.content;

      // If it's an image or PDF base64
      if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        });
        promptContent += `\n[NOTE: A document/file named "${fileData.name}" has been attached above. Extract product features, audience, pain points, and offer details directly from this document.]`;
      } else {
        // Plain text / json / csv
        let textContent = '';
        try {
          textContent = Buffer.from(base64Data, 'base64').toString('utf-8');
        } catch {
          textContent = fileData.content;
        }
        promptContent += `\n\n--- ATTACHED DOCUMENT CONTENT (${fileData.name}) ---\n${textContent.slice(0, 15000)}\n--- END DOCUMENT CONTENT ---`;
      }
    }

    parts.push({ text: promptContent });

    // Request generation for variation count
    const variationsToGenerate = Math.min(Math.max(1, Number(variationsCount)), 3);

    if (variationsToGenerate === 1) {
      const response = await callGeminiWithRetry(ai, {
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          systemInstruction: 'You are an expert direct response copywriter. Respond ONLY with valid JSON matching the exact schema.',
          responseMimeType: 'application/json',
          responseSchema: adConceptSchema,
          temperature: 0.8,
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json({
        success: true,
        concepts: [normalizeConcept(parsedData, 0)],
      });
    } else {
      // Multi-variation generation schema
      const multiSchema = {
        type: Type.OBJECT,
        properties: {
          concepts: {
            type: Type.ARRAY,
            items: adConceptSchema,
            description: `Array of ${variationsToGenerate} completely different ad concept angles for A/B testing.`,
          },
        },
        required: ["concepts"],
      };

      const response = await callGeminiWithRetry(ai, {
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          systemInstruction: `You are an expert direct response copywriter. Generate ${variationsToGenerate} completely unique and distinct ad concepts (different hooks, angles, and script styles) for A/B testing. Respond strictly in JSON.`,
          responseMimeType: 'application/json',
          responseSchema: multiSchema,
          temperature: 0.9,
        },
      });

      const responseText = response.text || '{"concepts":[]}';
      const parsedData = JSON.parse(responseText);

      const formattedConcepts = (parsedData.concepts || []).map((c: any, idx: number) =>
        normalizeConcept(c, idx)
      );

      return res.json({
        success: true,
        concepts: formattedConcepts,
      });
    }
  } catch (error: any) {
    console.error('Error generating ad copy:', error);
    const errStr = String(error?.message || error);
    let userMsg = 'অ্যাড কপি জেনারেট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    if (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('high demand') || errStr.includes('RESOURCE_EXHAUSTED')) {
      userMsg = 'গুগল এআই সার্ভারে বর্তমানে অতিরিক্ত চাপ রয়েছে (High Demand / Temporary Unavailable)। অনুগ্রহ করে ৫-১০ সেকেন্ড পর আবার চেষ্টা করুন।';
    } else if (error?.message) {
      userMsg = error.message;
    }
    return res.status(500).json({
      error: userMsg,
    });
  }
});

// API Endpoint: Audio TTS Preview
app.post('/api/generate-tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required for TTS.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const ai = getAIClient();

    // Clean voiceover script tags if present
    const cleanScript = text
      .replace(/\[Visual:.*?\]/gi, '')
      .replace(/\[VO:|\bVO:\s*/gi, '')
      .replace(/\[Audio:.*?\]/gi, '')
      .trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Read this ad script aloud naturally with strong emotional inflection:\n\n${cleanScript.slice(0, 1000)}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/mp3' });
    } else {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS model.' });
    }
  } catch (err: any) {
    console.error('TTS Generation error:', err);
    return res.status(500).json({ error: err.message || 'TTS generation failed.' });
  }
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
