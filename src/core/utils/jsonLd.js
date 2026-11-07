/**
 * Serialize structured data for a <script type="application/ld+json"> tag.
 * Escapes "<" so a value containing "</script>" can't close the tag early.
 */
export function serializeJsonLd(data) {
    return JSON.stringify(data).replace(/</g, '\\u003c');
}
