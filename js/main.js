$(document).ready(function () {
    var effect;
    var interval;
    var inner;
    var outer;
    var footer = document.getElementById("marvel-data");
    var search = $("#search");
    var thesaurus = $("#thesaurus");

    search.hide();
    thesaurus.hide();
    updateTime();

    $(document).on("click", ".page-content", function () {
        var c = $(this).val();
        var content = $("#contentdiv table");
        content.hide();
        var container = $(".container");
        container.find("*").not("#footerdiv").remove();
        container.append("<div class='outer'></div>");
        outer = $(".outer");
        if (c == 1) {
            thesaurus.hide();
            updateTime();
            setInterval(updateTime, 1000);
            fadeInDate();
            fadeOutSearchBar();
            outer.replaceWith(buildHomePage());
            content.css("filter", "blur(20px)");
            blurImage();
            content.fadeIn(1000);
        }
        if (c == 2) {
            thesaurus.fadeOut(50).empty();
            $(".searchbar").attr("id", "comicsSearch");
            fadeOutDate();
            search.fadeIn(2000);
            searchComicsList();
            content.fadeIn(1000);
        }
        if (c == 3) {
            thesaurus.fadeOut(50).empty();
            $(".searchbar").attr("id", "moviesSearch");
            fadeOutDate();
            search.fadeIn(2000);
            buildMoviesList();
            content.fadeIn(1000);
        }
        if (c == 4) {
            thesaurus.hide();
            fadeOutDate();
            content.show();
            fadeOutSearchBar();
            outer.replaceWith(buildGamesPage());
            gameSetup();
            blurImage();
        }
        if (c == 5) {
            thesaurus.hide();
            fadeOutDate();
            fadeOutSearchBar();
            outer.replaceWith(buildAboutPage());
            blurImage();
            content.fadeIn(1000);
        }
    });

    //  Blur Effect

    function blurImage() {
        effect = 14;
        clearInterval(interval);
        blurEffect();
        interval = setInterval(blurEffect, 50);
    }
    function blurEffect() {
        var content = $("#contentdiv table");
        var navigation = $("#navdiv li");
        var hover = $("ul li:hover");
        if (effect > 0) {
            content.css("filter", blurString());
            navigation.css("filter", blurString());
            hover.css("filter", "none");
        }
        effect--;
        if (effect == 0) {
            content.css("filter", "none");
            navigation.css("filter", "none");
            clearInterval(timer);
        }
    }
    function blurString() {
        return "blur(" + effect + "px)";
    }

    //  Fades
    function fadeOutSearchBar() {
        search.fadeOut(50);
        footer.innerHTML = "";
    }
    function fadeInDate() {
        $("#date").fadeIn(50);
    }
    function fadeOutDate() {
        $("#date").fadeOut(50);
    }


    //  Navigation Bar Effects

    $("#logo").mouseenter(function () {
        var div = $(this);
        div.stop(true, false);
        div.animate({ width: '170px', opacity: '1' }, "slow");
    });
    $("#logo").mouseleave(function () {
        var div = $(this);
        div.stop(true, false);
        div.animate({ width: '150px', opacity: '0.5' }, "slow");
    });
    $(".button").mouseenter(function () {
        var div = $(this);
        div.stop(true, false);
        $(div).animate({
            "font-size": "150%",
        }, 100);
    });
    $(".button").mouseleave(function () {
        var div = $(this);
        div.stop(true, false);
        $(div).animate({
            "font-size": "100%",
        }, 100);
    });

    // Search

    window.searchList = function () {
        var searchOption = $(".searchbar").attr('id');
        if (searchOption == "moviesSearch") {
            searchMoviesList();
            thesaurus.fadeIn(1000);
        }
        else if (searchOption == "comicsSearch") {
            searchComicsList();
            thesaurus.fadeIn(1000);
        }
    }

    //  Home

    function buildHomePage() {
        outer.append('<h1>HOME</h1><br>');
        outer.append('<p class="home">Marvel started in 1939 as Timely Publications, and by the early 1950s had generally become known as Atlas Comics.</p><br>');
        outer.append('<p class="home">Marvels modern incarnation dates from 1961, the year that the company launched The Fantastic Four and other superhero titles created by Stan Lee, Jack Kirby, Steve Ditko and many others.</p><br>');
        outer.append('<p class="home">Marvel counts among its comics such well-known superheroes as Captain America, Spider-Man, Iron Man, Hulk, Thor, Black Widow, Hawkeye, Doctor Strange, Ms. Marvel, Deadpool, Wolverine and Ant-Man, such teams as the Avengers, the Guardians of the Galaxy, the Fantastic Four, the Defenders, and the X-Men, and antagonists such as Doctor Doom, Red Skull, Green Goblin, Ultron, Doctor Octopus, Thanos, Magneto and Loki.</p>');
        outer.css({
            "width": "600px",
            "height": "600px",
        });
        $(".home").css({
            "text-align": "left",
        });
        return outer;
    }
    function updateTime() {
        var date = document.getElementById("date");
        date.innerHTML = Date();
    }

    // Comics
    window.searchComicsList = function () {
        thesaurus.empty();
        var thesaurusResult = document.getElementById("comicsSearch").value.toUpperCase().split(" ")[0];
        if (thesaurusResult) {
            bigHugeThesaurus(thesaurusResult);
        }
        var searchInput = document.getElementById("comicsSearch").value.toUpperCase().split(" ").join("_");
        var searchUrl = "https://gateway.marvel.com/v1/public/comics?ts=1&apikey=6ee99b3ec48b4ef09082c78f1e09f6d0&hash=bda2d23a835cfcf7241c38c16be0505e&format=comic&formatType=comic&noVariants=true&orderBy=title%2C-onsaleDate&limit=10&titleStartsWith=%" + searchInput + "%";
        var message = document.getElementById("message");

        $.ajax({
            url: searchUrl,
            type: "GET",
            // data: {
            //     limit: 100
            // },
            beforeSend: function () {
                footer.innerHTML = "Loading...";
            },
            complete: function () {
                footer.innerHTML = "Data provided by Marvel. © 2017 MARVEL";
            },
            success: function (data) {
                footer.innerHTML = "";
                var list = document.createElement("ul");
                for (var i = 0; i < data.data.results.length; i++) {
                    var comic = data.data.results[i];
                    var item = document.createElement("li");
                    item.innerHTML = fullcomicInfo(comic);
                    list.appendChild(item);
                }
                setTimeout(function () {
                    var container = $(".container");
                    container.find("*").not("#footerdiv").remove();
                    container.append("<div class='inner'></div>");
                    var inner = $(".inner");
                    inner.replaceWith(list);
                    blurImage();
                }, 500);
            },
            error: function (jqXHR) {
                message.innerHTML = jqXHR.status;
            }
        });

        function fullcomicInfo(comic) {
            return "<div align=left><p></p></div><div align='center'>" + "<p>" + "<img class='comic-image' src='" + comic.thumbnail.path + "/portrait_incredible.jpg" + "' />" + "</p><hr>" + "</div>" + "<div align=left><p></p></div><div align='center'>" + "<p>" + comic.title + "</p><hr>" + "<div align=left><p></p></div><div class='comic-info' align='center'>" + "<p>" + "<a href='" + comic.urls[0].url + "' target='_blank'><p>< CLICK FOR INFORMATION ></p></a>" + "</p>";
        }
    }

    //  Movies

    var movies = [];

    function buildMoviesList() {
        var requestUrls = [page1, page2, page3];
        var page1 = "https://api.themoviedb.org/3/discover/movie?api_key=f96b8ab1344f9d932925b7709c40a293&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&with_companies=420&page=1";
        var page2 = "https://api.themoviedb.org/3/discover/movie?api_key=f96b8ab1344f9d932925b7709c40a293&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&with_companies=420&page=2";
        var page3 = "https://api.themoviedb.org/3/discover/movie?api_key=f96b8ab1344f9d932925b7709c40a293&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&with_companies=420&page=3";
        var message = document.getElementById("message");

        $.ajax({
            url: page1,
            type: "GET",
            beforeSend: function () {
                footer.innerHTML = "Loading...";
            },
            complete: function () {
                footer.innerHTML = "Data provided by Marvel. © 2017 MARVEL";
            },
            success: function (data) {
                footer.innerHTML = "";
                var list = document.createElement("ul");
                for (var i = 0; i < data.results.length; i++) {
                    var movie = data.results[i];
                    movies.push(movie);
                    var item = document.createElement("li");
                    item.innerHTML = fullMovieInfo(movie);
                    list.appendChild(item);
                }
                setTimeout(function () {
                    var container = $(".container");
                    container.find("*").not("#footerdiv").remove();
                    container.append("<div class='inner'></div>");
                    var inner = $(".inner");
                    inner.replaceWith(list);
                    blurImage();
                }, 500);
            },
            error: function () {
                message.innerHTML = "Error!";
            }
        });

        function fullMovieInfo(movie) {
            return "<div align=left><p></p></div><div align='center'>" + "<p>" + "<img class='comic-image' src='https://image.tmdb.org/t/p/w185" + movie.poster_path + "' />" + "</p><hr>" + "</div>" + "<div align=left><p></p></div><div align='center'>" + "<p>" + movie.title + "</p><hr>" + "<div align=left><p></p></div><div class='comic-info' align='center'>" + "<p>" + movie.vote_average + "</p>" + "</p>";
        }

        window.searchMoviesList = function () {
            thesaurus.empty();
            var thesaurusResult = document.getElementById("moviesSearch").value.toUpperCase().split(" ")[0];
            if (thesaurusResult) {
                bigHugeThesaurus(thesaurusResult);
            }
            var result = 0;
            var searchInput = document.getElementById("moviesSearch").value.toUpperCase();
            var list = document.createElement("ul");

            for (i = 0; i < movies.length; i++) {
                var item = document.createElement("li");
                if (movies[i].title.toLocaleUpperCase().includes(searchInput)) {
                    item.innerHTML = searchMovieInfo(i);
                    list.appendChild(item);
                    result++;
                }
                else if (movies[i].vote_average.toString().includes(searchInput)) {
                    item.innerHTML = searchMovieInfo(i);
                    list.appendChild(item);
                    result++;
                }
                else if (movies[i].overview.toString().includes(searchInput)) {
                    item.innerHTML = searchMovieInfo(i);
                    list.appendChild(item);
                    result++;
                }
            }
            if (result == 0) {
                var item = document.createElement("li");
                item.innerHTML = "<p>< NO RESULT ></p>";
                list.appendChild(item);
            }
            var container = $(".container");
            container.find("*").not("#footerdiv").remove();
            container.append("<div class='inner'></div>");
            var inner = $(".inner");
            inner.replaceWith(list);
        }

        function searchMovieInfo(i) {
            return "<div align=left><p></p></div><div align='center'>" + "<p>" + "<img class='comic-image' src='https://image.tmdb.org/t/p/w185" + movies[i].poster_path + "' />" + "</p><hr>" + "</div>" + "<div align=left><p></p></div><div align='center'>" + "<p>" + movies[i].title + "</p><hr>" + "<div align=left><p></p></div><div class='comic-info' align='center'>" + "<p>" + movies[i].vote_average + "</p>" + "</p>";
        }
    }

    //  Thesaurus

    window.bigHugeThesaurus = function (searchWord) {
        var url = "http://words.bighugelabs.com/api/2/5e6176d5ef73db9d32c2151710e796cd/" + searchWord + "/json";
        var message = document.getElementById("message");

        $.getJSON(url, (data) => {
            $.each(data, (index, result) => {
                $.each(result, (type, words) => {
                    $.each(words, (index, word) => {
                        thesaurus.append("<span class='thesaurus'>" + word + "</span><br/>");
                    });
                });
            })
        });
    }

    $(document).on("click", ".thesaurus", function () {
        $(".searchbar").val($(this).html()).focus();
        var searchOption = $(".searchbar").attr('id');
        if (searchOption == "moviesSearch") {
            searchMoviesList();
        }
        else if (searchOption == "comicsSearch") {
            searchComicsList();
        }
        // var keyCode = (event.keyCode ? event.keyCode : event.which);   
        // if (keyCode == 13) {
        //     $(".searchbar").trigger('click');
        // }
        // $(".searchbar").trigger(jQuery.Event('keypress', { keyCode: 13 }));
    });

    //  Games

    //  Marvel vs DC

    var stats;
    var showResult;
    var result;
    var showLife;
    var life;
    var time;
    var timer;
    var last;
    var random;
    var isDC;
    var isGameOver;
    var isTimerOn;

    function buildGamesPage() {
        outer.css({
            "width": "855px",
            "height": "225px",
            "padding-top": "60px",
            "border": "4px black inset",
        });
        outer.append("<ul id='inner'>");
        inner = $("#inner");

        $(".container").append("<div class='stats'></div>");
        stats = $(".stats");
        stats.append("<h1 id='showResult'></h1>");
        showResult = $("#showResult");
        stats.append("<h1 id='showLife'></h1>");
        showLife = $("#showLife");
        return outer;

    }
    function gameSetup() {
        isGameOver = false;
        setGameBackground();
        setStartButton();
        $(inner).click(function () {
            startGame();
        });
    }
    function setGameBackground() {
        outer.hide();
        outer.css({
            "mix-blend-mode": "difference",
            "background-image": "url('img/marvelvsdc.jpg')",
            "background-size": "cover",
            "background-repeat": "no-repeat",
        });
        outer.fadeIn(1000);
    }
    function setStartButton() {
        inner.hide();
        inner.css({
            "cursor": "pointer",
            "float": "none",
            "margin-left": "auto",
            "margin-right": "auto",
            "height": "170px",
            "width": "170px",
            "background-attachment": "scroll",
            "background-size": "cover",
            "background-repeat": "no-repeat",
            "mix-blend-mode": "normal",
            "opacity": "0"
        });
        if (!isGameOver) {
            inner.css({
                "background-image": "url('img/start.png')",
            });
            inner.fadeIn(1000);
        }
        $(outer).mouseenter(function () {
            var div = $(inner);
            div.stop(true, false);
            div.animate({ opacity: '0.7' }, "slow");
        });
        $(outer).mouseleave(function () {
            var div = $(inner);
            div.stop(true, false);
            div.animate({ opacity: '0' }, "slow");
        });
        $(inner).mouseenter(function () {
            var div = $(this);
            div.stop(true, false);
            div.animate({ opacity: '1' }, "slow");
        });
        $(inner).mouseleave(function () {
            var div = $(this);
            div.stop(true, false);
            div.animate({ opacity: '0.7' });
        });
        if (isGameOver) {
            outer.unbind();
            inner.unbind();
            inner.css({
                "cursor": "auto",
                "background-image": "url('img/gameover.png')",
            });
            inner.fadeIn(100).animate({ opacity: '1' });
            $(outer).mouseenter(function () {
                outer.unbind();
                gameSetup();
            });

        }
    }
    function startGame() {
        outer.unbind();
        inner.unbind();
        stats.unbind();
        resetData();
        showStats();
        togglePosition();
        startTimer();
        $(inner).click(function () {
            stopTimer();
            if (time > 500) {
                time -= 100;
            }
            if (!isDC) {
                result++;
            }
            if (isDC) {
                life--;
            }
            if (life == 0) {
                isGameOver = true;
            }
            if (isGameOver) {
                showStats();
                setGameBackground();
                setStartButton();
            }
            if (!isGameOver) {
                showStats();
                togglePosition();
                startTimer();
            }
        });
    }
    function startTimer() {
        if (!isTimerOn) {
            isTimerOn = true;
            timerOn();
        }
    }
    function stopTimer() {
        clearInterval(timer);
        isTimerOn = false;
    }
    function timerOn() {
        timer = setInterval(togglePosition, time);
    }
    function togglePosition() {
        inner.hide();
        inner.css({
            "cursor": "pointer",
            "float": "none",
            "margin": "none",
            "height": "170px",
            "width": "125px",
            "background-size": "120px auto",
            "background-attachment": "scroll",
            "background-repeat": "no-repeat",
            "mix-blend-mode": "normal",
        });
        changecomic();
        var position = ["left", "center", "right"];
        while (last == random) {
            random = Math.floor((Math.random() * 3));
        }

        position = position[random];

        if (position == "left") {
            inner.css({
                "float": "left",
                "margin-left": "85px"
            });
        }
        if (position == "right") {
            inner.css({
                "float": "right",
                "margin-right": "75px"
            });
        }
        if (position == "center") {
            inner.css({
                "margin-left": "auto",
                "margin-right": "auto"
            });
        }
        inner.show();

        last = random;
    }
    function changecomic() {
        var listImage = ["url('img/captain.png')", "url('img/thor.png')", "url('img/wolverine.png')", "url('img/batman.png')", "url('img/superman.png')", "url('img/wonderwoman.png')"];
        var x = Math.floor((Math.random() * 6));
        if (x == 3 || x == 4 || x == 5) {
            isDC = true;
        }
        else {
            isDC = false;
        }
        inner.css("background-image", listImage[x]);
    }
    function resetData() {
        isGameOver = false;
        isTimerOn = false;
        last = -1;
        random = -1;
        life = 3;
        result = 0;
        time = 2000;
        outer.css({
            "background-image": "url('img/board.jpg')",
            "mix-blend-mode": "normal",
        });
        inner.css({
            "cursor": "auto",
            "background-image": "none",
            "opacity": "1",
        });
    }
    function showStats() {
        stats.css({
            "margin-top": "10px",
            "margin-left": "auto",
            "margin-right": "auto",
            "text-align": "center",
            "width": "200px",
            "padding": "5px",
            "border": "4px black solid",
            "background": "#880015",
            "color": "white",
            "font-size": "18px",
            "mix-blend-mode": "normal",
        });
        showResult.text("Score: " + result);
        showLife.text("Life: " + life);
        showResult.show();
    }

    //  About

    function buildAboutPage() {
        outer.append('<h1>About</h1><br>');
        outer.append('<p>This page is created by Jimmy Waern.</p><br><br>');
        outer.append('<form name="form1" action="http://juhax.com/dotnet/kontakt2/contact.php" method="post"></form>');
        var form = $(".outer form");
        form.append('<hr><br><h1>Contact</h1>');
        form.append('<p class="form">Name:</p>');
        form.append('<input type="text" name="name"></input><br>');
        form.append('<p class="form">E-mail</p>');
        form.append('<input type="text" name="email"></input><br>');
        form.append('<p class="form">Password:</p>');
        form.append('<input type="text" name="password"></input><br>');
        form.append('<br><textarea name="message" cols="110" rows="6" style="width:400px"></textarea><br><hr><br>');
        form.append('<input class="formButton" type="submit" name="skicka" value="Send message">');
        form.append('<input class="formButton" type="reset" name="rensa" value="Clear">');
        $(".form").css({
            "text-align": "left",
            "margin-left": "99px"
        });
        $(".formButton").css({
            "padding": "5px",
            "margin-right": "5px"
        });
        return outer;
    }
});