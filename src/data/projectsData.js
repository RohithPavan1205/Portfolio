export const projectsData = [
  {
    id: "airlive",
    name: "AirLive",
    shortDescription: "A feature-rich desktop live streaming application built with Qt/QML and Qt Design Studio, delivering a premium dark neon UI for streamers and content creators on Windows/macOS/Linux.",
    fullDescription: `AirLive is a fully custom desktop live streaming application modeled after OBS Studio (Open Broadcaster Software). Built using Qt 6 and QML with Qt Design Studio, it targets streamers, content creators, educators, and live event broadcasters who want a professional-grade tool with a sleek, modern dark neon interface.

PROBLEM SOLVED
Most open-source streaming tools like OBS have dated UIs and steep learning curves. AirLive aims to provide the same power with a polished, intuitive interface designed with a premium dark neon aesthetic, making it approachable for new creators while retaining full power for professionals.

CORE FEATURES
1. Scene Management: Multiple scenes with drag-and-drop source arrangement
2. Source System: Display/Window Capture, Webcam, Media Source, Browser Source
3. Audio Mixer: Multi-track audio monitoring, per-source volume control with filters
4. Stream & Record: RTMP streaming to YouTube/Twitch, local recording (MP4/MKV)
5. UI/UX: Built entirely in QML with Qt Design Studio, smooth animations`,
    category: "Desktop Application",
    status: "In active development",
    year: "2025",
    type: "Independent · Desktop",
    accent: "#e8a000",
    stat: { label: "Framework", value: "Qt 6.x" },
    techStack: [
      { name: "Qt 6", icon: "https://cdn.simpleicons.org/qt" },
      { name: "C++", icon: "https://cdn.simpleicons.org/cplusplus" },
      { name: "CMake", icon: "https://cdn.simpleicons.org/cmake" },
      { name: "FFmpeg", icon: "https://api.iconify.design/logos:ffmpeg.svg" }
    ],
    features: [
      "Multi-source scene composition (camera, screen, media, browser)",
      "Dark neon UI with professional broadcast aesthetics",
      "Real-time audio/video mixing and monitoring",
      "Stream to multiple platforms simultaneously",
      "Built with Qt Quick for GPU-accelerated fluid animations"
    ],
    images: [
      "/projects/AirLive/1.png",
      "/projects/AirLive/13.png",
      "/projects/AirLive/7.png",
      "/projects/AirLive/2.png"
    ]
  },
  {
    id: "aipoint",
    name: "AiPoint",
    shortDescription: "AiPoint is a unified AI creative platform where users generate professional-grade images, videos, and audio using best-in-class AI models — all in one premium web interface.",
    fullDescription: `AiPoint is a full-stack AI creative SaaS platform that brings together image, video, and audio generation in a single unified studio. Targeting creators, marketers, designers, and businesses, it abstracts the complexity of multiple AI APIs (FAL.ai, Replicate, xAI) behind a clean, premium dark-themed UI.

PROBLEM SOLVED
Accessing top-tier AI generation models requires juggling multiple platforms, API keys, and pricing structures. AiPoint centralizes everything — offering a single login, one credit wallet, and a studio interface that handles prompt engineering, upscaling, and file storage automatically.

CORE MODULES
- IMAGE GEN STUDIO: 8 AI models (FLUX, Ideogram, Imagen 4) with upscaling and reference images.
- VIDEO GEN STUDIO: 5 AI models (Kling 3.0, Veo 3.1) with T2V, I2V, and Multi-Shot modes.
- AUDIO GEN STUDIO: Kokoro TTS, ElevenLabs, TangoFlux for SFX, Stable Audio 2.5 for music.
- CREDIT SYSTEM: Stripe subscription + one-time top-ups with full wallet integration.
- ADMIN DASHBOARD: User management, MRR analytics, model toggle controls.
- STORAGE: Cloudflare R2 per-user media library.`,
    category: "AI SaaS Platform",
    status: "In development",
    year: "2025",
    type: "Freelance · Full-Stack",
    accent: "#f5c518",
    stat: { label: "AI Models", value: "20+" },
    techStack: [
      { name: "React", icon: "https://cdn.simpleicons.org/react" },
      { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript" },
      { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase" },
      { name: "Tailwind CSS", icon: "https://api.iconify.design/logos:tailwindcss-icon.svg" },
      { name: "Stripe", icon: "https://cdn.simpleicons.org/stripe" },
      { name: "Cloudflare", icon: "https://cdn.simpleicons.org/cloudflare" },
      { name: "Replicate", icon: "https://cdn.simpleicons.org/replicate" }
    ],
    features: [
      "8 image models (FREE to LEGEND tier), 5 video models, 7 audio models",
      "Tiered credit system with Stripe subscription billing",
      "Community platform with likes, follows, and trending feeds",
      "Admin dashboard for model control, revenue analytics, user management",
      "Enterprise-grade infra: Supabase + Cloudflare CDN, zero egress storage"
    ],
    images: [
      "/projects/AiPoint/Screenshot_2026-03-18_at_8.09.56_PM.png",
      "/projects/AiPoint/Screenshot_2026-03-18_at_8.10.12_PM.png",
      "/projects/AiPoint/WhatsApp_Image_2026-03-18_at_20.12.41.jpeg",
      "/projects/AiPoint/WhatsApp_Image_2026-03-18_at_20.12.45.jpeg"
    ]
  },
  {
    id: "agriscan",
    name: "Crop Doctor",
    shortDescription: "A machine learning and deep learning system that predicts crop diseases from leaf images, combining classical ML baselines with an advanced ResNet50 transfer learning model.",
    fullDescription: `AgriScan is a comprehensive crop disease prediction system developed as a research and deployment pipeline. It takes leaf images as input and predicts the disease class, followed by actionable treatment recommendations for farmers and agronomists.

PROBLEM SOLVED
Crop diseases cause significant agricultural losses globally. Early and accurate identification of plant diseases is critical for timely intervention. AgriScan automates this visual diagnosis using AI, making expert-level disease detection accessible without specialized agronomic knowledge.

PIPELINE OVERVIEW
- DATA LOADING & EDA: Automated dataset bounding, brightness analysis, and visualization.
- FEATURE EXTRACTION: Color hist methods and scalable RGB analyses.
- ML BASELINES: Logistic regression, Random Forest, SVM and complex voting ensemble models.
- DEEP LEARNING: Transfer Learning with ResNet50 & EfficientNetB0 (Fine-tuning, callbacks).
- DISEASE RECOMMENDATION ENGINE: Suggests chemical and biological remedies per-class post-prediction.`,
    category: "ML / Computer Vision",
    status: "Ready for deployment",
    year: "2024",
    type: "Research · Computer Vision",
    accent: "#4CAF50",
    stat: { label: "Accuracy", value: "91%" },
    techStack: [
      { name: "Python", icon: "https://cdn.simpleicons.org/python" },
      { name: "TensorFlow", icon: "https://cdn.simpleicons.org/tensorflow" },
      { name: "Keras", icon: "https://cdn.simpleicons.org/keras" },
      { name: "Scikit-learn", icon: "https://cdn.simpleicons.org/scikitlearn" },
      { name: "OpenCV", icon: "https://cdn.simpleicons.org/opencv" },
      { name: "Pandas", icon: "https://cdn.simpleicons.org/pandas" }
    ],
    features: [
      "Transfer learning with pre-trained ResNet50 + custom classifier heads",
      "Multi-model baseline comparison evaluating Random Forest & Gradient Boosts",
      "Detailed color histogram and deep CNN latent feature extraction",
      "Comprehensive ROC AUC multi-class analysis with detailed visualizations",
      "Actionable treatment suggestions (chemical, biological) generated post-prediction"
    ],
    images: [
      "/projects/AgriScan/WhatsApp_Image_2026-03-17_at_21.18.41.jpeg",
      "/projects/AgriScan/Screenshot_2026-03-18_at_10.45.08_PM.png",
      "/projects/AgriScan/confusion_matrix_resnet50.png",
      "/projects/AgriScan/roc_curve_voting.png",
      "/projects/AgriScan/class_distribution.png"
    ]
  },
  {
    id: "astra",
    name: "Astra",
    shortDescription: "An enterprise-grade AI customer support portal built completely around Salesforce Experience Cloud and Agentforce AI for unified self-service resolution.",
    fullDescription: `Astra is a comprehensive AI-powered customer support and self-resolution platform built natively on Salesforce. It serves as a customer-facing Experience Cloud portal where users can authenticate, search knowledge articles, get instant AI answers, submit support cases, and track them end-to-end.

PROBLEM SOLVED
Traditional support systems create friction: customers raise tickets for problems that already have documented solutions. Astra routes customers through AI and Knowledge before allowing case creation — reducing support ticket volume, improving resolution time, and building an ever-growing knowledge base from every resolved case.

FEATURE MODULES
1. CUSTOMER PORTAL (Experience Cloud): Self-signup, profile management, and session control.
2. KNOWLEDGE BASE: Document lifecycle tracking, categories, SOSL LWC integrations.
3. GUIDED SELF-RESOLUTION FLOW: Proposes articles before escalating to formal cases.
4. AGENTFORCE AI: Grounded securely onto the organization's Knowledge Base to avoid hallucinations entirely while parsing support context.
5. MULTI-LANGUAGE SUPPORT: Full routing available natively in English, Hindi, and Telugu.`,
    category: "Salesforce / Enterprise",
    status: "Architecture finalized",
    year: "2025",
    type: "Enterprise · Salesforce",
    accent: "#00a1e0",
    stat: { label: "Features", value: "25+" },
    techStack: [
      { name: "Salesforce", icon: "https://api.iconify.design/logos:salesforce.svg" },
      { name: "Apex", icon: "https://api.iconify.design/logos:salesforce.svg" },
      { name: "LWC", icon: "https://api.iconify.design/logos:salesforce.svg" }
    ],
    features: [
      "Agentforce AI agent with natural language intelligence and Knowledge base grounding",
      "Guided Self-Resolution Flow deflecting high-friction support cases seamlessly",
      "Automated case routing by leveraging Service Cloud Queues and Assignment Rules",
      "Knowledge Learning Loop: converting newly resolved cases into permanent KB articles",
      "Seamless and instant multi-language runtime available across English, Hindi, and Telugu"
    ],
    images: [
      "/projects/Astra/Screenshot_2026-03-18_at_10.47.40_PM.png",
      "/projects/Astra/Screenshot_2026-03-18_at_10.50.59_PM.png",
      "/projects/Astra/Screenshot_2026-03-18_at_10.51.32_PM.png"
    ]
  }
];
