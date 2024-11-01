import { getDeviceType } from "../../scripts/funcs/storageUtils.js";
import { isAdobeCloud } from "../../scripts/video-support.js";
import { observeVisibility } from "../../scripts/aem.js";
import { safelyAppendTheItem, appendElementsTo } from "../../scripts/funcs/htmlUtils.js";
const blockName = 'case-study-table';
export default function decorate(block) {
    const dataContainers = Array.from(block.children);
    // Dynamic selectors object
    const selectors = {
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
            itemsOfChildren: Array.from(dataContainers).slice(4).map((container) => {
                return {
                    upperText: searchNestedContent(container.children[0]),
                    itemTitle: searchNestedContent(container.children[1]),
                    itemLink: searchNestedHref(container.children[2])
                };
            })
        }
    };
    selectors.title.element.textContent = selectors.title.contentText;
    selectors.button.element.textContent = selectors.button.contentText;
    selectors.button.element.href = selectors.button.linkHref;
    safelyAppendTheItem(selectors.imageContainer.element, selectors.imageContainer.pictureHtml, HTMLPictureElement);
    const fragment = document.createDocumentFragment();
    selectors.cardsContainer.itemsOfChildren.forEach((itemChildren) => {
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
                children[i].style.display = 'none';
            }
        }
    }
    else {
        block.innerHTML = '';
    }
    const leftContainer = document.createElement('div');
    leftContainer.classList.add(`${blockName}__left-container`);
    const rightContainer = document.createElement('div');
    rightContainer.classList.add(`${blockName}__right-container`);
    window.addEventListener('resize', handleResize);
    const arrangeContainers = () => {
        const deviceType = getDeviceType();
        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';
        if (deviceType === 'mobile' || deviceType === 'tablet') {
            appendElementsTo(leftContainer, {
                title: { element: selectors.title.element },
                cardsContainer: { element: selectors.cardsContainer.element },
                button: { element: selectors.button.element },
            });
            block.appendChild(leftContainer);
        }
        else {
            appendElementsTo(leftContainer, {
                title: { element: selectors.title.element },
                cardsContainer: { element: selectors.cardsContainer.element }
            });
            appendElementsTo(rightContainer, {
                button: { element: selectors.button.element },
                imageContainer: { element: selectors.imageContainer.element }
            });
            block.appendChild(leftContainer);
            block.appendChild(rightContainer);
        }
    };
    arrangeContainers();
    observeVisibility('.case-study-table', (element) => {
        const linkWrappers = element.querySelectorAll('.case-study-table__link-wrapper');
        if (linkWrappers.length >= 4) {
            const heightOfImage = computeTotalHeight(linkWrappers);
            const imageRight = element.querySelector('.case-study-table__picture');
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
function computeTotalHeight(linkWrappers) {
    return Array.from(linkWrappers).reduce((totalHeight, linkWrapper) => {
        const computedStyle = window.getComputedStyle(linkWrapper);
        const height = parseFloat(computedStyle.height);
        const marginTop = parseFloat(computedStyle.marginTop);
        const marginBottom = parseFloat(computedStyle.marginBottom);
        return totalHeight + height + marginTop + marginBottom;
    }, 0);
}
function searchNestedContent(element) {
    const findTextContent = (el) => {
        var _a;
        const textContent = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim();
        if (textContent)
            return textContent;
        for (const child of Array.from(el.children)) {
            const content = findTextContent(child);
            if (content)
                return content;
        }
        return null;
    };
    return findTextContent(element);
}
function searchNestedPicture(element, classNames) {
    const findPictureElement = (el) => {
        if (el instanceof HTMLPictureElement) {
            if (classNames) {
                el.classList.add(...(Array.isArray(classNames) ? classNames : classNames.split(' ')));
            }
            return el;
        }
        for (const child of Array.from(el.children)) {
            const foundPicture = findPictureElement(child);
            if (foundPicture)
                return foundPicture;
        }
        return null;
    };
    return findPictureElement(element);
}
function searchNestedHref(element) {
    if (!element)
        return '';
    const anchor = element.querySelector('a');
    if (anchor)
        return anchor.getAttribute('href') || '';
    for (const child of Array.from(element.children)) {
        const nestedHref = searchNestedHref(child);
        if (nestedHref)
            return nestedHref;
    }
    return '';
}
function createElementWithClass(tag, classNames) {
    const element = document.createElement(tag);
    element.classList.add(...classNames.split(' '));
    return element;
}
