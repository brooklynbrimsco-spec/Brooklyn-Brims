/** Official Brooklyn Brims Hat Co. Terms & Conditions. Update this file when the terms change, and bump TERMS_VERSION. */

export const TERMS_VERSION = "brooklyn-brims-terms-2026-11-24-v1";
export const TERMS_LAST_UPDATED = "November 24, 2026";
export const TERMS_ACCEPTANCE_ERROR =
  "Please agree to the Terms & Conditions to continue.";

export type TermsBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export const termsIntro: string[] = [
  'Welcome to Brooklyn Brims Hat Co. ("Brooklyn Brims," "we," "our," or "us"). These Terms & Conditions govern your use of our website and purchases made through our online store.',
  "By accessing our website, placing an order, or checking the box indicating your agreement to these Terms & Conditions during checkout, you acknowledge that you have read, understood, and agreed to these terms.",
  "If you do not agree to these Terms & Conditions, please do not proceed with a purchase.",
];

export const termsSections: { heading: string; blocks: TermsBlock[] }[] = [
  {
    heading: "1. ABOUT BROOKLYN BRIMS HAT CO.",
    blocks: [
      {
        type: "p",
        text: "Brooklyn Brims Hat Co. is an online headwear retailer offering hats, including snapbacks and golf hats.",
      },
      {
        type: "p",
        text: "We currently sell ready-to-purchase products only. We do not offer custom embroidery, personalized designs, or made-to-order products.",
      },
      {
        type: "p",
        text: "Our website is:",
      },
      {
        type: "p",
        text: "https://brooklyn-brims.vercel.app/",
      },
      {
        type: "p",
        text: "We reserve the right to introduce new products, discontinue existing products, and modify our product offerings at any time.",
      },
    ],
  },
  {
    heading: "2. PRODUCT INFORMATION",
    blocks: [
      {
        type: "p",
        text: "We make reasonable efforts to ensure that product descriptions, photographs, colors, prices, and other product information displayed on our website are accurate.",
      },
      {
        type: "p",
        text: "Actual product colors and appearances may vary slightly depending on your screen, device, lighting, and display settings.",
      },
      {
        type: "p",
        text: "All products are subject to availability.",
      },
      {
        type: "p",
        text: "We reserve the right to correct inaccurate product listings, descriptions, or pricing information and to limit quantities or discontinue products when necessary.",
      },
    ],
  },
  {
    heading: "3. ORDERS AND ACCEPTANCE",
    blocks: [
      {
        type: "p",
        text: "By placing an order through our website, you agree to provide accurate, complete, and current billing, shipping, and contact information.",
      },
      {
        type: "p",
        text: "All orders are subject to product availability and payment authorization.",
      },
      {
        type: "p",
        text: "We reserve the right to refuse or cancel an order when necessary, including situations involving suspected fraudulent activity, payment issues, inventory discrepancies, or technical pricing errors.",
      },
      {
        type: "p",
        text: "If payment has already been collected for an order that we cancel, the amount paid will be refunded to the original payment method.",
      },
      {
        type: "p",
        text: "An order confirmation does not necessarily mean that an order has been shipped.",
      },
    ],
  },
  {
    heading: "4. PRICING AND PAYMENTS",
    blocks: [
      {
        type: "p",
        text: "All product prices are displayed on our website and are subject to change without prior notice.",
      },
      {
        type: "p",
        text: "The applicable product price will generally be the price displayed when the order is submitted, subject to correction of genuine pricing errors.",
      },
      {
        type: "p",
        text: "Applicable taxes, shipping charges, and other disclosed fees will be calculated and displayed at checkout when applicable.",
      },
      {
        type: "p",
        text: "Payments are processed through Stripe or its supported payment services.",
      },
      {
        type: "p",
        text: "By submitting an order, you authorize the applicable payment provider to charge your selected payment method for the total amount displayed at checkout.",
      },
      {
        type: "p",
        text: "Customers purchasing from Canada may be responsible for applicable customs duties, import taxes, brokerage fees, or other charges imposed by their country.",
      },
      {
        type: "p",
        text: "Any such charges disclosed at checkout will be presented before the order is completed.",
      },
    ],
  },
  {
    heading: "5. SHIPPING AND DELIVERY",
    blocks: [
      {
        type: "p",
        text: "Brooklyn Brims Hat Co. currently ships to customers within the United States and Canada.",
      },
      {
        type: "p",
        text: "Our estimated shipping and delivery timeframes are:",
      },
      { type: "h3", text: "Order Processing" },
      {
        type: "ul",
        items: ["Approximately 1–3 business days."],
      },
      { type: "h3", text: "United States Standard Shipping" },
      {
        type: "ul",
        items: ["Approximately 3–7 business days after shipment."],
      },
      { type: "h3", text: "Canada Standard Shipping" },
      {
        type: "ul",
        items: ["Approximately 5–10 business days after shipment."],
      },
      {
        type: "p",
        text: "These timeframes are estimates and are not guaranteed delivery dates.",
      },
      {
        type: "p",
        text: "Actual delivery times may vary depending on the shipping carrier, destination, weather conditions, holidays, customs processing, and other circumstances outside our reasonable control.",
      },
      {
        type: "p",
        text: "Business days exclude weekends and applicable holidays.",
      },
      {
        type: "p",
        text: "Tracking information may be provided when available.",
      },
      {
        type: "p",
        text: "Customers are responsible for providing accurate and complete shipping addresses when placing an order.",
      },
      {
        type: "p",
        text: "We are not responsible for delivery issues caused by incorrect or incomplete addresses supplied by customers.",
      },
      {
        type: "p",
        text: "If we are unable to ship an order within the applicable promised timeframe, we will provide customers with the required options to consent to a delay or cancel their order and receive a refund, as required by applicable law.",
      },
    ],
  },
  {
    heading: "6. RETURNS AND REFUNDS",
    blocks: [
      {
        type: "p",
        text: "Brooklyn Brims Hat Co. offers customers a 14-day return period beginning on the date the customer receives their order.",
      },
      {
        type: "p",
        text: "To qualify for a return under our standard return policy, the following conditions must be met:",
      },
      {
        type: "ul",
        items: [
          "The return request must be submitted within 14 days of delivery.",
          "The hat must be unworn and unused.",
          "The hat must be clean and in good, like-new condition.",
          "The product must be free of stains, odors, damage, alterations, and visible signs of wear.",
          "Original packaging should be included when reasonably available.",
        ],
      },
      {
        type: "p",
        text: "Products that do not meet these conditions may be ineligible for a standard return.",
      },
      { type: "h3", text: "Return Shipping" },
      {
        type: "p",
        text: "Customers are responsible for the cost of return shipping.",
      },
      {
        type: "p",
        text: "We recommend using a shipping service that provides tracking information.",
      },
      {
        type: "p",
        text: "Customers are responsible for returned merchandise until it has been received by Brooklyn Brims Hat Co.",
      },
      { type: "h3", text: "Refund Processing" },
      {
        type: "p",
        text: "Once a returned item has been received and inspected, we will notify the customer whether the return has been approved.",
      },
      {
        type: "p",
        text: "Approved refunds will be issued to the original payment method used for the purchase.",
      },
      {
        type: "p",
        text: "Refund processing times may vary depending on the payment provider and financial institution.",
      },
      {
        type: "p",
        text: "Original shipping charges are not refundable for standard returns unless otherwise required by applicable law.",
      },
      {
        type: "p",
        text: "Nothing in this policy limits any non-waivable rights or remedies available to customers under applicable consumer protection laws.",
      },
      { type: "h3", text: "How to Request a Return" },
      {
        type: "p",
        text: "To request a return, contact:",
      },
      {
        type: "p",
        text: "brooklynbrims.co@gmail.com",
      },
      {
        type: "p",
        text: "Please include your order number and a description of the reason for your return.",
      },
    ],
  },
  {
    heading: "7. DAMAGED, DEFECTIVE, OR INCORRECT ORDERS",
    blocks: [
      {
        type: "p",
        text: "If you receive a damaged, defective, or incorrect product, please contact us at brooklynbrims.co@gmail.com as soon as reasonably possible.",
      },
      {
        type: "p",
        text: "Please include:",
      },
      {
        type: "ul",
        items: [
          "Your order number.",
          "A description of the issue.",
          "Photographs of the product when appropriate.",
        ],
      },
      {
        type: "p",
        text: "We will review the situation and work toward an appropriate resolution.",
      },
      {
        type: "p",
        text: "Nothing in these Terms & Conditions removes any consumer rights or remedies that cannot legally be excluded under applicable law.",
      },
    ],
  },
  {
    heading: "8. ORDER CANCELLATIONS",
    blocks: [
      {
        type: "p",
        text: "If you wish to cancel an order, please contact us as soon as possible at brooklynbrims.co@gmail.com.",
      },
      {
        type: "p",
        text: "We cannot guarantee that an order can be canceled once it has entered processing or has been shipped.",
      },
      {
        type: "p",
        text: "If an order has already shipped, the customer may need to follow the return procedure outlined in Section 6.",
      },
      {
        type: "p",
        text: "Any cancellation and refund will be handled in accordance with applicable law.",
      },
    ],
  },
  {
    heading: "9. INTELLECTUAL PROPERTY",
    blocks: [
      {
        type: "p",
        text: "All content displayed on the Brooklyn Brims Hat Co. website, including but not limited to:",
      },
      {
        type: "ul",
        items: [
          "Logos and branding.",
          "Product photographs.",
          "Website designs and graphics.",
          "Written descriptions.",
          "Marketing materials.",
          "Original creative content.",
        ],
      },
      {
        type: "p",
        text: "is owned by Brooklyn Brims Hat Co. or used with appropriate permission.",
      },
      {
        type: "p",
        text: "You may not reproduce, distribute, modify, publicly display, or commercially use our intellectual property without prior written permission.",
      },
      {
        type: "p",
        text: "Unauthorized use of our branding, photographs, or other protected materials is prohibited.",
      },
    ],
  },
  {
    heading: "10. WEBSITE USE AND PROHIBITED ACTIVITIES",
    blocks: [
      {
        type: "p",
        text: "By using our website, you agree not to:",
      },
      {
        type: "ul",
        items: [
          "Use the website for unlawful purposes.",
          "Submit false or misleading information.",
          "Attempt to interfere with website functionality or security.",
          "Attempt unauthorized access to our systems or customer information.",
          "Use automated methods to abuse or disrupt our website.",
          "Engage in fraudulent purchasing or payment activity.",
        ],
      },
      {
        type: "p",
        text: "We reserve the right to restrict access to our website when necessary to protect our business, customers, or website functionality.",
      },
    ],
  },
  {
    heading: "11. THIRD-PARTY SERVICES",
    blocks: [
      {
        type: "p",
        text: "Our website may use third-party services to provide certain features and functionality.",
      },
      {
        type: "p",
        text: "These services may include:",
      },
      {
        type: "ul",
        items: [
          "Stripe for payment processing.",
          "Vercel for website hosting and infrastructure.",
          "GitHub for website development and code management.",
          "Other service providers necessary to operate our online store.",
        ],
      },
      {
        type: "p",
        text: "Third-party services may have their own terms, conditions, and privacy policies.",
      },
      {
        type: "p",
        text: "Your use of third-party services may be subject to those providers' respective terms and policies.",
      },
    ],
  },
  {
    heading: "12. LIMITATION OF LIABILITY",
    blocks: [
      {
        type: "p",
        text: "To the fullest extent permitted by applicable law, Brooklyn Brims Hat Co. will not be liable for indirect, incidental, special, or consequential damages arising from the use of our website or the purchase or use of our products.",
      },
      {
        type: "p",
        text: "We do not guarantee uninterrupted, error-free, or continuously available website functionality.",
      },
      {
        type: "p",
        text: "Nothing in this section excludes or limits liability that cannot legally be excluded or limited under applicable law.",
      },
    ],
  },
  {
    heading: "13. PRIVACY AND PERSONAL INFORMATION",
    blocks: [
      {
        type: "p",
        text: "We respect the privacy of our customers.",
      },
      {
        type: "p",
        text: "Information collected through our website may be used to:",
      },
      {
        type: "ul",
        items: [
          "Process and fulfill orders.",
          "Provide customer support.",
          "Communicate order confirmations and shipping updates.",
          "Prevent fraudulent activity.",
          "Maintain and improve our website.",
          "Meet applicable legal obligations.",
        ],
      },
      {
        type: "p",
        text: "Payment information is processed through Stripe and its supported payment infrastructure.",
      },
      {
        type: "p",
        text: "Our collection, use, storage, and disclosure of personal information are described in our separate Privacy Policy.",
      },
      {
        type: "p",
        text: "Please review our Privacy Policy before submitting personal information or placing an order.",
      },
    ],
  },
  {
    heading: "14. CHANGES TO THESE TERMS",
    blocks: [
      {
        type: "p",
        text: "Brooklyn Brims Hat Co. reserves the right to update, modify, or replace these Terms & Conditions at any time.",
      },
      {
        type: "p",
        text: "Changes will become effective when the updated terms are published on our website, unless otherwise stated.",
      },
      {
        type: "p",
        text: "The Last Updated date at the beginning of this document will indicate when the current version took effect.",
      },
      {
        type: "p",
        text: "We may require customers to review and accept updated terms when placing future orders or using certain website features.",
      },
      {
        type: "p",
        text: "Changes to these terms will not retroactively alter rights or obligations arising from previously completed purchases, except as permitted by applicable law.",
      },
    ],
  },
  {
    heading: "15. APPLICABLE LAW AND CONSUMER RIGHTS",
    blocks: [
      {
        type: "p",
        text: "These Terms & Conditions are subject to applicable laws and regulations governing consumer purchases and online transactions.",
      },
      {
        type: "p",
        text: "Nothing in these Terms & Conditions is intended to restrict, remove, or override consumer rights that cannot legally be waived.",
      },
      {
        type: "p",
        text: "The applicable governing law and jurisdiction will be determined based on the legally relevant location and circumstances of the business and transaction.",
      },
    ],
  },
  {
    heading: "16. CONTACT INFORMATION",
    blocks: [
      {
        type: "p",
        text: "For questions, concerns, order assistance, or return requests, please contact us:",
      },
      { type: "h3", text: "Brooklyn Brims Hat Co." },
      {
        type: "p",
        text: "Email: brooklynbrims.co@gmail.com",
      },
      {
        type: "p",
        text: "Website: https://brooklyn-brims.vercel.app/",
      },
    ],
  },
  {
    heading: "17. CUSTOMER ACCEPTANCE",
    blocks: [
      {
        type: "p",
        text: "By checking the Terms & Conditions acceptance box during checkout, you acknowledge that:",
      },
      {
        type: "ol",
        items: [
          "You have had the opportunity to read these Terms & Conditions.",
          "You understand and agree to the policies described in this document.",
          "You understand the return, refund, shipping, and payment policies.",
          "You voluntarily agree to these Terms & Conditions to the extent permitted by applicable law.",
        ],
      },
      {
        type: "p",
        text: "If you do not agree to these terms, you should not proceed with your purchase.",
      },
    ],
  },
];
