const { getModel } = require('../config/gemini');
const ChatMessage = require('../models/ChatMessage');
const logger = require('../utils/logger');

/**
 * AgroBot System Prompt — strict, specific, Kenya-context agricultural AI.
 * Keep it directive so Gemini doesn't drift into generic advice.
 */
const AGROVET_SYSTEM_PROMPT = `You are AgroBot, a specialist AI assistant built into an agrovet shop platform in Kenya. You serve farmers directly.

YOUR ROLE:
- Answer questions about crops, livestock, pests, diseases, fertilisers, veterinary drugs, and farm management
- Provide Kenya-specific advice: reference climate zones (highlands, central rift, semi-arid lowlands), county-level context, local product names, and Kenya Agricultural and Livestock Research Organization (KALRO) guidance
- When inventory context is provided in [AVAILABLE INVENTORY], recommend specific products from it with prices in KES

MANDATORY RESPONSE FORMAT — always use this structure:
**Diagnosis:** What is the problem or topic?
**Cause:** Why is this happening / what is causing it?
**Recommended Action:** What should the farmer do right now? Be specific and practical.
**Treatment / Product:** Name exact products, dosages, application rates, and frequency. Use KES for prices.
**Safety Note:** Any handling warnings, withdrawal periods, or when to consult a vet or agronomist.

STRICT RULES:
1. Be specific. Never give vague advice like "consult a professional" without first providing actionable guidance.
2. Use exact measurements: ml/litre, g/kg, litres/acre or litres/ha, KES for prices.
3. If the farmer describes symptoms, give your best diagnosis based on those symptoms — do not ask multiple clarifying questions. Ask ONE focused follow-up at most.
4. Off-topic questions (politics, general knowledge, coding, etc.): respond only with "I can only help with agricultural and veterinary topics. Please ask me about your crops, livestock, or farm management."
5. Never say "I don't know" without offering a next step or alternative guidance.
6. Keep responses under 300 words unless a complex multi-step treatment protocol is required.
7. If the [AVAILABLE INVENTORY] includes a relevant product, mention it by name with its price.

YOUR DEEP KNOWLEDGE AREAS:
- Crop pests: Fall Armyworm (Spodoptera frugiperda), Thrips, Aphids, Whitefly, Stemborer, Striga weed, Leaf miner
- Crop diseases: Maize Lethal Necrosis (MLN), Grey Leaf Spot, Blight, Rust, Powdery Mildew, Cassava Mosaic
- Livestock diseases: East Coast Fever (ECF / Theileriosis), Foot and Mouth Disease (FMD), Newcastle Disease (ND), Lumpy Skin Disease, Brucellosis, Mastitis, Bloat, Black Quarter
- Veterinary drugs: Oxytetracycline, Penicillin-Streptomycin, Diminazene aceturate (Berenil), Albendazole, Ivermectin, Fenbendazole
- Fertilisers: DAP (Di-Ammonium Phosphate), CAN (Calcium Ammonium Nitrate), NPK blends, Urea, foliar feeds
- Soil: pH correction with Agricultural Lime, common Kenyan soil types by region
- Pesticides: Chlorpyrifos, Lambda-cyhalothrin, Emamectin Benzoate, Mancozeb, Metalaxyl, Copper-based fungicides
- Animal feeds: dairy meal, layer mash, growers mash, silage, mineral licks`;

/**
 * Send a chat message to Gemini and persist the conversation.
 * @param {string} userId
 * @param {string} sessionId
 * @param {string} userMessage   — the raw message from the farmer
 * @param {Array}  inventoryContext — matched Product documents
 * @returns {{ response: string, sessionId: string, tokensUsed: number }}
 */
const sendChatMessage = async (userId, sessionId, userMessage, inventoryContext = []) => {
  try {
    const model = getModel();

    // ── 1. Load last 10 messages from this session as conversation memory ──
    const previousMessages = await ChatMessage.find({ sessionId, userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Build history oldest-first. These are PAST messages only.
    const conversationHistory = previousMessages
      .reverse()
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    // ── 2. Build inventory context string ──────────────────────────────────
    let inventoryContextStr = '';
    if (inventoryContext?.length > 0) {
      inventoryContextStr = '\n\n[AVAILABLE INVENTORY]\n';
      inventoryContext.forEach((p) => {
        inventoryContextStr += `• ${p.name} (${p.category}) — ${p.quantity} ${p.unit} in stock @ KES ${p.price}\n`;
      });
    }

    // ── 3. Enrich the current user message with inventory if relevant ──────
    // Only append inventory — do NOT include userMessage in history again.
    const enrichedMessage = inventoryContextStr
      ? `${userMessage}${inventoryContextStr}`
      : userMessage;

    // ── 4. Build the Gemini chat with full history (NOT including current msg) ──
    const chat = model.startChat({
      history: conversationHistory,     // past messages only
      generationConfig: {
        maxOutputTokens: 2000,          // allow detailed treatment protocols
        temperature: 0.4,              // lower = more precise, less hallucination
        topP: 0.85,
        topK: 40,
      },
      systemInstruction: {
        role: 'user',
        parts: [{ text: AGROVET_SYSTEM_PROMPT }],
      },
    });

    // ── 5. Send the current message (Gemini adds it to the turn internally) ─
    const result = await chat.sendMessage(enrichedMessage);
    const aiResponse = result.response.text();
    const tokensUsed = result.response?.usageMetadata?.outputTokens || 0;

    // ── 6. Persist both messages to DB ────────────────────────────────────
    // Save the raw user message (without injected inventory noise)
    await ChatMessage.create({
      userId,
      sessionId,
      role: 'user',
      content: userMessage,
      relatedProducts: inventoryContext.map((p) => p._id),
    });

    // Save the AI response
    await ChatMessage.create({
      userId,
      sessionId,
      role: 'model',
      content: aiResponse,
      tokensUsed,
    });

    return { response: aiResponse, sessionId, tokensUsed };
  } catch (error) {
    logger.error('Gemini API error:', error);
    throw new Error('Failed to process chat message. Please try again later.');
    console.error("🔥 REAL ERROR START 🔥");
    console.error(error);
    console.error("🔥 REAL ERROR END 🔥");
    throw error;
  }
};

/**
 * Generate inventory insights using Gemini analysis.
 * @param {Array} productsData
 * @returns {Promise<Array>}
 */
const generateInventoryInsights = async (productsData) => {
  try {
    const model = getModel();

    const prompt = `Analyse this agrovet inventory data and provide 3-5 actionable business insights in JSON format.

Inventory data:
${JSON.stringify(productsData, null, 2)}

Return a JSON array with insights like:
[
  { "insight": "description", "priority": "high|medium|low", "action": "recommended action" },
  ...
]

Focus on:
- Stock level optimization
- Upcoming expiry issues
- Sales trends
- Profitability opportunities
- Risk mitigation

Return ONLY valid JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      return [
        {
          insight: responseText,
          priority: 'medium',
          action: 'Review inventory management strategy',
        },
      ];
    }
  } catch (error) {
    logger.error('Inventory insights generation error:', error);
    throw new Error('Failed to generate insights');
      console.error("🔥 REAL ERROR START 🔥");
  console.error(error);
  console.error("🔥 REAL ERROR END 🔥");
  throw error;
  }
};

module.exports = {
  sendChatMessage,
  generateInventoryInsights,
  AGROVET_SYSTEM_PROMPT,
};