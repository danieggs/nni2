interface Entry {
  Text: string;
  Link: string;
}

interface LinkItem {
  href: string;
  text?: string;
  className?: string;
}

const blockName = 'eggs-footer';

function createListItem({ href, text, className }: LinkItem): HTMLLIElement {
  const listItemElement = document.createElement('li');

  const anchorElement = document.createElement('a');
  anchorElement.href = href;

  if (className) anchorElement.className = className;

  if (text) anchorElement.textContent = text;
  listItemElement.appendChild(anchorElement);

  return listItemElement;
}

async function fetchAndProcessData(url: string, callback: (entry: Entry) => LinkItem): Promise<LinkItem[]> {
  try {
    const response = await fetch(url);
    const links: LinkItem[] = [];

    if(response.ok) {
      const json = await response.json();

      for (const entry of json.data) {
        links.push(callback(entry));
      }
    }

    return links;
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    return [];
  }
}

export default async function decorate(block: HTMLElement): Promise<void> {
  // Mock data
  const footerData = {
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
    copyright: "©2024 Novo Nordisk All rights reserved. US24XXXXXXXXXX Month 20XX",
    logoPath: "path/to/logo.png"
  };

  // Generate HTML structure
  const footerHTML = `
        <footer class="footer">
            <div class="footer__content">
                <div class="footer__text">
                    <div class="footer__links">
                        ${footerData.links.map(link => `<a href="${link.url}">${link.text}</a>`).join('<span class="footer__separator">|</span>')}
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
        </footer>
    `;

  // Inject the HTML into the block
  block.innerHTML = footerHTML;
}
