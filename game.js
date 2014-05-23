var canvas, context, toggle;
var width = 1000;
var height = 1000;
var gridsize = 10;
var guardsize = 4;
var rosesize = 10;
var totalMoves = 40;


init();
animate();

var player, king, belt, grid, guards, roses, roseCounter, moveCounter, playerInvisible, gameRunning;

function init() {

    canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext( '2d' );

    document.getElementById('game').appendChild( canvas );

    grid = createGrid();
    player = createPlayer();
    king = createKing();
    belt = createBelt();
    guards = createGuards();
    roses = createRoses();

    window.addEventListener('keydown', handleKeyboard, false);

    document.getElementById('totalMoves').innerHTML = totalMoves;
    roseCounter = document.getElementById('rosesCount');
    moveCounter = document.getElementById('movesCount');
    playerInvisible = document.getElementById('invisible');
    roseCounter.innerHTML = player.roses;
    moveCounter.innerHTML = player.moves;
    playerInvisible.innerHTML = player.isInvisible;
    gameRunning = true;
}


function handleKeyboard() {
	switch( event.keyCode ) {
    case 37:
    case 65:
    	player.moveTo(player.tile.left);
       //LEFT
       break;
    case 38:
    case 87:
    	player.moveTo(player.tile.top);
       //UP
       break;
    case 39:
    case 68:
    	player.moveTo(player.tile.right);
       //RIGHT
       break;
    case 40:
    case 83:
    	player.moveTo(player.tile.bottom);
       //DOWN
       break;
   }
	event.cancelBubble= true;
	return false;
}

function initialPlaceOnGrid(item ) {
	var row = Math.floor(Math.random() * gridsize);
	var column = Math.floor(Math.random() * gridsize);
	if (grid[row][column].content)
	{
		initialPlaceOnGrid(item);
	}
	else
	{
		grid[row][column].content = item;
		item.x = grid[row][column].x;
		item.y = grid[row][column].y;
		item.tile=grid[row][column];
	}
}

function initBascis(item, skipPlacement) {
	if(typeof(skipPlacement)==='undefined') skipPlacement = false;
	item.facing = Math.floor(Math.random() * 4);
	item.x = 0;
	item.y = 0;
	item.shouldRedraw = true;
	item.pickup = false;
	item.draw = function() {
		context.fillStyle = this.debugcolor;
		context.fillRect(this.x,this.y, (width/gridsize),(height/gridsize));
		this.shouldRedraw = false;
	};
	if (!skipPlacement) {
		initialPlaceOnGrid(item);
	}
}

function createGrid() {
	var localGrid=[];
	for (var row = 0; row<gridsize; row++) {
		localGrid[row]=[];
		for (var column = 0; column<gridsize; column++) {
			localGrid[row][column]=createTile(row, column);
		}
	}
	for (var row = 0; row<gridsize; row++) {
		for (var column = 0; column<gridsize; column++) {
			var t = localGrid[row][column];
			if (row>0)
			{
				t.top = localGrid[row-1][column];
				t.top.bottom = t;
			}
			if (column>0)
			{
				t.left = localGrid[row][column-1];
				t.left.right = t;
			}
		}
	}
	return localGrid;
}

function createTile(row, column) {
	var t = {
		sprite: 'tile.png',
		content: false,
		debugcolor : '#ff0000',
		row: row,
		colum: column,
		top: false,
		right: false,
		bottom: false,
		left: false
	};

	initBascis(t, true) 

	t.x= (width/gridsize)*column;
	t.y= (height/gridsize)*row;
	t.draw= function() {
			context.fillStyle = this.debugcolor;
			context.fillRect(this.x,this.y, (width/gridsize),(height/gridsize));
			context.strokeStyle = "#333333";
			context.strokeRect(this.x,this.y, (width/gridsize),(height/gridsize));
			this.shouldRedraw = false;
		}

	return t;
}

function createPlayer() {
	var p = {
		love: true,
		money: false,
		sprite: 'player.png',
		debugcolor: '#00ff00',
		roses: 0,
		moves: 0,
		isInvisible: false,
		invisibilitycounter: 0,
		moveTo: function(nextTile) {
			if (gameRunning && nextTile && (!nextTile.content || nextTile.content.pickup)) {
				if (nextTile.content.rose)
				{
					 this.roses++;
				}
				if (nextTile.content.belt)
				{
					this.isInvisible = true;
					this.invisibilitycounter = nextTile.content.duration;
					this.debugcolor = 'rgba(0,255,0,0.5)';
				}
				this.tile.shouldRedraw = true;
				this.tile.content = false;
				nextTile.content = this;
				this.tile = nextTile;
				this.x = nextTile.x;
				this.y = nextTile.y;
				this.shouldRedraw = true;
				this.tile.shouldRedraw = true;
				this.moves++;
				if (this.isInvisible)
				{
					this.invisibilitycounter--;
					if (this.invisibilitycounter==0) {
						this.isInvisible = false;
						this.debugcolor = '#00ff00';
					}
				}
			    roseCounter.innerHTML = this.roses;
			    moveCounter.innerHTML = this.moves;
    			playerInvisible.innerHTML = this.isInvisible;
    			if (this.moves>totalMoves) {
    				document.getElementById('gameOverScreen').style.display = "block";
    				gameRunning = false;
    			}
			}
		}
	};
	initBascis(p);
	return p;
}

function createKing() {
	var k = {
		sprite: 'king.png',
		debugcolor: '#0000ff'
	};
	initBascis(k);
	return k;
}

function createGuards() {
	var localGuards=[];
	for (var i = 0; i<guardsize; i++) {
		localGuards[i]=createGuard();
	}
	return localGuards;
}

function createGuard() {
	var g = {
		sprite: 'guard.png',
		debugcolor: '#00ffff'
	};
	initBascis(g);
	return g;
}

function createRoses() {
	var localRoses=[];
	for (var i = 0; i<rosesize; i++) {
		localRoses[i]=createRose();
	}
	return localRoses;
}

function createRose() {
	var r = {
		sprite: 'rose.png',
		debugcolor: '#ffff00'
	};
	initBascis(r);
	r.pickup = true;
	r.rose = true;
	return r;
}

function createBelt() {
	var b = {
		sprite: 'belt.png',
		debugcolor: 'rgba(255,0,255,0.5)',
		belt: true,
		duration: 10
	};
	initBascis(b);
	b.pickup = true;
	return b;
}

function animate(time) {
    requestAnimationFrame( animate );
    drawGrid();
    //console.log(time);

}

function drawGrid() {

    /*var time = new Date().getTime() * 0.002;
    var x = Math.sin( time ) * 192 + 256;
    var y = Math.cos( time * 0.9 ) * 192 + 256;
    toggle = !toggle;

    context.fillStyle = toggle ? 'rgb(200,200,20)' :  'rgb(20,20,200)';
    context.beginPath();
    context.arc( x, y, 10, 0, Math.PI * 2, true );
    context.closePath();
    context.fill();*/

    for (var row = 0; row<gridsize; row++) {
		for (var column = 0; column<gridsize; column++) {
			if (grid[row][column].shouldRedraw) {
				grid[row][column].draw();
			}
		}
	}

	if (player.shouldRedraw) {
		player.draw();
	}

	if (king.shouldRedraw) {
		king.draw();
	}

	if (belt.shouldRedraw) {
		belt.draw();
	}

    for (var i = 0; i<rosesize; i++) {
    	if (roses[i].shouldRedraw) {
			roses[i].draw();
		}
	}

    for (var i = 0; i<guardsize; i++) {
    	if (guards[i].shouldRedraw) {
			guards[i].draw();
		}
	}

}
