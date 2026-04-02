import { Property } from "@/types";

export default function PropertyJsonLd({ property }: { property: Property }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://www.rumahandalan.com/listings/${property.slug}`,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "IDR",
      availability:
        property.status === "tersedia"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.building_area,
      unitCode: "MTK",
    },
    numberOfRooms: property.bedrooms,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location?.district,
      addressRegion: property.location?.city,
      addressCountry: "ID",
    },
    image: property.images
      ?.filter((img) => img.is_primary)
      .map((img) => img.url),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
