/**
 * Seems to be a flaw in the assignment
 * * Once Hammer.js is called it takes over pan and swipe duty from this.
 */
let profile = document.querySelector('#profilearea');

dragStart = (e) => {
  e.target.opacity = 1;
  e.dataTransfer.setData("text", profilecount);
  e.dataTransfer.dropEffect = 'move';
}

dragDrop = (e) => {
  e.preventDefault();
  console.log(e);
  if(e.x < 800) {
    rate('dislike');
  } else if(e.x > 1400) {
    rate('like');
  }
}

dragEnd = (e) => e.target.style.opacity = '';

dragOver = (e) => {
  e.preventDefault();
  profile.style.transform = `translateX(${e.x})`;
  if(e.x < 800) {

  }
  
}




(function() {
  document.addEventListener('dragstart', dragStart, false);
  document.addEventListener('drop', dragDrop, false);
  document.addEventListener('dragend', dragEnd, false);
  document.addEventListener('dragover', dragOver, false);
}) ();