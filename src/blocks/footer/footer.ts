

type FooterItem = {
  text: string;
  url: string;
};

type FooterSection = {
  title: string;
  items: FooterItem[];
};

type FooterData = {
  sections: FooterSection[];
  links: FooterItem[];
  address: string;
  trademark: string;
  copyright: string;
  logoPath: string;
};
const footerData: FooterData = {
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
    {
      title: "Cost, Savings, & Support",
      items: [
        { text: "Check Your Cost & Coverage", url: "#" },
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
const blockName:string = 'footer';


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

export default async function decorate(block: HTMLElement): Promise<void> {
  // Mock data
  console.log('Block NNI2:', block);
  const dataContent:Element[] =  Array.from(block.children);
  block.innerHTML = '';


  // Generate HTML structure
  const footerHTML: string = `
             ${generateFooterSections(footerData.sections)}
            <div class="footer__content">
                <div class="footer__text">
                    <div class="footer__links">
                        ${footerData.links.map((link: FooterItem):string => `<a href="${link.url}">${link.text}</a>`).join('<span class="footer__separator">|</span>')}
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


function generateFooterSections(sections: FooterSection[]): string {
  const itemCount: number = sections.length;
  const itemClass:string = `has-${itemCount}-items`;

  return `
    <div class="footer__sections-container ${itemClass}">
      ${sections
      .map(
          (section:FooterSection):string => `
        <div class="footer__section">
          <div class="footer__section-title">${section.title}</div>
          <ul class="footer__section-items">
            ${section.items
              .map(
                  (item:FooterItem):string => `<li><a href="${item.url}">${item.text}</a></li>`
              )
              .join('')}
          </ul>
        </div>
      `
      )
      .join('')}
    </div>
  `;
}