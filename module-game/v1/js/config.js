// General
const GAME_WRAPPER = '#wrapper';
const GAME_AREA = '#container'; // Tên của game area
const GAME_AREA_OFFSET = $(GAME_AREA).offset(); // Vị trí của game area so với body
const GAME_AREA_WIDTH = $(GAME_AREA).outerWidth();
const GAME_AREA_HEIGHT = $(GAME_AREA).outerHeight();
const FPS = 60; // Tốc độ update the display
const GAME_DELAY = 2; // Thời gian chờ để start game
const STANDARD_ERROR = 5;
// Control
const BTN_VOLUME = "#btn-volume";
const BTN_PAUSE = "#btn-pause";
const BTN_SIZE_UP = "#btn-sizeUp";
const BTN_SIZE_DOWN = "#btn-sizeDown";
// Cloud
const CLOUD_QUANTITY = 15; // Số lượng hình đám mây hiện có
const CLOUD_WIDTH = 80; // Độ rộng của một đám mây
const CLOUD_HEIGHT = 44; // Độ cao của một đám mây
const CLOUD_INIT = 8; // Số đám mây được tạo khi start game
const CLOUD_TIME_CREATED = 3; // Thời gian một đám mây được tạo ra (second)
const CLOUD_SPEED = 1; // Tốc độ di chuyển của đám mây
// Bird
const BIRD_QUANTITY = 4; // Số lượng hình chim hiện có
const BIRD_WIDTH = 50;
const BIRD_HEIGHT = 35;
const BIRD_INIT = 4;
const BIRD_TIME_CREATED = 4;
const BIRD_SPEED = 1
// Parachute
const PARACHUTE_WIDTH = 30;
const PARACHUTE_HEIGHT = 39;
const PARACHUTE_INIT = 1;
const PARACHUTE_TIME_CREATED = 8;
const PARACHUTE_SPEED = 1;
const PARACHUTE_DELAY = 2; // Thời gian chờ để bình xăng bắt đầu rơi lúc start game (second)
// Star
const STAR_WIDTH = 35;
const STAR_HEIGHT = 35;
const STAR_INIT = 2;
const STAR_TIME_CREATED = 5;
const STAR_SPEED = 1;
const STAR_DELAY = 0; // Thời gian chờ để ngôi sao bắt đầu rơi lúc start game (second)
// Airplane
const AIRPLANE_WIDTH = 140;
const AIRPLANE_HEIGHT = 66;
const AIRPLANE_SPEED = 10;
const AIRPLANE_LOCATION_REFRESH = 20; // Khoảng thời gian cập nhật lại ví trí (millisecond)
// Fuel Counter
const FUEL_COUNTER = '#fuel-counter'; // Vị trí fuel counter
const FUEL_COUNTER_QUANTITY = 11; // Số ảnh fuel counter
const FUEL_COUNTER_INIT = 10; // Số fuel mặc định khi game start
// const FUEL_COUNTER_REFRESH = 10; // Thời gian cập nhật lại fuel counter (millisecond)
const FUEL_COUNTER_TIME_CHANGED = 1; //Thời gian để giảm fuel (second)
const FUEL_COUNTER_REDUCE = 1; // Số fuel giảm trong mỗi giây
// Star Counter
const STAR_COUNTER = '#star-counter';
// Timer
const TIMER = '#timer';

