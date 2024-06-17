
function showHideModal(element, action) {
    const $targetEl = document.getElementById(element);
    const modal = new Modal($targetEl);
    if (action == 'show') {
        modal.show();
    } else if (action == "hide") {
        modal.hide();
    }
}

