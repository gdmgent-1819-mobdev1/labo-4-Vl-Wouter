let app = document.querySelector('.app__block');
let list = document.querySelector('.sidebar');


addClass = (element, name) => {
    element.classList.add(name);
}

removeClass = (element, name) => {
    element.classList.remove(name);
}

listShow = () => {

    addClass(app, 'move--out');
    addClass(list, 'in');

    setTimeout(() => {
        addClass(app, 'out');
        removeClass(app, 'move--out');
        document.getElementById('desktopList').removeEventListener('click', () => listShow());
        document.getElementById('desktopList').addEventListener('click', () => listHide());
    }, 500);
    
};

listHide = () => {
    addClass(app, 'move--in');
    removeClass(list, 'in');

    setTimeout(() => {
        removeClass(app, 'move--in');
        removeClass(app, 'out');
        document.getElementById('desktopList').removeEventListener('click', () => listHide());
        document.getElementById('desktopList').addEventListener('click', () => listShow());
    }, 500);
}

// Event listeners
document.getElementById('desktopList').addEventListener('click', () => listShow());