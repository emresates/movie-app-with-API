const KEY = "5ded7030c223177e58220d3b43869c79";
const URL = "https://api.themoviedb.org/3";
const API = URL + "/trending/all/day?api_key=" + KEY;
const GENREAPI = URL + "/discover/movie?api_key=" + KEY;

const imgURL = "https://image.tmdb.org/t/p/w500";
const searchURL = URL + "/search/movie?api_key=" + KEY;

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.querySelector("main");
const form = document.querySelector("form");
const search = document.querySelector("form input");
const genresDOM = document.querySelector(".genres");

const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const now = document.querySelector(".now");
const body = document.querySelector("body");

var currentPage, nextPage, prevPage, totalPages;
var lastUrl = "";

getMovies(API);
function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // If there is no movie in the category we selected
      if (data.results.length !== 0) {
        showMovies(data.results);
        console.log(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        // Page
        now.innerHTML = `${currentPage} 
        <span style="color:red; margin:0px 5px; font-weight:bold;">/</span> 
        ${totalPages}`;

        if (currentPage <= 1) {
          prev.classList.add("disabled");
          next.classList.remove("disabled");
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disabled");
          next.classList.add("disabled");
        } else {
          prev.classList.remove("disabled");
          next.classList.remove("disabled");
        }

        body.scrollIntoView({ behavior: "smooth" });
      } else {
        main.innerHTML = `<h1 class="found">No Results Found :(</h1>`;
      }
    });
}

// Genre section
var genreSelect = [];
setGenres();
function setGenres() {
  genresDOM.innerHTML = "<h2>Categories</h2>";
  genres.forEach((genre) => {
    const genreEach = document.createElement("div");
    genreEach.classList.add("genre");
    genreEach.id = genre.id;
    genreEach.innerText = genre.name;
    genreEach.addEventListener("click", () => {
      if (genreSelect.length == 0) {
        genreSelect.push(genre.id);
      } else {
        if (genreSelect.includes(genre.id)) {
          genreSelect.forEach((id, idx) => {
            if (id == genre.id) {
              genreSelect.splice(idx, 1);
            }
          });
        } else {
          genreSelect.push(genre.id);
        }
      }
      console.log(genreSelect);
      if (genreSelect.length == 0) {
        getMovies(API);
        highlight();
      } else {
        getMovies(
          GENREAPI + "&with_genres=" + encodeURI(genreSelect.join(","))
        );
        highlight();
      }
    });
    genresDOM.append(genreEach);
  });
}

// Highligh Genre
function highlight() {
  document.querySelectorAll(".genre").forEach((genre) => {
    genre.classList.remove("active");
  });

  if (genreSelect.length != 0) {
    genreSelect.forEach((id) => {
      const higlighted = document.getElementById(id);
      higlighted.classList.add("active");
    });
  }
}

// Showing Movies
function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, release_date, poster_path, vote_average, overview } = movie;
    vote = vote_average.toFixed(1); // for remove fraction
    const movieDOM = document.createElement("div");
    movieDOM.classList.add("movie");
    movieDOM.innerHTML = `
        <img src="${
          poster_path
            ? imgURL + poster_path
            : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png"
        } " alt="${title}">

        <div class="info">
            <h3>${release_date ? release_date : ""} </h3>
            <span class="${getColor(vote_average)}"><p>${vote}</p></span>
        </div>

        <div class="overview">
        <h2 style="color:red; text-align:center;">${
          poster_path ? "" : title
        }</h2>
        ${overview}
        </div>
        `;

    main.appendChild(movieDOM);
  });
}

// Vote Color
function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "yellow";
  } else {
    return "red";
  }
}

// Search bar
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  genreSelect = [];
  highlight();
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParam = urlSplit[1].split("&");
  let key = queryParam[queryParam.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let joinA = key.join("=");
    queryParam[queryParam.length - 1] = joinA;
    let joinB = queryParam.join("&");
    let url = urlSplit[0] + "?" + joinB;
    getMovies(url);
  }
}
