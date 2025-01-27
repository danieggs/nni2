export default async function decorate(block) {
    const dataContainers = Array.from(block.children);
    block.innerHTML = '';
    const headline = dataContainers[0].children[0].children[0].innerHTML;
    const subheadline = dataContainers[0].children[1].children[0].innerHTML;
    const backgroundImage = dataContainers[1].children[0].children[0].children[0];
    const containerHTML = `
    <div class="hero-mazda__inside">
     ${backgroundImage.outerHTML}
     
     <div class="hero-mazda__headlines">
        <h2 class="hero-mazda__headlines--hello">${headline}</h2>
        <h3 class="hero-mazda__headlines--hellosub">${subheadline}</h3>
     </div>
     <div class="hero-mazda__cta">
        
     </div>
    </div>
`;
    // block.append(containerHTML);
    block.insertAdjacentHTML('beforeend', containerHTML);
}
