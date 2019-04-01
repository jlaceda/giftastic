"use strict";

let topics = ['cat', 'dog', 'rabbit', 'hamster', 'skunk', 'goldfish'];
let gifs = [];

const buttonTemplate = (animal) => `
<button type="button" class="btn btn-primary btn-lg mr-2 mb-2 animalButton">${animal}</button>
`;

const gifTemplate = ({title, rating, still_url, gif_url}) => `
<div style="display: inline-block">
	<p>Rating: ${rating}</p>
	<img class="gif" src="${still_url}" alt="${title}" data-state="still" data-animate="${gif_url}" data-still="${still_url}">
</div>
`;

const animalButtonClickHandler = (event) =>
{
	let animal = $(event.currentTarget).text().trim();
	console.log(animal);
	const queryUrl = 'https://api.giphy.com/v1/gifs/search?api_key=PETvFqyOmcpUHrypnSUhr1F7RHLIjF49&q='+animal+'&limit=10';
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
				});
				
			});
			console.log(dataArray);
			console.log(gifs);
			//gifs = Array.from(new Set(gifs));
			renderGifs(animal);
		}
	});
}

const renderGifs = (animal) =>
{
	let gifsDiv = $("#gifsDiv");
	gifsDiv.empty();
	gifsDiv.html(gifs.filter(gif => gif.animal === animal).map(gifTemplate).join(''));
}

const renderAnimalButtons = () =>
{
	let buttonsDiv = $("#buttonsDiv");
	buttonsDiv.empty();
	buttonsDiv.html(topics.map(buttonTemplate).join(''));
	buttonsDiv.find(".animalButton").click(animalButtonClickHandler);
}

$("#addAnimalButton").click(function()
{
	let animalInput = $("#animalInput");
	let animal = animalInput.val().trim().toLowerCase();
	if (animal.length > 0)
	{
		topics.push(animal);
		renderAnimalButtons();
	}
	animalInput.val('');
});

$(document.body).on('click','.gif',function (event)
{
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

$(document).ready(function(){
	renderAnimalButtons();
});