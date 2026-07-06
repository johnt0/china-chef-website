export default function RestaurantSchema()
{
    const data = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "@id": "https://china-chef-website.vercel.app/#visit",
        "name": "China Chef",
        "url": "https://china-chef-website.vercel.app/",
        "description": "Family-owned Chinese American takeout in Nottingham, MD. Lunch special Mon–Sat, all-day special platter, and a full menu of classic and Szechuan dishes. Open 7 days.",
        "telephone": "+14108821088",
        "priceRange": "$",
        "servesCuisine": ["Chinese", "American"],
        "acceptsReservations": false,
        "paymentAccepted": "Cash, Visa, Mastercard",
        "image": "https://china-chef-website.vercel.app/favicon.svg",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "8623 Walther Blvd",
            "addressLocality": "Nottingham",
            "addressRegion": "MD",
            "postalCode": "21236",
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 39.3877975,
            "longitude": -76.507769
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
                "opens": "11:00",
                "closes": "22:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Friday", "Saturday"],
                "opens": "11:00",
                "closes": "23:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Sunday"],
                "opens": "12:00",
                "closes": "22:00"
            }
        ],
        "hasMenu": "https://china-chef-website.vercel.app/#menu"
    };

    return (
        <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} 
        />
    );
}