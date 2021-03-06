var canvas;
var context;
//width of the canvas
var WIDTH = 994;
//height of the canvas
var HEIGHT = 560;
var queue;
//score text displayed on the top-left of the screen
var scoreText;
//stage on which everything is displayed
var stage;
//spritesheet of running cat
var catSpriteSheet;
var animation;
//starting x-position of the cat
var enemyXPos = 103.5;
//starting y-position of the cat
var enemyYPos = HEIGHT - 120;
//score of the user
var score = 0; 
var scoreToAdd = 10;
var scoreTimeCount = 0;
var backgroundJungle1;
var backgroundJungle2;
var backgroundJungle3;
var stone1;
var stone2;
var stone3;
//flag to check that cat does not go out of the canvas (along y-axis) 
var flagY = 0;
var stone1Flag1 = false;
var stone2Flag1 = false;
var stone3Flag1 = false;
var stone1Flag2 = false;
var stone2Flag2 = false;
var stone3Flag2 = false;
var checkGameOver1 = false;
var checkGameOver2 = false;
var checkGameOver3 = false;
//to update the score after every 1 second
var gameTimer;
//speed at which stone slides along the ground
var stoneSpeed = 10;

window.onload = function() {
	/*
	*      Set up the Canvas with Size and height
	*
	*/
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	context.canvas.width = WIDTH;
	context.canvas.height = HEIGHT;
	stage = new createjs.Stage("myCanvas");

	/*
	*      Set up the Asset Queue and load sounds
	*
	*/
	queue = new createjs.LoadQueue(false);
	queue.installPlugin(createjs.Sound);
	queue.on("complete", queueLoaded, this);
	createjs.Sound.alternateExtensions = ["ogg"];

	/*
	*      Create a load manifest for all assets
	*
	*/
	queue.loadManifest([
		{id: 'backgroundJungle', src: 'assets/backgroundJungle.png'},
		{id: 'stone1', src: 'assets/stone1.png'},
		{id: 'runningCat', src: 'assets/runningcat.png'},
		{id: 'gameOver', src: 'assets/gameOver.mp3'},
		{id: 'scoreTick', src: 'assets/tick.mp3'},
		{id: 'forestSound', src: 'assets/rainforest.mp3'},
		]);

	queue.load();

	//Update the score after every 1 second
	gameTimer = setInterval(updateScore, 1000);
}

function queueLoaded(event)
{
	// Add bottom background image
	backgroundJungle1 = new createjs.Bitmap(queue.getResult("backgroundJungle"))
	backgroundJungle1.x = 0;
	backgroundJungle1.y = HEIGHT - 74;
	stage.addChild(backgroundJungle1);

	// Add middle background image
	backgroundJungle2 = new createjs.Bitmap(queue.getResult("backgroundJungle"))
	backgroundJungle2.x = 0;
	backgroundJungle2.y = HEIGHT - 250;
	stage.addChild(backgroundJungle2);

	// Add top background image
	backgroundJungle3 = new createjs.Bitmap(queue.getResult("backgroundJungle"))
	backgroundJungle3.x = 0;
	backgroundJungle3.y = HEIGHT - 425;
	stage.addChild(backgroundJungle3);

	//Add Backgorund Sound
	createjs.Sound.play("forestSound", {loop: -1});

	//Add Score
	scoreText = new createjs.Text("Score: " + score.toString(), "bold 36px Arial", "#0095dd");
	scoreText.x = 10;
	scoreText.y = 10;
	stage.addChild(scoreText);

	// Create runningcat spritesheet
	catSpriteSheet = new createjs.SpriteSheet({
	"images": [queue.getResult('runningCat')],
	"frames": {"width": 207, "height": 103.5},
	"animations": { "run": [0,7] }
	});

	// Create cat sprite
	createCat();

	// Add ticker
	createjs.Ticker.setFPS(20);
	createjs.Ticker.addEventListener('tick', stage);
	createjs.Ticker.addEventListener('tick', tickEvent);

	window.onkeydown = keyPressed;
}

function createCat()
{
	animation = new createjs.Sprite(catSpriteSheet, "run");
	animation.regX = 103.5;
	animation.regY = 56.75;
	animation.x = enemyXPos;
	animation.y = enemyYPos;
	animation.gotoAndPlay("run");
	stage.addChildAt(animation, 1);
}

