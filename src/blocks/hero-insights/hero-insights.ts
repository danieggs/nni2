import { getDeviceType } from "../../scripts/funcs/storageUtils";
import * as htmlUtils from "../../scripts/funcs/htmlUtils";
import { shareOnSocial } from "../../scripts/funcs/socialShareUtils";
import { createTagElements } from "../../scripts/funcs/textUtils";
import { isAdobeCloud } from "../../scripts/video-support";

const blockName = 'hero-insights';

interface DataModel {
    imageContainer: {
        element: HTMLElement;
        pictureHtml: HTMLPictureElement | null;
    };
    linkBack: {
        element: HTMLDivElement;
        content: {
            element: HTMLAnchorElement;
            contentText: string;
            linkHref: string | null;
        };
    };
    tags: {
        element: HTMLElement;
    };
    socialMediaLinks: {
        element: HTMLElement | null;
    };
    smileIcon: {
        element: HTMLElement | null;
    };
}

export default function decorate(block: HTMLElement) {
    const dataContainers = Array.from(block.children) as HTMLDivElement[];

    const linkBackWrapper = htmlUtils.createElementWithClass('div', `${blockName}__link-back-wrapper`);
    const linkBackAnchor = htmlUtils.createElementWithClass('a', `${blockName}__link-back`);
    const linkHref = htmlUtils.searchNestedContent(dataContainers[2]);

    const imageWrapper = htmlUtils.createElementWithClass('div', `${blockName}__image-wrapper`);

    const selectors: DataModel = {
        imageContainer: {
            element: imageWrapper,
            pictureHtml: (() => {
                const pictureElement = htmlUtils.searchNestedPicture(dataContainers[0], `${blockName}__picture`);
                if (pictureElement) {
                    const imgElement = pictureElement.querySelector('img');
                    imgElement?.classList.add(`${blockName}__image`);
                }
                return pictureElement || null;
            })(),
        },
        linkBack: {
            element: linkBackWrapper,
            content: {
                element: linkBackAnchor,
                contentText: htmlUtils.searchNestedContent(dataContainers[1]),
                linkHref: linkHref,
            }
        },
        tags: {
            element: (() => {
                const tagsDiv = htmlUtils.createElementWithClass('div', `${blockName}__tags-wrapper`);
                const tagElements = createTagElements();
                tagElements.forEach(pTag => tagsDiv.append(pTag));
                return tagsDiv;
            })(),
        },
        socialMediaLinks: {
            element: (() => {
                const socialMediaLinksDiv = htmlUtils.createElementWithClass('div', `${blockName}__share-social-wrapper`);
                const socialMediaText = htmlUtils.searchNestedContent(dataContainers[5]);

                socialMediaText && (socialMediaLinksDiv.textContent = socialMediaText);

                const socialPlatforms = ['facebook', 'linkedin'];
                socialPlatforms.forEach(platform => {
                    const socialDiv = htmlUtils.createElementWithClass('div', `${blockName}__share-social--${platform}`);
                    socialDiv.addEventListener('click', () => shareOnSocial(platform));
                    socialMediaLinksDiv.appendChild(socialDiv);
                });
                return socialMediaLinksDiv;
            })(),
        },
        smileIcon: {
            element: (() => {
                const smileIconContainer = htmlUtils.createElementWithClass('div', `${blockName}__smile-icon-wrapper`);
                const smileIconText = htmlUtils.createElementWithClass('a', `${blockName}__smile-icon-text`);
                const smileIconLink = htmlUtils.searchNestedContent(dataContainers[4]);
                const textContent = htmlUtils.searchNestedContent(dataContainers[3]);
                if (textContent && smileIconLink) {
                    smileIconText.textContent = textContent;
                    smileIconText.href = smileIconLink;
                    smileIconContainer.appendChild(smileIconText);
                    return smileIconContainer;
                } else {
                    return null;
                }
            })(),
        },
    };

    linkBackWrapper.appendChild(linkBackAnchor);
    selectors.linkBack.content.element.textContent = selectors.linkBack.content.contentText;
    if (selectors.linkBack.content.linkHref) {
        selectors.linkBack.content.element.href = selectors.linkBack.content.linkHref;
    } else {
        console.warn("linkHref is null or undefined.");
    }

    if (selectors.imageContainer.pictureHtml) {
        htmlUtils.safelyAppendTheItem(selectors.imageContainer.element, selectors.imageContainer.pictureHtml, HTMLPictureElement);
    }
    if (selectors.smileIcon.element) {
        htmlUtils.safelyAppendTheItem(selectors.imageContainer.element, selectors.smileIcon.element, HTMLElement);
    }

    const bottomContainer: HTMLDivElement = document.createElement('div');
    bottomContainer.classList.add(`${blockName}__bottom-container`);


    // Check if there's text content
    const hasLinkBackContent = selectors.linkBack.content.contentText && selectors.linkBack.content.contentText.trim() !== '';
    const hasSocialMediaText = selectors.socialMediaLinks.element.textContent.trim() !== '';
    if (hasLinkBackContent) {
        linkBackWrapper.classList.add('has-content');
    }


    let lastDeviceType = getDeviceType();

    window.addEventListener('resize', () => {
        if (lastDeviceType !== getDeviceType()) {
            lastDeviceType = getDeviceType();
            arrangeContainers();
        }
    });

    const arrangeContainers = () => {
        block.innerHTML = '';
        bottomContainer.innerHTML = '';

        if (lastDeviceType === 'mobile' || lastDeviceType === 'tablet') {
            hasLinkBackContent && block.appendChild(selectors.linkBack.element);
            block.appendChild(selectors.imageContainer.element);
            block.appendChild(selectors.tags.element);
            hasSocialMediaText && block.appendChild(selectors.socialMediaLinks.element);
        } else {
            // Add elements to bottomContainer conditionally
            const elementsToAppend: { [key: string]: { element: HTMLElement } } = {};
            hasLinkBackContent && (elementsToAppend['linkBack'] = { element: selectors.linkBack.element });
            elementsToAppend['tags'] = { element: selectors.tags.element };
            hasSocialMediaText && (elementsToAppend['socialMediaLinks'] = { element: selectors.socialMediaLinks.element });
            htmlUtils.appendElementsTo(bottomContainer, elementsToAppend);
            block.appendChild(selectors.imageContainer.element);
            block.appendChild(bottomContainer);
        }
    };

    arrangeContainers();

    const tagsWrapper = document.querySelector(`.${blockName}__tags-wrapper`) as HTMLDivElement;
    const pictureWrapper = document.querySelector(`.${blockName}__image-wrapper`) as HTMLDivElement;
    const pictureDiv = selectors.imageContainer.pictureHtml;
    const imageDiv = pictureDiv?.querySelector('img') as HTMLImageElement;


    const pictureOrImg = imageWrapper.querySelector('picture, img');
    if (pictureOrImg) {
        pictureWrapper.classList.add('has-image');
    }

    const updateImageWrapperHeightMobiles = () => {
        const setHeight = (elements: HTMLElement[], height: string) => {
            elements.forEach(element => {
                if (element) {
                    element.style.height = height;
                }
            });
        };

        if (lastDeviceType === 'mobile' && !isAdobeCloud() && tagsWrapper) {
            const tagsCount = tagsWrapper.querySelectorAll("p").length;
            if (tagsCount >= 3 && pictureWrapper && pictureDiv && imageDiv) {
                setHeight([pictureWrapper, pictureDiv, imageDiv], "58vh");
            }
        }
    };

    updateImageWrapperHeightMobiles();

    const observer = new MutationObserver(updateImageWrapperHeightMobiles);
    observer.observe(tagsWrapper, { childList: true });
}
