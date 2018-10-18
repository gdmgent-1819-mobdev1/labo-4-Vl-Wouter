// TODO: Write animations

let button = document.querySelector('#desktopList');
let list = document.querySelector('.sidebar');

toggleClass = (element, name) => {
    element.classList.toggle(name);
}

move = (element, animation) => {
    element.classList.toggle(animation);
    animation == 'move--in' ? toggleClass(element, 'out') : '';
    setTimeout(() => {
        element.classList.toggle(animation);
        animation == 'move--out' ? toggleClass(element, 'out') : '';
    }, 250);
}


listShow = () => {
    button.removeEventListener('click', listShow);
    //console.log('showing list');
    //toggleClass(list, 'out');
    move(list, 'move--in');
    button.addEventListener('click', listHide);
}

listHide = () => {
    button.removeEventListener('click', listHide);
    //console.log('hiding list');
    //toggleClass(list, 'out');
    move(list, 'move--out');
    button.addEventListener('click', listShow);
}

document.body.onload = () => {
    button.addEventListener('click', listShow);
}
