// Variables to check start position and drag
let startPos = profile.offsetLeft;
let isDragging = false;
let panRate = document.querySelector('.rating__block');


let touchy = new Hammer(profile);


handleTouchy = (e) => {
    let element = e.target;
    if(!isDragging) {
        isDragging = true;
    }

    let posX = e.deltaX + startPos;
    element.style.left = posX + 'px';
    element.style.opacity = (1 - (Math.abs(e.deltaX) / 1000));
    
    if(e.isFinal) {
        isDragging = false;
        if(e.deltaX > 100) {
            rate('like');
        } else if(e.deltaX < -100) {
            rate('dislike');
        }
        element.style.left = startPos + 'px';
        element.style.opacity = 1;
    }
}

touchy.on('pan', handleTouchy);
touchy.on('swipe', handleTouchy);