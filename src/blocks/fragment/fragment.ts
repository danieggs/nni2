/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

import { decorateMain } from '../../scripts/scripts';

import { loadSections } from '../../scripts/aem';

/**
 * Loads a fragment.
 * @param path The path to the fragment
 * @returns The root element of the fragment
 */
export async function loadFragment(path: string): Promise<HTMLElement | null> {
  if (path && path.startsWith('/')) {
    // eslint-disable-next-line no-param-reassign
    path = path.replace(/(\.plain)?\.html/, '');
    const response = await fetch(`${path}.plain.html`);
    if (response.ok) {
      const main = document.createElement('main');
      main.innerHTML = await response.text();

      // Reset base path for media to fragment base
      const resetAttributeBase = (tag: string, attr: string) => {
        main.querySelectorAll<HTMLElement>(`${tag}[${attr}^="./media_"]`).forEach((element) => {
          const originalAttribute:string = element.getAttribute(attr);
          if (originalAttribute) {
            element[attr] = new URL(originalAttribute, new URL(path, window.location.href)).href as never;
          }
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block: HTMLElement): Promise<void> {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector<HTMLElement>(':scope > .section');
    if (fragmentSection) {
      const targetSection = block.closest('.section');
      if (targetSection) {
        targetSection.classList.add(...Array.from(fragmentSection.classList));
        const fragmentParent = block.closest('.fragment');
        if (fragmentParent) {
          fragmentParent.replaceWith(...Array.from(fragment.childNodes));
        }
      }
    }
  }
}
