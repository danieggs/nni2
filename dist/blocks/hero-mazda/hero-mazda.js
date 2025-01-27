export default async function decorate(block) {
    console.log('Hero mazda is saying:', block);
    // Select the specific headline element as before
    const headlineElement = block.querySelector('div:nth-of-type(1) > div:nth-of-type(1) > div');
    console.log("You have:", headlineElement);
    // Select all <p> elements within the block
    const paragraphElements = block.querySelectorAll('p');
    if (paragraphElements.length === 0) {
        console.log('No <p> elements found within the block.');
        return;
    }
    // Iterate over each <p> element and make it editable
    paragraphElements.forEach((pElement) => {
        pElement.contentEditable = 'true'; // Set contentEditable to true
        // Optional: Add event listeners to handle changes
        pElement.addEventListener('input', () => {
            console.log('Content edited:', pElement.textContent);
            // You can add additional logic here, such as saving changes
        });
    });
    console.log(`Made ${paragraphElements.length} <p> element(s) editable.`);
}
