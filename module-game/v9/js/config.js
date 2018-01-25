// GENERAL
const FPS = 1000 / 60;
const DIRECTION_VERTICAL = 0;
const DIRECTION_HORIZONTAL = 1;
const STANDARD_ERROR = 5;

// GAME AREA
const GAME_AREA = $('#game-area');
const GAME_AREA_WIDTH = GAME_AREA.width();
const GAME_AREA_HEIGHT = GAME_AREA.height();

// BUTTON
const BTN_SIZE_UP = $('#btn-size-up');
const BTN_SIZE_DOWN = $('#btn-size-down');
const BTN_MUTE = $('#btn-mute');
const BTN_PAUSE = $('#btn-pause');

// STATISTIC
const TIMER = $('#timer');
const STAR_COUNTER = $('#star-counter');
const FUEL_NUMBER = $('#fuel-number');
const FUEL_GAUGE = $('#fuel-gauge');
const FUEL_INIT = 10;
const FUEL_REDUCE = 1;
const FUEL_ADD = 10;

// AIRPLANE
const AIRPLANE = $('#airplane');
const AIRPLANE_WIDTH = AIRPLANE.width();
const AIRPLANE_HEIGHT = AIRPLANE.height();
const AIRPLANE_SPEED = 10;
const AIRPLANE_LOCATION_REFRESH = 20;

// CLOUD
const CLOUD_INIT = 8;
const CLOUD_QTY = 4;
const CLOUD_SPEED = 1;
const CLOUD_TIME_CREATE = 3000;

// BIRD
const BIRD_INIT = 4;
const BIRD_QTY = 2;
const BIRD_SPEED = 1;
const BIRD_TIME_CREATE = 4000;

// STAR
const STAR_INIT = 2;
const STAR_SPEED = 1;
const STAR_TIME_CREATE = 4000;

// PARACHUTE
const PARACHUTE_INIT = 1;
const PARACHUTE_SPEED = 1;
const PARACHUTE_TIME_CREATE = 8000;