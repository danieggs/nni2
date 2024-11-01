import {getDeviceType} from "../../scripts/funcs/storageUtils";
import {isAdobeCloud} from "../../scripts/video-support";
import {observeVisibility} from "../../scripts/aem";
import {safelyAppendTheItem, appendElementsTo} from "../../scripts/funcs/htmlUtils";

const blockName = 'case-study-table';

interface tableItemInterface {
    upperText?: string;
    itemTitle?: string;
    itemLink?: string;
}

interface DataModel {
    title: {
        element: HTMLElement;
        contentText: string;
    },
    button: {
        element: HTMLAnchorElement;
        contentText: string;
        linkHref: string;
    },
    imageContainer: {
        element: HTMLElement;
        pictureHtml: HTMLPictureElement;
    };
    cardsContainer: {
        element: HTMLElement;
        itemsOfChildren: tableItemInterface[];
    }
}

export default function decorate(block: HTMLElement) {
    const dataContainers = Array.from(block.children) as HTMLDivElement[];
    // Dynamic selectors object
    const selectors: DataModel = {
        title: {
            element: createElementWithClass('h2', `${blockName}__title`),
            contentText: searchNestedContent(dataContainers[0])
        },
        button: {
            element: createElementWithClass('a', `${blockName}__button button primary`),
            contentText: searchNestedContent(dataContainers[1]),
            linkHref: searchNestedContent(dataContainers[2])
        },
        imageContainer: {
            element: createElementWithClass('div', `${blockName}__image-wrapper`),
            pictureHtml: searchNestedPicture(dataContainers[3], `${blockName}__picture`)
        },
        cardsContainer: {
            element: createElementWithClass('div', `${blockName}__items-wrapper`),
            itemsOfChildren: Array.from(dataContainers).slice(4).map((container: HTMLDivElement) => {
                return {
                    upperText: searchNestedContent(container.children[0] as HTMLElement),
                    itemTitle: searchNestedContent(container.children[1] as HTMLElement),
                    itemLink: searchNestedHref(container.children[2] as HTMLElement)
                };
            })
        }
    }

    selectors.title.element.textContent = selectors.title.contentText;
    selectors.button.element.textContent = selectors.button.contentText;
    selectors.button.element.href = selectors.button.linkHref;
    safelyAppendTheItem(selectors.imageContainer.element, selectors.imageContainer.pictureHtml, HTMLPictureElement);

    const fragment = document.createDocumentFragment();

    selectors.cardsContainer.itemsOfChildren.forEach((itemChildren: tableItemInterface) => {
        const elementObject = createElementWithClass('a', `${blockName}__link-wrapper`);
        elementObject.href = itemChildren.itemLink;
        const upperText = createElementWithClass('p', `${blockName}__link-wrapper--upper-text`);
        upperText.textContent = itemChildren.upperText;
        const title = createElementWithClass('h4', `${blockName}__link-wrapper--title-item`);
        title.textContent = itemChildren.itemTitle;
        elementObject.appendChild(upperText);
        elementObject.appendChild(title);
        fragment.appendChild(elementObject);
    });

    selectors.cardsContainer.element.appendChild(fragment);

    let lastDeviceType = getDeviceType();

    if (isAdobeCloud()) {
        const children = block.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].tagName.toLowerCase() === 'div') {
                (children[i] as HTMLDivElement).style.display = 'none';
            }
        }
    } else {
        block.innerHTML = '';
    }
    const leftContainer: HTMLDivElement = document.createElement('div');
    leftContainer.classList.add(`${blockName}__left-container`);
    const rightContainer: HTMLDivElement = document.createElement('div');
    rightContainer.classList.add(`${blockName}__right-container`);

    window.addEventListener('resize', handleResize);

    const arrangeContainers = () => {
        const deviceType = getDeviceType();
        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';

        if (deviceType === 'mobile' || deviceType === 'tablet') {
            appendElementsTo(leftContainer, {
                title: {element: selectors.title.element},
                cardsContainer: {element: selectors.cardsContainer.element},
                button: {element: selectors.button.element},
            });
            block.appendChild(leftContainer);
        } else {
            appendElementsTo(leftContainer, {
                title: {element: selectors.title.element},
                cardsContainer: {element: selectors.cardsContainer.element}
            });
            appendElementsTo(rightContainer, {
                button: {element: selectors.button.element},
                imageContainer: {element: selectors.imageContainer.element}
            });
            block.appendChild(leftContainer);
            block.appendChild(rightContainer);
        }
    };

    arrangeContainers();

    observeVisibility('.case-study-table', (element: HTMLElement) => {
        const linkWrappers = element.querySelectorAll('.case-study-table__link-wrapper');
        if (linkWrappers.length >= 4) {
            const heightOfImage = computeTotalHeight(linkWrappers);
            const imageRight = element.querySelector('.case-study-table__picture') as HTMLDivElement;
            imageRight.style.height = `${heightOfImage}px`;
        }
    });

    function handleResize() {
        const currentDeviceType = getDeviceType();
        if (lastDeviceType !== currentDeviceType) {
            lastDeviceType = currentDeviceType;
            arrangeContainers();
        }
    }
}

function computeTotalHeight(linkWrappers: NodeListOf<Element>): number {
    return Array.from(linkWrappers).reduce((totalHeight, linkWrapper) => {
        const computedStyle = window.getComputedStyle(linkWrapper as HTMLElement);
        const height = parseFloat(computedStyle.height);
        const marginTop = parseFloat(computedStyle.marginTop);
        const marginBottom = parseFloat(computedStyle.marginBottom);
        return totalHeight + height + marginTop + marginBottom;
    }, 0);
}

function searchNestedContent(element: HTMLElement): string | null {
    const findTextContent = (el: Element): string | null => {
        const textContent = el.textContent?.trim();
        if (textContent) return textContent;
        for (const child of Array.from(el.children)) {
            const content = findTextContent(child);
            if (content) return content;
        }
        return null;
    };
    return findTextContent(element);
}

function searchNestedPicture(element: HTMLElement, classNames?: string | string[]): HTMLPictureElement | null {
    const findPictureElement = (el: Element): HTMLPictureElement | null => {
        if (el instanceof HTMLPictureElement) {
            if (classNames) {
                el.classList.add(...(Array.isArray(classNames) ? classNames : classNames.split(' ')));
            }
            return el;
        }
        for (const child of Array.from(el.children)) {
            const foundPicture = findPictureElement(child);
            if (foundPicture) return foundPicture;
        }
        return null;
    };
    return findPictureElement(element);
}

function searchNestedHref(element: HTMLElement | null): string {
    if (!element) return '';
    const anchor = element.querySelector('a');
    if (anchor) return anchor.getAttribute('href') || '';
    for (const child of Array.from(element.children)) {
        const nestedHref = searchNestedHref(child as HTMLElement);
        if (nestedHref) return nestedHref;
    }
    return '';
}

function createElementWithClass<K extends keyof HTMLElementTagNameMap>(tag: K, classNames: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    element.classList.add(...classNames.split(' '));
    return element;
}
