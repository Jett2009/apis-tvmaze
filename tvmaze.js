/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const missingURL = "https://tinyurl.com/tv-missing";
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);

	let shows = res.data.map((res) => {
		let show = res.show;
		return {
			// used json viewer to extract img src https://api.tvmaze.com/search/shows?q=teen
			image: show.image ? show.image.medium : missingURL,
			id: show.id,
			name: show.name,
			summary: show.summary,
		};
	});

	return shows;
	/*   return [
    {
      id: 1767,
      name: "The Bletchley Circle",
      summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
      image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
    }
  ] */
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $("#shows-list");
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src="${show.image}">
             <button class="btn btn-primary get-episodes">Episodes List</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
	evt.preventDefault();

	let query = $("#search-query").val();
	if (!query) return;

	$("#episodes-area").hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above

	let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

	let episodes = res.data.map((episode) => ({
		id: episode.id,
		name: episode.name,
		season: episode.season,
		number: episode.number,
	}));

	return episodes;
}
//populates extra line item - ERROR
function populateEpisodes(episodes) {
	const $episodeList = $("#episodes-list");
	$episodeList.empty();

	for (let episode of episodes) {
		let $episode = $(
			`<li>
      ${episode.name}
      (episode ${episode.number})
      <li>
      `
		);
		$episodeList.append($episode);
	}
	$("#episodes-area").show();
}
// needed solution
$("#shows-list").on(
	"click",
	".get-episodes",
	async function handleEpisodeClick(evt) {
		let showId = $(evt.target).closest(".Show").data("show-id");
		let episodes = await getEpisodes(showId);
		populateEpisodes(episodes);
	}
);
