console.log('This would be the main JS file.');

function add_stars(review_num, num_stars) {
  for (i=0; i<num_stars; i++) {
    $('#'+review_num).append('<img class="review-star" width="16px" src="images/star.png">');
  }
}