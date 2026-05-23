// const fs = require("fs");

// //call OpenRouter API
// const callOpenRouter = async (messages, maxTokens = 2000) => {
//   const response = await fetch(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": "http://localhost:8000",
//         "X-Title": "TravelPlanner AI",
//       },
//       body: JSON.stringify({
//         // model: "google/gemma-3-27b-it:free",
//         // model: "nvidia/nemotron-nano-12b-v2-vl:free",
//         model: "google/gemma-4-26b-a4b-it:free",
//         max_tokens: maxTokens,
//         messages: messages,
//       }),
//     }
//   );

//   const data = await response.json();
//   console.log("STATUS:", response.status);
//   console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

//   if (!response.ok) {
//     throw new Error(data.error?.message || "OpenRouter API error");
//   }

//   return data.choices[0].message.content;
// };

// //read uploaded files and pull out booking details
// exports.extractTravelData = async (files) => {
//   const messageContent = [];

//   for (const file of files) {
//     const fileData = fs.readFileSync(file.path);
//     const base64 = fileData.toString("base64");
//     const mimetype = file.mimetype;

//     if (mimetype === "application/pdf") {
//       messageContent.push({
//         type: "text",
//         text: `[User uploaded a PDF file: ${file.originalname}. Extract any travel booking information you can.]`,
//       });
//     } else {
//       // images get sent as base64 so the model cansee them
//       messageContent.push({
//         type: "image_url",
//         image_url: {
//           url: `data:${mimetype};base64,${base64}`,
//         },
//       });
//     }
//   }

//   messageContent.push({
//     type: "text",
//     text: `Extract all travel booking information from the uploaded document(s). Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
// {
//   "flights": [{ "flightNumber": "", "airline": "", "departure": { "airport": "", "city": "", "date": "", "time": "" }, "arrival": { "airport": "", "city": "", "date": "", "time": "" }, "class": "", "pnr": "" }],
//   "hotels": [{ "name": "", "city": "", "checkIn": "", "checkOut": "", "roomType": "", "confirmationNumber": "" }],
//   "trains": [{ "trainNumber": "", "from": "", "to": "", "date": "", "departureTime": "", "arrivalTime": "", "class": "" }],
//   "travelerName": "",
//   "travelDates": { "start": "", "end": "" },
//   "destinations": []
// }
// Fill only what you can find. Use empty strings or empty arrays for missing data.`,
//   });

//   const text = await callOpenRouter(
//     [{ role: "user", content: messageContent }],
//     2000
//   );

//   try {
//     const cleaned = text.replace(/```json|```/g, "").trim();
//     return JSON.parse(cleaned);
//   } catch {
//     return { raw: text };
//   }
// };

// //take extracted booking data and build a day by day itinerary
// exports.generateItinerary = async (extractedData) => {
//   const prompt = `You are a travel planner. Based on this extracted booking data, create a detailed day-by-day travel itinerary.

// Booking data:
// ${JSON.stringify(extractedData, null, 2)}

// Return ONLY a valid JSON object with NO markdown, no explanation, in this exact format:
// {
//   "title": "Trip title",
//   "destination": "Primary destination",
//   "startDate": "YYYY-MM-DD",
//   "endDate": "YYYY-MM-DD",
//   "summary": "2-3 sentence trip summary",
//   "days": [
//     {
//       "day": 1,
//       "date": "YYYY-MM-DD",
//       "title": "Day title",
//       "activities": [
//         {
//           "time": "HH:MM",
//           "title": "Activity title",
//           "description": "Details",
//           "location": "Location name",
//           "type": "flight|hotel|activity|transport|meal|other"
//         }
//       ]
//     }
//   ]
// }`;

//   const text = await callOpenRouter([{ role: "user", content: prompt }], 4000);

//   try {
//     const cleaned = text.replace(/```json|```/g, "").trim();
//     return JSON.parse(cleaned);
//   } catch {
//     throw new Error("Failed to parse AI itinerary response");
//   }
// };
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = "gemini-2.5-flash";

// convert file to base64 part for Gemini
const fileToGenerativePart = (filePath, mimeType) => {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
};

//read uploaded files and extract booking details
exports.extractTravelData = async (files) => {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const parts = [];

  for (const file of files) {
    if (file.mimetype === "application/pdf") {
      // for PDFs just tell Gemini the filename
      parts.push({
        text: `[User uploaded a PDF: ${file.originalname}. Extract travel booking info from it.]`,
      });
    } else {
      // for images send as base64 — Gemini can actually see them
      parts.push(fileToGenerativePart(file.path, file.mimetype));
    }
  }

  parts.push({
    text: `Extract all travel booking information from the uploaded document(s). Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "flights": [{ "flightNumber": "", "airline": "", "departure": { "airport": "", "city": "", "date": "", "time": "" }, "arrival": { "airport": "", "city": "", "date": "", "time": "" }, "class": "", "pnr": "" }],
  "hotels": [{ "name": "", "city": "", "checkIn": "", "checkOut": "", "roomType": "", "confirmationNumber": "" }],
  "trains": [{ "trainNumber": "", "from": "", "to": "", "date": "", "departureTime": "", "arrivalTime": "", "class": "" }],
  "travelerName": "",
  "travelDates": { "start": "", "end": "" },
  "destinations": []
}
Fill only what you can find. Use empty strings or empty arrays for missing data.`,
  });

  const result = await model.generateContent(parts);
  const text = result.response.text();
  console.log("Gemini extraction response:", text);

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { raw: text };
  }
};

//take extracted data and build day by day itinerary
exports.generateItinerary = async (extractedData) => {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `You are a travel planner. Based on this extracted booking data, create a detailed day-by-day travel itinerary.

Booking data:
${JSON.stringify(extractedData, null, 2)}

Return ONLY a valid JSON object with NO markdown, no explanation, in this exact format:
{
  "title": "Trip title",
  "destination": "Primary destination",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "summary": "2-3 sentence trip summary",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day title",
      "activities": [
        {
          "time": "HH:MM",
          "title": "Activity title",
          "description": "Details",
          "location": "Location name",
          "type": "flight|hotel|activity|transport|meal|other"
        }
      ]
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log("Gemini itinerary response:", text);

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI itinerary response");
  }
};
