import {getDeviceType} from "../../scripts/funcs/storageUtils";
import {isAdobeCloud} from "../../scripts/video-support";
import {highlightTextInDocument} from "../../scripts/funcs/textUtils";
import * as htmlUtils from "../../scripts/funcs/htmlUtils";

const blockName = 'illustration-hero';

interface DataModel {
    illustrationContainer: {
        element: HTMLElement;
        pictureHtml: HTMLPictureElement;
    },
    darkIllustrationContainer: {
        element: HTMLElement;
        pictureHtml: HTMLPictureElement;
    },
    headline: {
        element: HTMLElement;
    },
    description: {
        element: HTMLElement;
    },
    button: {
        element: HTMLAnchorElement;
        contentText: string;
        linkHref: string;
    }
}

export default function decorate(block: HTMLElement) {
    const dataContainers = Array.from(block.children) as HTMLDivElement[];

    const selectors: DataModel = {
        //dataContainers take the respective field and content from UE as an Array
        illustrationContainer: {
            element: htmlUtils.createElementWithClass('div', `${blockName}__image-wrapper`),
            pictureHtml: htmlUtils.searchNestedPicture(dataContainers[0], `${blockName}__picture`),
        },
        darkIllustrationContainer: {
            element: htmlUtils.createElementWithClass('div', `${blockName}__dark-image-wrapper`),
            pictureHtml: htmlUtils.searchNestedPicture(dataContainers[1], `${blockName}__picture`),
        },
        headline: {
            element: (() => {
                const headlineDiv = htmlUtils.createElementWithClass('div', `${blockName}__headline`);
                const pTag = document.createElement('p');
                pTag.innerHTML = htmlUtils.searchNestedHeadline(dataContainers[2]);
                highlightTextInDocument('yellow', 'highlight-yellow', headlineDiv);
                headlineDiv.appendChild(pTag);

                return headlineDiv;
            })(),
        },
        description: {
            element: (() => {
                const descriptionDiv = htmlUtils.createElementWithClass('div', `${blockName}__description`);
                const descriptionTag = document.createElement('p');
                descriptionTag.innerHTML = htmlUtils.searchNestedHeadline(dataContainers[3]);
                descriptionDiv.appendChild(descriptionTag);

                return descriptionDiv;

            }) (),
        },
        button: {
            element: htmlUtils.createElementWithClass('a', `${blockName}__button button secondary`),
            contentText: htmlUtils.searchNestedContent(dataContainers[4]),
            linkHref: htmlUtils.searchNestedContent(dataContainers[5])
        }
    }

    //selectors.description.element.textContent = selectors.description.contentText;
    selectors.button.element.textContent = selectors.button.contentText;
    selectors.button.element.href = selectors.button.linkHref;
    htmlUtils.safelyAppendTheItem(selectors.illustrationContainer.element, selectors.illustrationContainer.pictureHtml, HTMLPictureElement);
    htmlUtils.safelyAppendTheItem(selectors.darkIllustrationContainer.element, selectors.darkIllustrationContainer.pictureHtml, HTMLPictureElement);

    let lastDeviceType = getDeviceType();

    if (isAdobeCloud()) {
        const children = Array.from(block.children);
        children.forEach((child) => {
            if (child.tagName.toLowerCase() === 'div') {
                (child as HTMLDivElement).style.display = 'none';
            }
        });
    }else{
        block.innerHTML = '';
    }

    const leftContainer: HTMLDivElement = document.createElement('div');
    leftContainer.classList.add(`${blockName}__left-container`);

    const rightContainer: HTMLDivElement = document.createElement('div');
    rightContainer.classList.add(`${blockName}__right-container`);

    window.addEventListener('resize', () => {
        if (lastDeviceType !== getDeviceType()) {
            lastDeviceType = getDeviceType();
            arrangeContainers();
        }
    });

    const illustrationHeroSection = block.closest('.illustration-hero-container') as HTMLElement;
    const nextSection = illustrationHeroSection?.nextElementSibling as HTMLElement;
    const footerSection = document.querySelector('.footer-wrapper') as HTMLElement;

    if (getDeviceType() === "desktop") {
        if (nextSection) {
            nextSection.style.marginTop = '100vh';
        }

        if (nextSection === footerSection) {
                (illustrationHeroSection as HTMLElement).style.position = 'relative';
            }

    }

    const arrangeContainers = () => {
        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';

        if (getDeviceType() === "mobile") {
            const hasDescriptionText = selectors.description.element.textContent?.trim() !== '';
            if (hasDescriptionText) {
                selectors.illustrationContainer.element.classList.add(`${blockName}__image-small`);
                selectors.darkIllustrationContainer.element.classList.add(`${blockName}__image-dark-small`);
            } else {
                selectors.illustrationContainer.element.classList.add(`${blockName}__image-large`);
                selectors.darkIllustrationContainer.element.classList.add(`${blockName}__image-dark-large`);
            }

            htmlUtils.appendElementsTo(rightContainer,
                {
                    illustrationContainer: { element: selectors.illustrationContainer.element },
                    darkIllustrationContainer: { element: selectors.darkIllustrationContainer.element }
                });

            htmlUtils.appendElementsTo(leftContainer,
                {
                    headline: { element: selectors.headline.element },
                    description: { element: selectors.description.element },
                    button: { element: selectors.button.element }
                });

            rightContainer && block.appendChild(rightContainer);
            leftContainer && block.appendChild(leftContainer);
        } else {
            htmlUtils.appendElementsTo(leftContainer,
                {
                    headline: { element: selectors.headline.element },
                    description: { element: selectors.description.element },
                    button: { element: selectors.button.element }
                });

            htmlUtils.appendElementsTo(rightContainer,
                {
                    illustrationContainer: { element: selectors.illustrationContainer.element },
                    darkIllustrationContainer: { element: selectors.darkIllustrationContainer.element }
                });

            leftContainer && block.appendChild(leftContainer);
            rightContainer && block.appendChild(rightContainer);
        }
    }
    arrangeContainers();
}


