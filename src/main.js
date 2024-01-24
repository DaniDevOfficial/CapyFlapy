import kaboom from "kaboom"

const FLOOR_HEIGHT = 48;
const CELING_HEIGHT = 48;
const JUMP_FORCE = 400;
const SPEED = 480;

// initialize context
kaboom();

// load assets
loadSprite("bean", "sprites/bean.png");

scene("start", () => {
	add([
		text("Press space to start!"),
		pos(width() / 2, height() / 2),
		anchor("center"),
	]);
	onKeyPress("space", () => go("game"));
});

scene("game", () => {

    // define gravity
    setGravity(1600);

    // add a game object to screen
    const player = add([
        // list of components
        sprite("bean"),
        pos(80, 200),
        area(),
        body(),
    ]);

    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
		"floor"
    ]);
 // ceiling
	add([
        rect(width(), CELING_HEIGHT),
        outline(4),
        pos(0, 0 + CELING_HEIGHT),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
		"ceiling"
    ]);

    function jump() {
            player.jump(JUMP_FORCE);
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);

function spawnStones() {

	// Bottom Stone
	add([
		rect(48, rand(32, 96)),
		area(),
		outline(4),
		pos(width(), height() - FLOOR_HEIGHT),
		anchor("botleft"),
		color(255, 180, 255),
		move(LEFT, SPEED, { dir: vec2(0, 1) }), // Update move function to go downwards
		"tree",
	]);

	// Top Stone
	let heightTop = rand(300, 400);
	add([
		rect(48, heightTop),
		area(),
		outline(4),
		pos(width(), CELING_HEIGHT + heightTop), // Update the position calculation
		anchor("botleft"),
		color(255, 180, 255),
		move(LEFT, SPEED, { dir: vec2(0, -1) }), // Update move function to go downwards
		"tree",
	]);

	wait(1.5, spawnStones);

}

    // start spawning trees
    spawnStones();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });
	player.onCollide("ceiling", () => {
		go("lose", score);
		burp();
		addKaboom(player.pos);
	});


	player.onCollide("floor", () => {
		go("lose", score);
		burp();
		addKaboom(player.pos);
	}
	);
    // keep track of score
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

});

scene("lose", (score) => {

    add([
        sprite("bean"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),
    ]);

    // display score
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});

go("start");