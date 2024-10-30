function datatableBottomItemFix() {
    // Select the paginator container
    const paginatorContainer = document.querySelector('.p-paginator-bottom.p-paginator.p-component');

    if (paginatorContainer) {
        // Set display to flex
        paginatorContainer.style.display = 'flex';
        paginatorContainer.style.justifyContent = 'space-between';

        // Create a new wrapper div
        const wrapperDiv = document.createElement('div');

        // Array of class selectors to wrap
        const classSelectors = [
            '.p-paginator-first.p-paginator-element',
            '.p-paginator-prev.p-paginator-element',
            '.p-paginator-pages',
            '.p-paginator-next.p-paginator-element',
            '.p-paginator-last.p-paginator-element'
        ];

        // Iterate over the class selectors
        classSelectors.forEach(selector => {
            const elements = paginatorContainer.querySelectorAll(selector);
            elements.forEach(element => {
                // Append the original element to the wrapper div
                wrapperDiv.appendChild(element);
                // Remove the original element
                // element.parentNode.removeChild(element);
            });
        });

        wrapperDiv.style.flex = 1;
        wrapperDiv.style.display = 'flex';
        wrapperDiv.style.justifyContent = 'center';

        // Append the wrapper div to the paginator container
        paginatorContainer.appendChild(wrapperDiv);

        // Find the dropdown component
        const dropdownComponent = paginatorContainer.querySelector('.p-dropdown.p-component.p-inputwrapper.p-inputwrapper-filled');

        if (dropdownComponent) {
            // Clone and append the dropdown component after the wrapper div
            paginatorContainer.appendChild(dropdownComponent);
            // Remove the old dropdown component
            // dropdownComponent.parentNode.removeChild(dropdownComponent);
        }
    }
}

export {
    datatableBottomItemFix
};