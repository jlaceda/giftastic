"use strict";

let topics = ['cat', 'dog', 'bunny', 'hamster', 'skunk', 'goldfish'];
let gifs = [];

const buttonTemplate = (animal) => `
<button type="button" class="btn btn-primary btn-lg mr-2 mb-2 animalButton">${animal}</button>
`;

const gifTemplate = ({title, rating, still_url, gif_url, import_datetime}) => `
<div style="display: inline-block" class="m-1 border border-primary rounded">
	<h6 class="px-1">${title}</h6>
	<img class="gif" src="${still_url}" alt="${title}" data-state="still" data-animate="${gif_url}" data-still="${still_url}">
	<p class="px-1"><small>Rating: ${rating}</small></p>
	<p class="px-1"><small>Imported: ${import_datetime}</small></p>
</div>
`;

const renderAnimalButtons = () =>
{
	let buttonsDiv = $("#buttonsDiv");
	buttonsDiv.empty();
	buttonsDiv.html(topics.map(buttonTemplate).join(''));
	buttonsDiv.find(".animalButton").click(animalButtonClickHandler);
}

const renderGifs = animal =>
{
	let gifsDiv = $("#gifsDiv");
	gifsDiv.empty();
	gifsDiv.html(gifs
		.filter(gif => gif.animal === animal)
		.reverse()
		.map(gifTemplate)
		.join(''));
}

const animalButtonClickHandler = (event) =>
{
	let animal = $(event.currentTarget).text().trim();
	let queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=PETvFqyOmcpUHrypnSUhr1F7RHLIjF49&limit=10&q=' + animal;
	// make arrays of animals and counts;
	let animalArray = [];
	let countArray = [];
	// TODO: use array reduce for this maybe?
	for (let i = 0; i < gifs.length; i++)
	{
		const gifAnimal = gifs[i].animal;
		// if this animal is NOT already in animalArray, add it with count 1
		const gifAnimalIndex = animalArray.indexOf(gifAnimal);
		if (gifAnimalIndex === -1)
		{
			animalArray.push(gifAnimal);
			countArray.push(1);
		}
		// if not, add 1 to count.
		else
		{
			countArray[gifAnimalIndex] += 1;
		}
	}
	// if there's already gifs of this animal
	// add an offset to the request
	const animalIndex = animalArray.indexOf(animal);
	if (animalIndex !== -1)
	{
		let offset = countArray[animalIndex];
		queryUrl += '&offset=' + offset;
	}
	$.ajax({
		url: queryUrl,
		method: "GET"
	}).done(function(response){
		if (response.meta.status === 200)
		{
			let dataArray = response.data;
			dataArray.forEach(gif => 
			{
				gifs.push({
					animal: animal,
					rating: gif.rating,
					title: gif.title,
					still_url: gif.images.fixed_height_still.url,
					gif_url: gif.images.fixed_height.url,
					import_datetime: gif.import_datetime,
				});
				
			});
			renderGifs(animal);
		}
	});
}

$("#addAnimalButton").click((event) =>
{
	event.preventDefault();
	let animalInput = $("#animalInput");
	let animal = animalInput.val().trim().toLowerCase();
	if (animal.length > 0)
	{
		topics.push(animal);
		renderAnimalButtons();
	}
	// clear input
	animalInput.val('');
});

// on click event handler for the gif image
$(document.body).on('click', '.gif', () =>
{
	// 'this' is the gif image
	let img = $(this);
	let state = img.attr("data-state");
	let animateUrl = img.attr("data-animate");
	let stillUrl = img.attr("data-still");
	if (state === "still")
	{
		img.attr("src", animateUrl);
		img.attr("data-state", "animate");
	}
	if (state === "animate")
	{
		img.attr("src", stillUrl);
		img.attr("data-state", "still");
	}
})

// render buttons on document ready
$(renderAnimalButtons());