const footerData = {
    sections: [
        {
            title: "About LoremIpsum®",
            items: [
                { text: "Why LoremIpsum®", url: "#" },
                { text: "How LoremIpsum® Works", url: "#" },
                { text: "Sign Up for LoremIpsum® Info", url: "#" },
            ],
        },
        {
            title: "Cost, Savings, & Support",
            items: [
                { text: "Check Your Cost & Coverage", url: "#" },
                { text: "Explore Other Coverage Options", url: "#" },
                { text: "Save on LoremIpsum®", url: "#" },
                { text: "Get LoremIpsum® Support", url: "#" },
            ],
        },
    ],
    links: [
        { text: "Terms of Use", url: "#" },
        { text: "Privacy Statement", url: "#" },
        { text: "Consumer Health Privacy Notice", url: "#" },
        { text: "Cookie Notice", url: "#" },
        { text: "Privacy Request", url: "#" },
        { text: "Contact Us", url: "#" },
        { text: "About Novo Nordisk", url: "#" },
        { text: "Sitemap", url: "#" }
    ],
    address: "Novo Nordisk Inc., 800 Scudders Mill Road, Plainsboro, New Jersey 08536 U.S.A.",
    trademark: "Novo Nordisk is a registered trademark of Novo Nordisk A/S.",
    copyright: "©2024 Novo Nordisk All rights reserved. <br> US24XXXXXXXXXX Month 20XX",
    logoPath: "https://svgshare.com/i/1C9s.svg"
};
const blockName = 'footer';
// async function fetchAndProcessData(url: string, callback: (entry: Entry) => LinkItem): Promise<LinkItem[]> {
//   try {
//     const response = await fetch(url);
//     const links: LinkItem[] = [];
//
//     if(response.ok) {
//       const json = await response.json();
//
//       for (const entry of json.data) {
//         links.push(callback(entry));
//       }
//     }
//
//     return links;
//   } catch (error) {
//     console.error(`Failed to fetch data from ${url}:`, error);
//     return [];
//   }
// }
export default async function decorate(block) {
    // Mock data
    console.log('Block NNI2:', block);
    const dataContent = Array.from(block.children);
    block.innerHTML = '';
    // Generate HTML structure
    const footerHTML = `
             ${generateFooterSections(footerData.sections)}
            <div class="footer__content">
                <div class="footer__text">
                    <div class="footer__links">
                        ${footerData.links.map((link) => `<a href="${link.url}">${link.text}</a>`).join('<span class="footer__separator">|</span>')}
                    </div>
                    <div class="footer__info">
                        <p class="footer__info--address">${footerData.address}<br />${footerData.trademark}</p>
                        <p class="footer__info--rights">${footerData.copyright}</p>
                    </div>
                </div>
                <div class="footer__logo">
                    <img src="${footerData.logoPath}" alt="Novo Nordisk logo" />
                </div>
            </div>
    `;
    // Inject the HTML into the block
    block.innerHTML = footerHTML;
}
function generateFooterSections(sections) {
    return `
    <div class="footer__sections-container">
      ${sections
        .map((section) => `
        <div class="footer__section">
          <div class="footer__section-title">${section.title}</div>
          <ul class="footer__section-items">
            ${section.items
        .map((item) => `<li><a href="${item.url}">${item.text}</a></li>`)
        .join('')}
          </ul>
        </div>
      `)
        .join('')}
    </div>
  `;
}
