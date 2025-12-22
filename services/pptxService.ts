import PptxGenJS from "pptxgenjs";
import { PresentationData, PresentationConfig, Tone } from "../types";

// Define themes with fonts, colors, and layout properties
const THEMES = {
  [Tone.PROFESSIONAL]: {
    background: "F8FAFC", // Slate-50
    titleColor: "0F172A", // Slate-900
    subtitleColor: "475569", // Slate-600
    accentColor: "2563EB", // Blue-600
    bodyColor: "334155", // Slate-700
    fontFace: "Arial",
    headerShape: null,
    footerColor: "94A3B8",
  },
  [Tone.CREATIVE]: {
    background: "111827", // Gray-900
    titleColor: "F9FAFB", // Gray-50
    subtitleColor: "D1D5DB", // Gray-300
    accentColor: "8B5CF6", // Violet-500
    bodyColor: "E5E7EB", // Gray-200
    fontFace: "Verdana",
    headerShape: null,
    footerColor: "6B7280",
  },
  [Tone.ACADEMIC]: {
    background: "FFFFFF", // White
    titleColor: "000000", // Black
    subtitleColor: "333333", // Dark Gray
    accentColor: "991B1B", // Red-800
    bodyColor: "1F2937", // Gray-800
    fontFace: "Times New Roman",
    headerShape: { type: "rect", x: 0, y: 0, w: "100%", h: 0.15, color: "991B1B" }, // Red top bar
    footerColor: "6B7280",
  },
  [Tone.PERSUASIVE]: {
    background: "FFFFFF",
    titleColor: "111827",
    subtitleColor: "374151",
    accentColor: "DC2626", // Red-600
    bodyColor: "000000",
    fontFace: "Impact",
    headerShape: null,
    footerColor: "9CA3AF",
  },
  [Tone.SIMPLE]: {
    background: "FFFFFF",
    titleColor: "171717",
    subtitleColor: "525252",
    accentColor: "171717", // Neutral
    bodyColor: "262626",
    fontFace: "Helvetica",
    headerShape: null,
    footerColor: "A3A3A3",
  },
};

export const createPptxFile = async (data: PresentationData, config: PresentationConfig) => {
  const pres = new PptxGenJS();
  
  // Select Theme
  const theme = THEMES[config.tone] || THEMES[Tone.PROFESSIONAL];

  // Set Presentation Metadata
  pres.title = data.title;
  pres.subject = config.topic;
  pres.layout = "LAYOUT_16x9";

  // --- Title Slide ---
  const slide1 = pres.addSlide();
  
  // Background
  slide1.background = { color: theme.background };
  
  // Decorative Theme Element for Title Slide
  if (config.tone === Tone.CREATIVE) {
     slide1.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '40%', h: '100%', fill: { color: theme.accentColor, transparency: 80 } });
  } else if (config.tone === Tone.PROFESSIONAL) {
     slide1.addShape(pres.ShapeType.rect, { x: 0, y: 6.5, w: '100%', h: 1, fill: { color: theme.accentColor } });
  }

  // Title
  slide1.addText(data.title, {
    x: 0.5,
    y: 2,
    w: "90%",
    h: 1.5,
    fontSize: 48,
    bold: true,
    color: theme.titleColor,
    align: "center",
    fontFace: theme.fontFace,
  });

  // Subtitle
  slide1.addText(data.subtitle, {
    x: 1,
    y: 3.5,
    w: "80%",
    h: 1,
    fontSize: 24,
    color: theme.subtitleColor,
    align: "center",
    fontFace: theme.fontFace,
  });

  slide1.addNotes(data.slides[0]?.speakerNotes || "Welcome to the presentation.");

  // --- Content Slides ---
  for (const [index, slideContent] of data.slides.entries()) {
    const slide = pres.addSlide();
    slide.background = { color: theme.background };

    // Header Decoration
    if (theme.headerShape) {
       slide.addShape(pres.ShapeType.rect, { 
           x: theme.headerShape.x, 
           y: theme.headerShape.y, 
           w: theme.headerShape.w, 
           h: theme.headerShape.h, 
           fill: { color: theme.headerShape.color } 
       });
    }

    // Slide Title
    slide.addText(slideContent.title, {
      x: 0.5,
      y: 0.4,
      w: "90%",
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: theme.titleColor,
      fontFace: theme.fontFace,
    });

    // Decorative line under title (if not academic)
    if (config.tone !== Tone.ACADEMIC) {
        slide.addShape(pres.ShapeType.line, {
            x: 0.5, y: 1.3, w: 9, h: 0, line: { color: theme.accentColor, width: 2 }
        });
    }

    // Content Layout
    let textX = 0.5;
    let textW = 9;

    if (config.includeImages) {
      textW = 5.5; // Shrink text area to make room for image
      
      // Use Pollinations.ai for generated images
      const encodedDesc = encodeURIComponent(slideContent.imageDescription);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedDesc}?width=800&height=600&nologo=true`;

      slide.addImage({
        path: imageUrl,
        x: 6.2,
        y: 1.5,
        w: 3.3,
        h: 4.5,
        sizing: { type: "contain", w: 3.3, h: 4.5 }, // Use contain or cover based on preference
      });
    }

    // Bullet Points
    const bulletText = slideContent.bulletPoints.map(bp => ({ text: bp, options: { breakLine: true } }));
    
    slide.addText(bulletText, {
      x: textX,
      y: 1.5,
      w: textW,
      h: 4.5,
      fontSize: 18,
      color: theme.bodyColor,
      bullet: { type: "bullet", color: theme.accentColor },
      fontFace: theme.fontFace,
      lineSpacing: 32,
      valign: "top",
    });

    // Citations
    if (config.includeCitations && slideContent.citations && slideContent.citations.length > 0) {
        const citationText = slideContent.citations.join("; ");
        slide.addText(`Source: ${citationText}`, {
            x: 0.5,
            y: 4.8, // Positioned near bottom
            w: 9,
            h: 0.4,
            fontSize: 10,
            color: theme.footerColor,
            fontFace: theme.fontFace,
            italic: true,
        });
    }

    // Speaker Notes
    if (config.includeSpeakerNotes && slideContent.speakerNotes) {
      slide.addNotes(slideContent.speakerNotes);
    }

    // Footer
    slide.addText(`${index + 1} | ${data.title}`, {
      x: 0.5,
      y: 5.2,
      w: 9,
      h: 0.3,
      fontSize: 10,
      color: theme.footerColor,
      align: "right",
      fontFace: theme.fontFace,
    });
  }

  // Save the file
  const fileName = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`;
  await pres.writeFile({ fileName });
};