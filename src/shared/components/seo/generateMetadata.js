import { baseJsonLd } from "../../constants/jsonLd";
import { commonMetadata } from "./metadataConfig";

export function generateMetadata({
    title = commonMetadata.defaultTitle,
    description = commonMetadata.defaultDescription,
    path = "",
    additionalJsonLd = null,
}) {
    const url = `${commonMetadata.baseUrl}${path}`;

    const metadata = {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            siteName: "CCReward",
            type: "website",
            images: [{
                url: commonMetadata.defaultOgImage,
                width: 1200,
                height: 630,
                type: "image/png",
            }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [commonMetadata.defaultOgImage],
        },
        alternates: {
            canonical: url,
        },
        keywords: commonMetadata.keywords,
        applicationName: "CCReward",
        appleWebApp: {
            title: "CCReward",
            statusBarStyle: "default",
        },
        formatDetection: {
            telephone: false,
        },
        itunes: {
            appId: commonMetadata.appInfo.iosAppId,
            appArgument: "myapp://",
        },
        verification: {
            google: "google-adsense-account",
            other: {
                "google-adsense-account": "ca-pub-3745126880980552",
            },
        }
    };

    // Add JSON-LD if provided
    if (additionalJsonLd) {
        metadata.jsonLd = {
            ...baseJsonLd,
            "@graph": [...baseJsonLd["@graph"], ...additionalJsonLd],
        };
    }

    return metadata;
}