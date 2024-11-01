/**
 * socialShareUtils.ts
 * Utility functions for social media sharing.
 */
/**
 * Encodes the current page URL for safe sharing.
 * @returns {string} The encoded current page URL.
 */
function getEncodedPageUrl() {
    return encodeURIComponent(window.location.href);
}
/**
 * Encodes the current page's title for use in sharing links.
 * @returns {string} The encoded title of the current page.
 */
function getEncodedTitle() {
    return encodeURIComponent(document.title);
}
/**
 * Encodes the origin (root domain) of the current page for use in sharing links.
 * @returns {string} The encoded origin of the current page.
 */
function getEncodedOrigin() {
    return encodeURIComponent(window.location.origin);
}
/**
 * Opens a new tab to share the current page on the specified social platform.
 * @param {string} platform - The social platform to share on (e.g., 'facebook', 'linkedin').
 */
function shareOnSocial(platform) {
    const pageUrl = getEncodedPageUrl();
    let shareUrl = '';
    if (platform === 'facebook') {
        // Facebook only requires the page URL
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    }
    else if (platform === 'linkedin') {
        // LinkedIn requires URL, title, and source
        const title = getEncodedTitle();
        const source = getEncodedOrigin();
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${title}&source=${source}`;
    }
    else {
        console.warn(`Sharing on ${platform} is not supported.`);
        return;
    }
    window.open(shareUrl, '_blank');
}
export { shareOnSocial };
