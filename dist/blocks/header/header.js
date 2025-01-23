function parseHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return Array.from(doc.body.childNodes);
}
const blockName = 'header';
export default async function decorate(block) {
    const fragment = await loadFragment('/mazda/header');
    const fragmentHeaderData = fragment.querySelector(`.${blockName}`);
    console.log('What we have:', fragment);
    const logoImage = fragmentHeaderData.querySelector('main>div>div>div>div:nth-of-type(1)>picture>img');
    const ctaText = fragmentHeaderData.querySelector('main>div>div>div>div:nth-of-type(2)');
    const generatedHTML = `
  <header class="header">
    <div class="logo">
        ${(logoImage === null || logoImage === void 0 ? void 0 : logoImage.src)
        ? `<img src="${logoImage.src}" alt="Mazda Logo" />`
        : ""}
    </div>
    <div class="right-container"> 
      <div class="find-dealer">
          ${(ctaText === null || ctaText === void 0 ? void 0 : ctaText.outerHTML) ? ctaText.outerHTML : ' '} 
       </div>  
       <div class="icon-find">
        ${getFindIcon()} 
      </div>
      <div class="burger-item">
      ${prepareTheBurger()}
       </div>
    </div>
  </header>
`;
    // block.innerHTML = '';
    const newElements = parseHTML(generatedHTML);
    block.append(...newElements);
}
const logoContainer = (logo, logoLink) => {
    return `<div class="${blockName}__logo-container">
        <a href="${logoLink}" class="${blockName}__logo-link">
            <img class="${blockName}__logo--img" src="${logo}" alt="Logo"/>
        </a>
          </div>`;
};
const prepareTheBurger = () => {
    return `<div class="${blockName}__burger-icon">
    <div class="${blockName}__line"></div>
    <div class="${blockName}__line"></div>
    <div class="${blockName}__line"></div>
  </div>`;
};
const getFindIcon = () => {
    return `
  <?xml version="1.0" encoding="iso-8859-1"?>
  <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg fill="#ffffff" height="22px" width="22px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 192.906 192.906" xml:space="preserve">
  <g>
      <path d="M190.709,180.102l-47.08-47.076c11.702-14.072,18.752-32.142,18.752-51.831c0-44.77-36.421-81.193-81.188-81.193
  C36.423,0.001,0,36.424,0,81.194c0,44.767,36.423,81.188,81.193,81.188c19.688,0,37.758-7.049,51.829-18.75l47.081,47.077
  c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.304-2.197C193.639,187.779,193.639,183.031,190.709,180.102z
  M15,81.194c0-36.499,29.694-66.193,66.193-66.193c36.496,0,66.188,29.694,66.188,66.193c0,36.496-29.691,66.188-66.188,66.188
  C44.694,147.382,15,117.69,15,81.194z"/>
  <path d="M81.186,41.989c-15.79,0-28.637,12.845-28.637,28.634c0,23.968,22.381,46.622,23.334,47.575
  c1.464,1.464,3.383,2.196,5.303,2.196c1.919,0,3.838-0.732,5.302-2.195c0.953-0.953,23.345-23.607,23.345-47.576
  C109.832,54.835,96.981,41.989,81.186,41.989z M81.168,101.497c-6.045-7.682-13.619-19.864-13.619-30.873
  c0-7.518,6.117-13.634,13.637-13.634c7.524,0,13.646,6.116,13.646,13.634C94.832,82.233,86.776,94.419,81.168,101.497z"/>
  </g>
  </svg>`;
};
async function loadFragment(path) {
    if (path && path.startsWith('/')) {
        const response = await fetch(`${path}.plain.html`);
        if (response.ok) {
            const main = document.createElement('main');
            main.innerHTML = await response.text();
            // Reset base path for media to fragment base
            const resetAttributeBase = (tag, attr) => {
                main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((element) => {
                    const originalAttribute = element.getAttribute(attr);
                    if (originalAttribute) {
                        element[attr] = new URL(originalAttribute, new URL(path, window.location.href)).href;
                    }
                });
            };
            resetAttributeBase('img', 'src');
            resetAttributeBase('source', 'srcset');
            return main;
        }
    }
    return null;
}
