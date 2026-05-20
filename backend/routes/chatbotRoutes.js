const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Custom rule-based chatbot fallback if Gemini API key is missing
const getRuleBasedResponse = (message, products) => {
  const msg = message.toLowerCase();

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! I am your Elegant Fashion virtual assistant. How can I help you today?";
  }
  if (msg.includes('product') || msg.includes('what do you sell') || msg.includes('items') || msg.includes('shop')) {
    const list = products.slice(0, 5).map(p => `- ${p.name} (Rs. ${p.price.toLocaleString()})`).join('\n');
    return `We offer premium fashion products. Here are some of our featured items:\n${list || '- No products in store right now.'}\n\nYou can view all of them on our Shop page!`;
  }
  if (msg.includes('shipping') || msg.includes('delivery')) {
    return "We offer nationwide delivery across Pakistan. Delivery typically takes 3-5 business days. Shipping is Rs. 200, but free for orders over Rs. 5,000!";
  }
  if (msg.includes('Easypaisaaccount number') || msg.includes('easypaisa number') || msg.includes('send money')) {
    return "Our official EasyPaisa Account Number is 0342-9166926 (Account Title: Bahadur Ali). Please submit the Transaction ID during checkout.";
  }

  if (msg.includes('payment') || msg.includes('easypaisa') || msg.includes('pay') || msg.includes('cod')) {
    return "We support Cash on Delivery (COD) and EasyPaisa. During checkout, you can select EasyPaisa to view payment instructions and send us the transaction proof.";
  }
  if (msg.includes('contact') || msg.includes('support') || msg.includes('phone') || msg.includes('whatsapp')) {
    return "You can click on the floating WhatsApp button to chat directly with our team, or fill out the contact form on our Contact page.";
  }

  if (msg.includes('best selling') || msg.includes('best product') || msg.includes('top product') || msg.includes('popular')) {
    // We sort by rating if available, or just take featured ones
    const bestProducts = products
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
      .map(p => `- ${p.name} (Rs. ${p.price.toLocaleString()})`)
      .join('\n');
    return `Our highest-rated and most popular products are:\n${bestProducts}\n\nVisit our Shop page to discover more!`;
  }

  if (msg.includes('discount') || msg.includes('sale') || msg.includes('promo')) {
    return "Currently, we offer FREE nationwide shipping on all orders over Rs. 5,000! Keep an eye on our homepage for seasonal sales.";
  }

  if (msg.includes('return') || msg.includes('exchange') || msg.includes('refund')) {
    return "We have a 7-day return and exchange policy. If the item is defective or incorrect, please reach out via WhatsApp immediately for a replacement.";
  }

  if (msg.includes('location') || msg.includes('address') || msg.includes('where are you')) {
    return "Our flagship store is located in hayataAbad,PESHAWAR, Pakistan. We also deliver nationwide!";
  }

  // Search for specific product queries
  for (const product of products) {
    if (msg.includes(product.name.toLowerCase()) || (product.category && msg.includes(product.category.toLowerCase()))) {
      return `Yes! We have the "${product.name}" in category "${product.category}" for Rs. ${product.price.toLocaleString()}. It is ${product.countInStock > 0 ? 'in stock' : 'currently out of stock'}. Would you like me to guide you to the Shop page?`;
    }
  }

  return "I'm sorry, I didn't quite catch that. You can ask me about our products, shipping, payment methods, or click the WhatsApp button to chat directly with our support team!";
};

// @desc    Handle chat message
// @route   POST /api/chat
// @access  Public
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const products = await Product.find({}).select('name price category countInStock description rating isFeatured');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Use fallback
      const reply = getRuleBasedResponse(message, products);
      return res.json({ reply });
    }

    // Call Gemini API
    const productsContext = products.map(p =>
      `Name: ${p.name}, Price: Rs. ${p.price}, Category: ${p.category}, Stock: ${p.countInStock > 0 ? 'In Stock' : 'Out of Stock'}, Description: ${p.description}`
    ).join('\n');

    const prompt = `You are a helpful, professional, and sophisticated AI shopping assistant for "Elegant Fashion", an upscale e-commerce store.
Your style should be polite, helpful, premium, and concise.
Here is the current database of products we sell:
${productsContext}

Store Policies:
- Delivery takes 3-5 working days.
- Shipping cost is Rs. 200, free for orders above Rs. 5000.
- We support Cash on Delivery (COD) and EasyPaisa.
- Customers can contact support directly via WhatsApp.

Customer message: "${message}"

Please respond directly to the customer in a warm, professional manner. Keep the response under 3-4 sentences. Do not use markdown headers, just plain text with simple lists if necessary.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      return res.json({ reply });
    } else {
      console.warn("Gemini response structure mismatch, falling back to rules.", data);
      const reply = getRuleBasedResponse(message, products);
      return res.json({ reply });
    }
  } catch (error) {
    console.error("Chatbot API Error:", error);
    // Graceful fallback
    try {
      const products = await Product.find({});
      const reply = getRuleBasedResponse(message, products);
      return res.json({ reply });
    } catch (fallbackError) {
      return res.json({ reply: "I'm currently experiencing some technical issues, but I'm happy to assist you with order placements. Please use our WhatsApp chat for direct support!" });
    }
  }
});

module.exports = router;
