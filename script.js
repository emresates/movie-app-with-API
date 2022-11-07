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
    const { title, release_date, poster_path, vote_average, overview, id } =
      movie;
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
            <span class="${getColor(vote_average)}"><p>${vote}</p></span>
        </div>

        <div class="overview">
        <h2 style="color:red; text-align:center;">${
          poster_path ? "" : title
        }</h2>
        ${overview}
        <br/>
        <button type="button" class="know-more" id="${id}"><i class="fa-solid fa-arrow-right"></i> Learn More <i class="fa-solid fa-arrow-left"></i></button>
        </div>
        `;

    main.appendChild(movieDOM);

    document.getElementById(id).addEventListener("click", () => {
      openNav(movie.id);
    });
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

// Page Changes
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

// This function was made to display videos that are normally available on youtube
// BUT there were problems with ads while importing youtube videos to the site
// Thousands of error messages started appearing in the console
// I didn't continue it either.

// const overlayDOM = document.querySelector(".overlay .content");
// console.log(overlayDOM);

// function openNav(movie) {
//   let id = movie.id;
//   fetch(URL + "/movie/" + id + "/videos?api_key=" + KEY)
//     .then((res) => res.json())
//     .then((videoData) => {
//       console.log(videoData);

//       if (videoData) {
//         document.getElementById("myNav").style.width = "100%";

//         if (videoData.results.length > 0) {
//           var embed = [];
//           videoData.results.forEach((video) => {
//             let { key, name, site } = video;

//             if (site === "YouTube") {
//               embed.push(`
//               <iframe width="960" height="580" src="https://www.youtube.com/embed/${key}"
//               title="${name}" class="embed" frameborder="0"
//               allow="accelerometer; autoplay;
//               clipboard-write; encrypted-media;
//               gyroscope; picture-in-picture" allowfullscreen></iframe>
//               `);
//             }
//             console.log(site);
//           });
//           overlayDOM.innerHTML = embed.join("");
//           // activeVideo = 0;
//           // showVideos();
//         } else {
//           overlayDOM.innerHTML = `<h1 class="found">No Results Found :(</h1>`;
//         }
//       }
//     });
// }

async function get_movie_trailer(id) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${KEY}`
  );
  const respData = await resp.json();
  // data = respData.results[0].key;
  data = respData.results[0];  
  if (data) {
    return data.key;
  } else {
    return false;
  }
}

const content = document.querySelector(".content");
async function openNav(movieID) {
  const movie_trailer = await get_movie_trailer(movieID);

  fetch(URL + "/movie/" + movieID + "?api_key=" + KEY)
    .then((res) => res.json())
    .then((movieData) => {
      console.log(movieData);
      const {
        poster_path,
        title,
        tagline,
        spoken_languages,
        runtime,
        vote_average,
        budget,
        release_date,
        genres,
        overview,
      } = movieData;
      vote = vote_average.toFixed(1);
      content.innerHTML = `
      <div class="left">
      <div class="poster-img">
          <img src="${
            poster_path
              ? imgURL + poster_path
              : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png"
          } " alt="${title}">
      </div>
      <div class="single-info">
          <span>Add to favorites:</span>
          <span class="heart">&#9829;</span>
      </div>
      </div>
      <div class="right">
      <h1>${title}</h1>
      <h3>${tagline}</h3>
      <div class="container">
          <div class="info">
              <span>Language:</span>
              <span>${spoken_languages[0].name}</span>
          </div>
          <div class="info">
              <span>Length:</span>
              <span>${runtime} minutes</span>
          </div>
          <div class="info">
              <span>Rate:</span>
              <span>${vote} / 10</span>
          </div>
          <div class="info">
              <span>Budget:</span>
              <span>$ ${budget}</span>
          </div>
          <div class="info">
              <span>Release Date:</span>
              <span>${release_date}</span>
          </div>
      </div>
      <div class="genre-movie">
          <h2>Genres</h2>
          <ul>
          ${genres.map((e) => `<li>${e.name}</li>`).join("")}
          </ul>
      </div>
      <div class="overview-inner">
          <h2>Overview</h2>
          <p>${overview}</p>
      </div>
      <div class="trailer">
          <h2>Trailer</h2>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" 
          title="ERR_BLOCKED_BY_CLIENT Hatası Nasıl Düzeltilir"
           frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
           encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      </div>
    
      `;
    });
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  content.innerHTML = "";
}
