import axios from "axios";
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const BASE_URL = "https://api.tvmaze.com";
const DEFAULT_IMG = "http://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image: string;
};

async function getShowsByTerm(term: string): Promise<ShowInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const resp = await axios.get(`${BASE_URL}/search/shows`, {
    params: {
      q: term
    }
  });
  console.log('resp', resp);

  const shows: ShowInterface[] = [];

  resp.data.map(item => {
    shows.push({
      id: item.show.id,
      name: item.show.name,
      summary: item.show.summary,
      image: item.show.image?.medium || DEFAULT_IMG,
    })

  })

  console.log(shows);
  return shows;

}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]) :void {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
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
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {
  const term: string = $("#searchForm-term").val().toString();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  console.log("We are about to populate");
  populateShows(shows);
}

$searchForm.on("submit", async function (evt): Promise<void> {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
interface EpisodeInterface {
  id: number;
  name: string;
  season: number;
  number: number;
}

async function getEpisodesOfShow(id: number) : Promise<EpisodeInterface[]> {
  const resp = await axios.get(`${BASE_URL}/shows/${id}/episodes`);
  
  const episodes = resp.data.map(item => {
    return {
      id: item.id,
      name: item.name,
      season: item.season,
      number: item.number,
    }
  });
  return episodes;
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
// $episodesAre