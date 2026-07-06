export default function RestaurantSchema()
{
    const data = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "China Chef",
        "@id": "https://china-chef-website.vercel.app/#visit",
        "url": "https://china-chef-website.vercel.app",
        "telephone": "+14108821088",
        "priceRange": "$",
        "menu": "https://china-chef-website.vercel.app/#menu",
        "servesCuisine": ["Chinese", "American"],
        "acceptsReservations": "false",
        "paymentsAccepted": "Cash, Visa, Mastercard",
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
        "openingHoursSpecification": [{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday"
            ],
            "opens": "11:00",
            "closes": "22:00"
        },{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
            "Friday",
            "Saturday"
            ],
            "opens": "11:00",
            "closes": "23:00"
        },{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "12:00",
            "closes": "10:00"
        }]
    };

    return (
        <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} 
        />
    );
}