function tickEvent(event) 
{

	backgroundJungle1.x = (backgroundJungle1.x - stoneSpeed) % 994;
	backgroundJungle2.x = (backgroundJungle2.x - stoneSpeed) % 994;
	backgroundJungle3.x = (backgroundJungle3.x - stoneSpeed) % 994;
	
	//create one stone at each level after random time interval
	if(!stone1Flag1 && !stone1Flag2)
	{
		createStone1();
	}
	if(!stone2Flag1 && !stone2Flag2)
	{
		createStone2();
	}
	if(!stone3Flag1 && !stone3Flag2)
	{
		createStone3();
	}

	//move the stone along the ground
	if(stone1Flag2)
	{
		if(stone1.x < 0)
		{
			stone1Flag1 = false;
			stone1Flag2 = false;
			stage.removeChild(stone1);
		}
		else
		{
			stone1.x = stone1.x - 10;
		}
	}
	if(stone2Flag2)
	{
		if(stone2.x < 0)
		{
			stone2Flag1 = false;
			stone2Flag2 = false;
			stage.removeChild(stone2);
		}
		else
		{
			stone2.x = stone2.x - 10;
		}
	}
	if(stone3Flag2)
	{
		if(stone3.x < 0)
		{
			stone3Flag1 = false;
			stone3Flag2 = false;
			stage.removeChild(stone3);
		}
		else
		{
			stone3.x = stone3.x - 10;
		}
	}

	//detect collision between cat and stone
	if(checkGameOver1 && Math.abs(stone1.y - animation.y) < 10)
	{
		if((stone1.x - animation.x < 120 && stone1.x - animation.x > 0) || (animation.x - stone1.x < 40 && animation.x - stone1.x > 0))
		{
			userGameOver();
		}
	}
	else if(checkGameOver2 && Math.abs(stone2.y - animation.y) < 10)
	{
		if((stone2.x - animation.x < 120 && stone2.x - animation.x > 0) || (animation.x - stone2.x < 40 && animation.x - stone2.x > 0))
		{
			userGameOver();
		}
	}
	else if(checkGameOver3 && Math.abs(stone3.y - animation.y) < 10)
	{
		if((stone3.x - animation.x < 120 && stone3.x - animation.x > 0) || (animation.x - stone3.x < 40 && animation.x - stone3.x > 0))
		{
			userGameOver();
		}
	}
}

function keyPressed(event)
{
	if(event.keyCode === 38 && flagY < 2)
	{
		animation.y -= 175;
		flagY++;
		//console.log(animation.y);
	}
	else if(event.keyCode === 40 && flagY > 0)
	{
		animation.y += 175;
		flagY--;
		//console.log(animation.y);
	}
	if(event.keyCode === 37 && animation.x - 103.5 > 0)
	{
		animation.x -= 50;
		//console.log(animation.y);
	}
	else if(event.keyCode === 39 && animation.x + 103.5 < WIDTH)
	{
		animation.x += 50;
		//console.log(animation.y);
	}
}

function createStone1() 
{
	var timeToCreate = Math.floor((Math.random()*8000)+1);
	setTimeout(displayStone1,timeToCreate);
	stone1Flag1 = true;
}

function createStone2() 
{
	var timeToCreate = Math.floor((Math.random()*8000)+1);
	setTimeout(displayStone2,timeToCreate);
	stone2Flag1 = true;
}

function createStone3() 
{
	var timeToCreate = Math.floor((Math.random()*8000)+1);
	setTimeout(displayStone3,timeToCreate);
	stone3Flag1 = true;
}

function displayStone1() {
	// Add stone
	stone1 = new createjs.Bitmap(queue.getResult("stone1"))
	stone1.regX = 48;
	stone1.regY = 48;
	stone1.x = 994;
	stone1.y = HEIGHT - 115;
	stage.addChild(stone1);
	stone1Flag2 = true;
	checkGameOver1 = true;
}

function displayStone2() {
	// Add stone
	stone2 = new createjs.Bitmap(queue.getResult("stone1"))
	stone2.regX = 48;
	stone2.regY = 48;
	stone2.x = 994;
	stone2.y = HEIGHT - 290;
	stage.addChild(stone2);
	stone2Flag2 = true;
	checkGameOver2 = true;
}

function displayStone3() {
	// Add stone
	stone3 = new createjs.Bitmap(queue.getResult("stone1"))
	stone3.regX = 48;
	stone3.regY = 48;
	stone3.x = 994;
	stone3.y = HEIGHT - 465;
	stage.addChild(stone3);
	stone3Flag2 = true;
	checkGameOver3 = true;
}

function updateScore() 
{
	scoreTimeCount++;
	score += scoreToAdd;

	if(scoreTimeCount % 20 === 0)
	{
		scoreToAdd += 10;
		scoreTimeCount = 0;
		stoneSpeed += 10;
	}

	scoreText.text = "Score: " + score;
	createjs.Sound.play("scoreTick");
}

function userGameOver() 
{
	clearInterval(gameTimer);
	createjs.Sound.play("gameOver");
	alert("GAME OVER");
	document.location.reload();
}