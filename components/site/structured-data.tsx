/**
 * JSON-LD structured data. Helps Google understand the product and richen
 * search-result presentation.
 */
export function StructuredData() {
  const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://meetnote-ai.vercel.app"
  ).trim();

  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MeetNote AI",
    description:
      "Upload meeting audio or paste a transcript. AI instantly produces summaries, action items, and decisions.",
    url: SITE_URL,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    inLanguage: ["en", "zh-Hant"],
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "9",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "9",
          priceCurrency: "USD",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        },
      },
    ],
    featureList: [
      "Automatic audio transcription (OpenAI Whisper)",
      "AI-structured summaries (Claude tool use)",
      "Automatic action-item extraction",
      "Decisions and participants identified",
      "Markdown / PDF export",
      "Public share links",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
