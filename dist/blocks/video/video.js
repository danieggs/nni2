import { searchNestedPicture } from './../../scripts/funcs/htmlUtils.js';
//https://main--nni2--danieggs.aem.page/tools/sidekick/media/media_122f1bf66cf9f1f1cf928fc35a1567f7a28205131.mp4
const videoComponentData = {
    logoPath: "https://svgshare.com/i/1C9s.svg",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    links: [
        { text: "Important Safety Information", url: "#safety" },
        { text: "Indication and Use", url: "#indication" },
        { text: "Prescribing Information", url: "#prescribing" },
    ],
    videoPlaceholder: null,
    sidebarInfo: {
        title: "Important Safety Information",
        items: [
            "Do not use if you have X condition.",
            "Possible side effects include...",
            "Consult your doctor before...",
        ],
        additionalInfo: [
            "Indications and Limitations of Use",
            "Additional information on safe usage.",
        ],
    },
    tabs: ["Information", "Video Transcript", "Q&A"],
    content: {
        title: "Video Title / Video Duration",
        subtitle: "This is the Info tab placeholder title",
        paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed ligula ex. Aliquam bibendum urna ac sem commodo.",
    },
};
export default async function decorate(block) {
    const initialBlockData = block.cloneNode(true); // Create a deep copy of the initial block
    console.log('Getting data:', searchNestedPicture(initialBlockData.children[0]));
    videoComponentData.videoPlaceholder = searchNestedPicture(initialBlockData.children[0]);
    block.innerHTML = '';
    const componentHTML = `
    ${generateHeader(videoComponentData)}
    ${generateMainContent(videoComponentData)}
    ${generateTabs(videoComponentData.tabs)}
    ${generateInformationContent(videoComponentData.content)}
  `;
    // Inject the HTML into the block
    block.innerHTML = componentHTML;
}
function generateHeader(data) {
    return `
    <header class="video-component__header">
      <img src="${data.logoPath}" alt="Logo" class="video-component__logo" />
      <div class="video-component__title-container">
        <h1>${data.title}</h1>
        <div class="video-component__links">
          ${data.links
        .map((link) => `<a href="${link.url}">${link.text}</a>`)
        .join(" | ")}
        </div>
      </div>
    </header>
  `;
}
function generateMainContent(data) {
    return `
    <div class="video-component__main">
      <div class="video-component__video-placeholder">
        ${videoComponentData.videoPlaceholder.outerHTML}
      </div>
      <aside class="video-component__sidebar">
        <h2>${data.sidebarInfo.title}</h2>
        <ul>
          ${data.sidebarInfo.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        ${data.sidebarInfo.additionalInfo
        .map((info) => `<p>${info}</p>`)
        .join("")}
      </aside>
    </div>
  `;
}
function generateTabs(tabs) {
    return `
    <div class="video-component__tabs">
      ${tabs
        .map((tab) => `<button class="video-component__tab">${tab}</button>`)
        .join("")}
    </div>
  `;
}
function generateInformationContent(content) {
    return `
    <div class="video-component__content">
      <h3>${content.title}</h3>
      <h4>${content.subtitle}</h4>
      <p>${content.paragraph}</p>
    </div>
  `;
}
