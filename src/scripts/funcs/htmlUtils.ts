/**
 * Searches for a headline in a nested HTML structure.
 *
 * @param element - The HTML element in which to search for the headline.
 * @return The innerHTML of the element if it exists, or `null` if the element doesn't exist.
 */
function searchNestedHeadline(element: HTMLElement): string | null {
    if (!element) return null;
    return element.innerHTML;
}

/**
 * Recursively searches for content within a nested HTML structure.
 *
 * @param el - The HTML element in which to search for content.
 * @return The trimmed text content of the first element with non-empty text, or `null` if no such element is found.
 */
function searchNestedContent(el: Element): string | null {
    if (el instanceof HTMLElement) {
        // If the element has text content directly, return it
        const textContent = el.textContent?.trim();
        if (textContent) return textContent;
        const childWithContent = Array.from(el.children).find(child => searchNestedContent(child) !== null);
        return childWithContent ? searchNestedContent(childWithContent) : null;
    }
    return null;
}
/**
 * Recursively searches for a <picture> element inside the given HTMLElement.
 *
 * @param element - The HTMLElement to start searching from.
 * @param classNames
 * @returns The <picture> element if found, otherwise null.
 */
function searchNestedPicture(element: HTMLElement, classNames?: string | string[]): HTMLPictureElement | null {
    if (!element) return null;

    // Recursive function to find a <picture> element
    function findPictureElement(el: Element): HTMLPictureElement | null {
        if (el instanceof HTMLPictureElement) {
            // If a <picture> element is found and classNames is provided, add the classes
            if (classNames) {
                if (Array.isArray(classNames)) {
                    el.classList.add(...classNames); // Spread the array of class names
                } else {
                    el.classList.add(...classNames.split(' ')); // Split space-separated class names
                }
            }
            return el; // Return the <picture> tag
        }

        // Search recursively through its children
        for (let i = 0; i < el.children.length; i++) {
            const foundPicture = findPictureElement(el.children[i]);
            if (foundPicture) return foundPicture; // Return if a <picture> tag is found
        }

        return null;
    }

    // Start recursive search from the provided element
    return findPictureElement(element);
}

// Helper function to create elements
function createElementWithClass<K extends keyof HTMLElementTagNameMap>(tag?: K, classNames?: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    // Split the classNames string by spaces and add each class
    element.classList.add(...classNames.split(' '));
    return element;
}

interface ElementObj {
    element?: HTMLElement;
    [key: string]: HTMLElement | undefined; // This line is for other properties that you might have on this object
}

function appendElementsTo(container: HTMLElement, elementsObj: Record<string, ElementObj>): void {
    Object.values(elementsObj).forEach((item) => {
        if (item && item.element instanceof HTMLElement) {
            container.appendChild(item.element);
        } else {
            console.warn('Invalid or non-HTMLElement found:', item);
        }
    });
}

function safelyAppendTheItem(container: HTMLElement, element: HTMLElement | null, expectedType: new() => HTMLElement) {
    // Check if the element is not null and is of the expected type
    if (element !== null && element instanceof expectedType) {
        container.appendChild(element);
    } else {
        console.warn('Failed to append: Element is either null or not an instance of the expected type.');
    }
}

export {searchNestedHeadline, searchNestedContent, searchNestedPicture, createElementWithClass, appendElementsTo, safelyAppendTheItem };
