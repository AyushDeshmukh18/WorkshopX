export interface CaptainKitMessages {
  language: 'en' | 'hi' | 'te';
  languageName: string;
  whatsappHeadline: string;
  whatsappMessage: string;
}

export function getCaptainMessages(captainName: string, collegeName: string, referralUrl: string): CaptainKitMessages[] {
  return [
    {
      language: 'en',
      languageName: 'English',
      whatsappHeadline: 'Official NxtWave CCBP 4.0 Campus Workshop Announcement',
      whatsappMessage: `🚨 *Official Update for Final-Year Students at ${collegeName}*

Looking to build a production AI project for your placement resume before companies visit campus?

Join the official hands-on workshop by *NxtWave (WEF Technology Pioneer 2024 & NSDC Partner)*:
👉 *"Build Your First AI Project in 60 Minutes"*

✅ Zero theoretical slides — live hands-on coding from minute 1
✅ Learn practical AI engineering designed by IIT alumni & ex-Amazon/Google mentors
✅ Build & deploy a live AI web app you can demonstrate in technical interviews
✅ Official verifiable NxtWave CCBP 4.0 QR certificate recognized by 2,500+ hiring companies
✅ 100% Free workshop initiative for ${collegeName} students

🎟️ *Claim your free seat for the ${collegeName} cohort:*
👉 ${referralUrl}

_Note: Strictly capped at 500 verified seats. Registration closes once capacity is reached._`,
    },
    {
      language: 'hi',
      languageName: 'Hindi (हिंदी)',
      whatsappHeadline: 'NxtWave CCBP 4.0 कैंपस वर्कशॉप सूचना',
      whatsappMessage: `🚨 *${collegeName} के सभी फाइनल-ईयर छात्रों के लिए महत्वपूर्ण सूचना*

क्या आप अपने कैंपस प्लेसमेंट रिज्यूमे के लिए एक असली, डिप्लॉयड AI प्रोजेक्ट बनाना चाहते हैं?

*NxtWave (World Economic Forum Tech Pioneer 2024 & NSDC पार्टनर)* के विशेष लाइव वर्कशॉप से जुड़ें:
👉 *"Build Your First AI Project in 60 Minutes"*

✅ कोई थ्योरी नहीं — पहले मिनट से IITian मेंटर्स के साथ लाइव कोडिंग
✅ ऐसा AI वेब ऐप जो आप टेक्निकल इंटरव्यू में लाइव चलाकर दिखा सकें
✅ 2,500+ हायरिंग कंपनियों द्वारा मान्यता प्राप्त NxtWave CCBP 4.0 QR सर्टिफिकेट
✅ 100% मुफ्त (छात्रों के लिए विशेष स्किलिंग पहल)

🎟️ *${collegeName} के लिए अपनी फ्री सीट अभी सुरक्षित करें:*
👉 ${referralUrl}

_सीमित सीटें (अधिकतम 500)। तुरंत रजिस्टर करें।_`,
    },
    {
      language: 'te',
      languageName: 'Telugu (తెలుగు)',
      whatsappHeadline: 'NxtWave CCBP 4.0 క్యాంపస్ వర్క్‌షాప్ ప్రకటన',
      whatsappMessage: `🚨 *${collegeName} ఫైనల్ ఇయర్ విద్యార్థులకు ముఖ్య గమనిక*

మీ క్యాంపస్ ప్లేస్‌మెంట్స్ రెజ్యూమ్ కోసం రియల్ AI ప్రాజెక్ట్ లైవ్ గా బిల్డ్ చేసి డిప్లాయ్ చేయాలనుకుంటున్నారా?

*NxtWave (WEF Technology Pioneer 2024 & NSDC పార్టనర్)* వారి ప్రత్యేక ఉచిత లైవ్ వర్క్‌షాప్‌లో చేరండి:
👉 *"Build Your First AI Project in 60 Minutes"*

✅ ఎలాంటి థియరీ స్లైడ్స్ లేవు — మొదటి నిమిషం నుంచే IITian ట్రైనర్లతో లైవ్ కోడింగ్
✅ ఇంటర్వ్యూలలో డెమో చూపించగల లైవ్ వర్కింగ్ AI అప్లికేషన్
✅ 2,500+ కంపెనీలు గుర్తించే అధికారిక NxtWave CCBP 4.0 వెరిఫైయబుల్ QR సర్టిఫికేట్
✅ 100% ఉచితం (${collegeName} విద్యార్థుల కోసం ప్రత్యేకం)

🎟️ *మీ ఉచిత సీటును ఇప్పుడే రిజిస్టర్ చేసుకోండి:*
👉 ${referralUrl}

_కేవలం 500 సీట్లు మాత్రమే కలవు. త్వరపడండి._`,
    },
  ];
}
