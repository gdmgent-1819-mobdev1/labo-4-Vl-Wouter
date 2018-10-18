let profile = document.querySelector('#profilearea');

dragStart = (e) => {
  e.target.opacity = .3;
  e.dataTransfer.setData("text", profilecount);
  e.dataTransfer.dropEffect = 'move';
}

dragDrop = (e) => {
  e.preventDefault();
  console.log(e.toElement);
  if(e.toElement.classList.contains('drop__block')) {
    if(e.toElement.classList.contains('drop__dislike')) {
      console.log('dropped on dislike');
      rate('like');
    }
    else {
      console.log('dropped on like');
      rate('dislike');
    }
  }
};

dragEnd = (e) => e.target.style.opacity = '';

dragOver = (e) => e.preventDefault();



(function() {
  document.addEventListener('dragstart', dragStart, false);
  document.addEventListener('drop', dragDrop, false);
  document.addEventListener('dragend', dragEnd, false);
  document.addEventListener('dragover', dragOver, false);

}) ();