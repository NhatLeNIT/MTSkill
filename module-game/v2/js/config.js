// GAME AREA
const GAME_AREA = $('#game-area');
const GAME_AREA_WIDTH = GAME_AREA.width();
const GAME_AREA_HEIGHT = GAME_AREA.height();
const GAME_AREA_LEFT = GAME_AREA.offset().left;
const GAME_AREA_TOP = GAME_AREA.offset().top;

// GENERAL
const FPS = 60;
// const GAME_DELAY = 2;
const STANDARD_ERROR = 5;

// CONTROL
const BTN_SIZE_UP = $('#btn-size-up');
const BTN_SIZE_DOWN = $('#btn-size-down');
const BTN_MUTE = $('#btn-mute');
const BTN_PAUSE = $('#btn-pause');

// STATISTIC
const TIMER = $('#timer');
const STAR_COUNTER = $('#star-counter');
const FUEL_COUNTER_NUMBER = $('#fuel-number');
const FUEL_COUNTER_GAUGE = $('#fuel-kim');
const FUEL_COUNTER_INIT = 10;
const FUEL_COUNTER_REDUCE = 1;
const FUEL_COUNTER_TIME_CHANGED = 1000;
const FUEL_ADD = 10;

// AIRPLANE
const AIRPLANE = $('#airplane');
const AIRPLANE_WIDTH = AIRPLANE.width();
const AIRPLANE_HEIGHT = AIRPLANE.height();
const AIRPLANE_SPEED = 10;
const AIRPLANE_LOCATION_REFRESH = 20;

// CLOUD
const CLOUD_WIDTH = 100;
const CLOUD_HEIGHT = 55;
const CLOUD_QUANTITY = 10;
const CLOUD_INIT = 8;
const CLOUD_TIME_CREATED = 3000;
const CLOUD_SPEED = 1;

// STAR
const STAR_WIDTH = 35;
const STAR_HEIGHT = 34;
const STAR_INIT = 2;
const STAR_TIME_CREATED = 3000;
const STAR_SPEED = 1;

// PARACHUTE
const PARACHUTE_WIDTH = 28;
const PARACHUTE_HEIGHT = 36;
const PARACHUTE_INIT = 1;
const PARACHUTE_TIME_CREATED = 8000;
const PARACHUTE_SPEED = 1;

// BIRD
const BIRD_WIDTH = 52;
const BIRD_HEIGHT = 35;
const BIRD_QUANTITY = 4;
const BIRD_INIT = 4;
const BIRD_TIME_CREATED = 4000;
const BIRD_SPEED = 1;