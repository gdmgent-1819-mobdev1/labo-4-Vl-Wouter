// TODO: Write animations

let button = document.querySelector('#desktopList');
let list = document.querySelector('.sidebar');

toggleClass = (element, name) => {
    element.classList.toggle(name);
}


listShow = () => {
    button.removeEventListener('click', listShow);
    console.log('showing list');
    toggleClass(list, 'out');
    button.addEventListener('click', listHide);
}

listHide = () => {
    button.removeEventListener('click', listHide);
    console.log('hiding list');
    toggleClass(list, 'out');
    button.addEventListener('click', listShow);
}

document.body.onload = () => {
    button.addEventListener('click', listShow);
}
