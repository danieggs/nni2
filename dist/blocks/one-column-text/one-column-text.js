import { FadeInOnScroll } from "../../scripts/funcs/storageUtils.js";
export default async function decorate(block) {
    const blockName = 'one-column-text';
    const [text, useTransition] = Array.from(block.children); // fehlt picture
    // remove useTransition textfield from the DOM
    const enableTransition = (useTransition === null || useTransition === void 0 ? void 0 : useTransition.textContent.trim()) === 'true';
    useTransition.remove();
    Array.from(text.children).forEach((child) => {
        child.classList.add(`${blockName}__text`);
        const pElement = document.createElement('p');
        pElement.className = child.className;
        pElement.innerHTML = child.innerHTML;
    });
    // Check if the basic hero element is present and add --standard-hero class to the first one-column-text component
    const heroIsPresent = !!document.querySelector('.hero');
    if (heroIsPresent) {
        const firstContainer = document.querySelector('.one-column-text-container');
        if (firstContainer) {
            firstContainer.classList.add('one-column-text-container--standard-hero');
        }
    }
    // Create the scroll effect for the text when useTransition is true
    const container = block.closest('.one-column-text-container');
    if (container && enableTransition) {
        const wrapper = container.querySelector('.one-column-text-wrapper');
        if (wrapper) {
            wrapper.classList.add("one-column-text-wrapper--animated");
            new FadeInOnScroll(container, {
                rootMargin: '0px',
                threshold: 0.3,
                childSelector: '.one-column-text-wrapper',
                fadeInClass: 'slide-in-right',
            });
        }
    }
}
