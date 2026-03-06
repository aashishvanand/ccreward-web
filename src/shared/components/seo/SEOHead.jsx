import Head from 'next/head';

export const SEOHead = ({ metadata }) => {
    if (!metadata) return null;

    const {
        title,
        description,
        keywords,
        openGraph,
        twitter,
        alternates,
        jsonLd,
        formatDetection
    } = metadata;

    return (
        <Head>
            {/* Basic Metadata */}
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}
            {formatDetection?.telephone === false && <meta name="format-detection" content="telephone=no" />}

            {/* OpenGraph */}
            {openGraph?.title && <meta property="og:title" content={openGraph.title} />}
            {openGraph?.description && <meta property="og:description" content={openGraph.description} />}
            {openGraph?.url && <meta property="og:url" content={openGraph.url} />}
            {openGraph?.siteName && <meta property="og:site_name" content={openGraph.siteName} />}
            {openGraph?.type && <meta property="og:type" content={openGraph.type} />}
            {openGraph?.images?.map((image, index) => (
                <meta key={`og:image:${index}`} property="og:image" content={image.url} />
            ))}

            {/* Twitter */}
            {twitter?.card && <meta name="twitter:card" content={twitter.card} />}
            {twitter?.title && <meta name="twitter:title" content={twitter.title} />}
            {twitter?.description && <meta name="twitter:description" content={twitter.description} />}
            {twitter?.images?.map((image, index) => (
                <meta key={`twitter:image:${index}`} name="twitter:image" content={typeof image === 'string' ? image : image.url} />
            ))}

            {/* Canonical */}
            {alternates?.canonical && <link rel="canonical" href={alternates.canonical} />}

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    nonce="ccGeeks2026Secure"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
        </Head>
    );
};

export default SEOHead;
