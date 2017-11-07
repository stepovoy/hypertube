window.onload = function (event) {
    resize_movie_imgs();
};

window.onresize = function (event) {
    resize_movie_imgs();
};

function resize_movie_imgs() {
    var imgs = document.getElementsByClassName('movie-img');

    for (var i = 0; i < imgs.length; i++) {
        var width = imgs[i].offsetWidth;
        var height = width * (500 / 430);
        imgs[i].style.height = height + 'px';
    }
}