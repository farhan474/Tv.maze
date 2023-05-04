"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list")

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
	// ADD: Remove placeholder & make request to TVMaze search shows API.

	let request = await axios.get(`https://api.tvmaze.com/search/shows`, { params: { q: term } })
	return request.data.map((data) => data.show);

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
	$showsList.empty();

	for (let show of shows) {
		const $show = $(
			`<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image.medium}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

		$showsList.append($show);
	}

	$("img").on("error", function () {
		$(this).attr("src", "https://tinyurl.com/tv-missing");
	});

}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
	const term = $("#search-query").val();
	const shows = await getShowsByTerm(term);

	$episodesArea.hide();
	populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
	evt.preventDefault();
	await searchForShowAndDisplay();
});


// Given a show ID, get from API and return (promise) array of episodes:
async function getEpisodesOfShow(id) {

	let request = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
	return request.data.map((data) => ({ Id: data.id, Name: data.name, Season: data.season, Episode: data.number }));

}

function populateEpisodes(episodes) {
	for (let episode of episodes) {
		$("#episodes-list").append($(`<li>Id: ${episode.Id}, Name: ${episode.Name}, Season: ${episode.Season}, Episode: ${episode.Episode} </li>`))
	}
	$episodesArea.show();
}


$showsList.on("click", ".Show-getEpisodes", async function (e) {
	e.preventDefault();
	$episodesList.empty();
	let showId = $(e.target).closest('.Show').data('show-id');
	let episodes = await getEpisodesOfShow(showId);
	populateEpisodes(episodes);

})





