'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');

var mock = require('mockjs');

var _require = require("./config"),
    port = _require.port,
    socket_io_options = _require.socket_io_options,
    jwt_secret = _require.jwt_secret,
    mongodb_uri = _require.mongodb_uri;

var io = require("socket.io")(port, socket_io_options);

var Redis = require("ioredis");

var _require2 = require('uuid'),
    uuid = _require2.v4;

var redis = new Redis({
  db: 1
});
mongoose.connect(mongodb_uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});
var userSchema = mongoose.Schema({
  nickname: String,
  avatar: String,
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    hide: true
  },
  isTourist: Boolean
});
var UserModel = mongoose.model('User', userSchema);
/**
 * 解码jwt token里面的数据
 * @param {string} token 
 * @returns 
 */

function jwt_decode(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, jwt_secret);
  } catch (_unused) {
    return null;
  }
}
/**
 * 根据游戏类型获取游戏初始化信息
 * @param {string} gameType 
 * @returns 
 */


function get_game_info(gameType) {
  var gameInfoMap = {
    s4p2: {
      type: 's4p2',
      name: '方格2人战',
      playersNum: 2,
      boardGrids: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    },
    s4p4: {
      type: 's4p4',
      name: '方格4人战',
      playersNum: 4,
      boardGrids: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    },
    s4p8: {
      type: 's4p8',
      name: '方格8人战',
      playersNum: 8
    }
  };
  return gameInfoMap[gameType];
}

;

function get_custom_game_info(gameType) {
  var customGameInfoMap = {
    s4g9: {
      type: 's4g9',
      name: '自定义方格9x9',
      boardGrids: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    },
    s4g15: {
      type: 's4g15',
      name: '自定义方格15x15',
      boardGrids: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    },
    s4g21: {
      type: 's4g21',
      name: '自定义方格21x21',
      boardGrids: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    }
  };
  return customGameInfoMap[gameType];
}
/**
 * 统一处理登录成功之后的逻辑
 * @param {*} socket 
 * @param {*} user 
 */


function login_sucess(socket, user) {
  var token;
  return regeneratorRuntime.async(function login_sucess$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = jwt.sign({
            userId: user._id
          }, jwt_secret); // 生成一个新的token

          _context.next = 3;
          return regeneratorRuntime.awrap(socket.emit('login success', {
            token: token,
            account: user
          }));

        case 3:
          socket.join(user._id.toString()); // 假如用户ID同名的room

          socket.data.userId = user._id.toString(); // 更新socket data

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}
/**
 * 查询房间内玩家状态
 * @returns 
 */


function get_players_status(gameRoomId) {
  var playersOnlineMap, currentStepMap;
  return regeneratorRuntime.async(function get_players_status$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(redis.hgetall("game_room:".concat(gameRoomId, ":players")));

        case 2:
          playersOnlineMap = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(redis.hgetall("game_room:".concat(gameRoomId, ":currentStep")));

        case 5:
          currentStepMap = _context2.sent;
          return _context2.abrupt("return", Object.keys(playersOnlineMap).reduce(function (result, playerId) {
            result[playerId] = {
              move: !!currentStepMap[playerId],
              online: !!playersOnlineMap[playerId]
            };
            return result;
          }, {}));

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}
/**
 * 查询当前局面状态
 * @param {*} gameRoomId 
 * @returns 
 */


function get_board(gameRoomId) {
  var boardGrids, currentStepNum;
  return regeneratorRuntime.async(function get_board$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.t0 = JSON;
          _context3.next = 3;
          return regeneratorRuntime.awrap(redis.get("game_room:".concat(gameRoomId, ":boardGrids")));

        case 3:
          _context3.t1 = _context3.sent;
          boardGrids = _context3.t0.parse.call(_context3.t0, _context3.t1);
          _context3.t2 = Number;
          _context3.next = 8;
          return regeneratorRuntime.awrap(redis.get("game_room:".concat(gameRoomId, ":currentStepNum")));

        case 8:
          _context3.t3 = _context3.sent;
          currentStepNum = (0, _context3.t2)(_context3.t3);
          return _context3.abrupt("return", {
            boardGrids: boardGrids,
            currentStepNum: currentStepNum
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
}
/**
 * 连结时检查是否已经登录
 * @param {*} socket 
 */


function checkLogin(socket) {
  var jwtData, user;
  return regeneratorRuntime.async(function checkLogin$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          jwtData = jwt_decode(socket.handshake.auth.token);

          if (!(!jwtData || !jwtData.userId)) {
            _context4.next = 5;
            break;
          }

          socket.emit('need login');
          _context4.next = 15;
          break;

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(UserModel.findById(jwtData.userId).select('avatar nickname'));

        case 7:
          user = _context4.sent;

          if (user) {
            _context4.next = 13;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(socket.emit('need login'));

        case 11:
          _context4.next = 15;
          break;

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(login_sucess(socket, user));

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
}
/**
 * 登录 TODO:
 * @param {*} socket 
 * @param {*} param1 
 */


function handleLogin(socket, _ref) {
  var email, password;
  return regeneratorRuntime.async(function handleLogin$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          email = _ref.email, password = _ref.password;
          console.log(email, password);

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
}
/**
 * 游客登录
 * 模拟一个用户，使用这个模拟的用户信息登录
 * @param {*} socket 
 */


function handleLoginAsTourist(socket) {
  var nickname, avatar, user;
  return regeneratorRuntime.async(function handleLoginAsTourist$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          nickname = mock.Random.cname();
          avatar = "/random/w,120,h,120,b,".concat(mock.Random.color().slice(1), ",f,000000,t,").concat(nickname);
          _context6.next = 4;
          return regeneratorRuntime.awrap(UserModel.create({
            nickname: nickname,
            avatar: avatar,
            email: mock.Random.email(),
            isTourist: true
          }));

        case 4:
          user = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(login_sucess(socket, user));

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
}
/**
 * 退出
 * @param {*} socket 
 */


function handleLogout(socket) {
  return regeneratorRuntime.async(function handleLogout$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          socket.data.userId = undefined;
          _context7.next = 3;
          return regeneratorRuntime.awrap(socket.emit('need login'));

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
}
/**
 * 断开连接后的逻辑
 * @param {*} socket 
 */


function handleDisconect(socket) {
  return regeneratorRuntime.async(function handleDisconect$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
        case "end":
          return _context8.stop();
      }
    }
  });
}
/**
 * 自定义游戏
 * @param {*} socket 
 * @param {*} param1 
 */


function handleCustomGame(socket, _ref2) {
  var gameType, _get_custom_game_info, boardGrids, userId, gameRoomId;

  return regeneratorRuntime.async(function handleCustomGame$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          gameType = _ref2.gameType;
          _get_custom_game_info = get_custom_game_info(gameType), boardGrids = _get_custom_game_info.boardGrids;
          userId = socket.data.userId;
          gameRoomId = uuid();
          _context9.next = 6;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":gameType"), gameType));

        case 6:
          _context9.next = 8;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":boardGrids"), JSON.stringify(boardGrids)));

        case 8:
          _context9.next = 10;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":currentStepNum"), 0));

        case 10:
          _context9.next = 12;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":customGameMaster"), userId));

        case 12:
          _context9.next = 14;
          return regeneratorRuntime.awrap(redis.hmset("game_room:".concat(gameRoomId, ":players"), userId, ''));

        case 14:
          _context9.next = 16;
          return regeneratorRuntime.awrap(socket.emit('custom game success', {
            gameRoomId: gameRoomId
          }));

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  });
}
/**
 * 自定义游戏信息
 * 邀请的玩家，根据自定义游戏的信息进入游戏
 * @param {*} socket 
 * @param {*} param1 
 */


function handleCustomGameBaseInfo(socket, _ref3) {
  var gameRoomId, gameType, currentStepNum, canJoin;
  return regeneratorRuntime.async(function handleCustomGameBaseInfo$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          gameRoomId = _ref3.gameRoomId;
          _context10.next = 3;
          return regeneratorRuntime.awrap(redis.get("game_room:".concat(gameRoomId, ":gameType")));

        case 3:
          gameType = _context10.sent;
          _context10.next = 6;
          return regeneratorRuntime.awrap(redis.get("game_room:".concat(gameRoomId, ":currentStepNum")));

        case 6:
          currentStepNum = _context10.sent;
          canJoin = Number(currentStepNum) === 0;
          _context10.next = 10;
          return regeneratorRuntime.awrap(socket.emit('custom game base info success', {
            gameRoomId: gameRoomId,
            gameType: gameType,
            canJoin: canJoin
          }));

        case 10:
        case "end":
          return _context10.stop();
      }
    }
  });
}

function handleCustomGameStart(socket, _ref4) {
  var gameRoomId, _ref5, currentStepNum, boardGrids;

  return regeneratorRuntime.async(function handleCustomGameStart$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          gameRoomId = _ref4.gameRoomId;
          _context11.next = 3;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":currentStepNum"), 1));

        case 3:
          _context11.next = 5;
          return regeneratorRuntime.awrap(get_board(gameRoomId));

        case 5:
          _ref5 = _context11.sent;
          currentStepNum = _ref5.currentStepNum;
          boardGrids = _ref5.boardGrids;
          _context11.next = 10;
          return regeneratorRuntime.awrap(socket.emit('sync board', {
            currentStepNum: currentStepNum,
            boardGrids: boardGrids
          }));

        case 10:
        case "end":
          return _context11.stop();
      }
    }
  });
}
/**
 * 玩家请求匹配游戏
 * 插入一个队列，如果人数凑够，就开始游戏
 * @param {*} socket 
 * @param {*} param1 
 */


function handleMatchGame(socket, _ref6) {
  var gameType, _get_game_info, playersNum, boardGrids, userId, matchingUsers, cursor, matched, queue, playersHsetArgs, gameRoomId;

  return regeneratorRuntime.async(function handleMatchGame$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          gameType = _ref6.gameType;
          _get_game_info = get_game_info(gameType), playersNum = _get_game_info.playersNum, boardGrids = _get_game_info.boardGrids;
          userId = socket.data.userId;
          matchingUsers = [userId];
          cursor = 0;
          matched = true;

        case 6:
          if (!matched) {
            _context12.next = 19;
            break;
          }

          _context12.next = 9;
          return regeneratorRuntime.awrap(redis.zscan("game_matching_queue:".concat(gameType), 0));

        case 9:
          queue = _context12.sent;
          cursor = Number(queue[0]);
          matchingUsers = queue[1].reduce(function (result, item, index) {
            if (index % 2 === 0) {
              result.push(item);
            }

            return result;
          }, matchingUsers);

          if (!(matchingUsers.length >= playersNum)) {
            _context12.next = 16;
            break;
          }

          _context12.next = 15;
          return regeneratorRuntime.awrap(redis.zrem.apply(redis, ["game_matching_queue:".concat(gameType)].concat(_toConsumableArray(matchingUsers.slice(0, playersNum)))));

        case 15:
          return _context12.abrupt("break", 19);

        case 16:
          if (cursor === 0 && matchingUsers.length < playersNum) {
            matched = false;
          }

          _context12.next = 6;
          break;

        case 19:
          if (!matched) {
            _context12.next = 36;
            break;
          }

          // 匹配成功
          playersHsetArgs = matchingUsers.reduce(function (result, item) {
            result.push(item, '');
            return result;
          }, []);
          gameRoomId = uuid();
          _context12.next = 24;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":gameType"), gameType));

        case 24:
          _context12.next = 26;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":boardGrids"), JSON.stringify(boardGrids)));

        case 26:
          _context12.next = 28;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":currentStepNum"), 1));

        case 28:
          _context12.next = 30;
          return regeneratorRuntime.awrap(redis.hmset.apply(redis, ["game_room:".concat(gameRoomId, ":players")].concat(_toConsumableArray(playersHsetArgs))));

        case 30:
          _context12.next = 32;
          return regeneratorRuntime.awrap(io.to(matchingUsers).emit('match game success', {
            gameRoomId: gameRoomId
          }));

        case 32:
          socket.data.gameStatus = undefined;
          socket.data.gameType = undefined;
          _context12.next = 40;
          break;

        case 36:
          _context12.next = 38;
          return regeneratorRuntime.awrap(redis.zadd("game_matching_queue:".concat(gameType), new Date().getTime(), userId));

        case 38:
          socket.data.gameStatus = 'matching';
          socket.data.gameType = gameType;

        case 40:
        case "end":
          return _context12.stop();
      }
    }
  });
}
/**
 * 当匹配游戏的时候断开连接
 * @param {*} socket 
 */


function handleMatchingDisconnect(socket) {
  var _socket$data, userId, gameStatus, gameType;

  return regeneratorRuntime.async(function handleMatchingDisconnect$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _socket$data = socket.data, userId = _socket$data.userId, gameStatus = _socket$data.gameStatus, gameType = _socket$data.gameType;

          if (!(gameStatus === 'matching')) {
            _context13.next = 4;
            break;
          }

          _context13.next = 4;
          return regeneratorRuntime.awrap(redis.zrem("game_matching_queue:".concat(gameType), userId));

        case 4:
        case "end":
          return _context13.stop();
      }
    }
  });
}
/**
 * 玩家主动取消匹配
 * @param {*} socket 
 * @param {*} param1 
 */


function handleCancelMatchGame(socket, _ref7) {
  var gameType, userId;
  return regeneratorRuntime.async(function handleCancelMatchGame$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          gameType = _ref7.gameType;
          userId = socket.data.userId;
          _context14.next = 4;
          return regeneratorRuntime.awrap(redis.zrem("game_matching_queue:".concat(gameType), userId));

        case 4:
          _context14.next = 6;
          return regeneratorRuntime.awrap(socket.emit('canceled match game'));

        case 6:
        case "end":
          return _context14.stop();
      }
    }
  });
}
/**
 * 玩家加入游戏房间
 * @param {*} socket 
 * @param {*} param1 
 */


function handleJoinGameRoom(socket, _ref8) {
  var gameRoomId, userId, _ref9, currentStepNum, boardGrids, playersStatusMap, playersInfoMap, customGameMaster;

  return regeneratorRuntime.async(function handleJoinGameRoom$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          gameRoomId = _ref8.gameRoomId;
          userId = socket.data.userId;
          _context15.next = 4;
          return regeneratorRuntime.awrap(socket.join(gameRoomId));

        case 4:
          _context15.next = 6;
          return regeneratorRuntime.awrap(redis.hset("game_room:".concat(gameRoomId, ":players"), userId, '1'));

        case 6:
          _context15.next = 8;
          return regeneratorRuntime.awrap(get_board(gameRoomId));

        case 8:
          _ref9 = _context15.sent;
          currentStepNum = _ref9.currentStepNum;
          boardGrids = _ref9.boardGrids;
          _context15.next = 13;
          return regeneratorRuntime.awrap(get_players_status(gameRoomId));

        case 13:
          playersStatusMap = _context15.sent;
          _context15.next = 16;
          return regeneratorRuntime.awrap(UserModel.find({
            _id: {
              $in: Object.keys(playersStatusMap)
            }
          }).select('avatar nickname'));

        case 16:
          _context15.t0 = function (result, item) {
            result[item._id.toString()] = item;
            return result;
          };

          _context15.t1 = {};
          playersInfoMap = _context15.sent.reduce(_context15.t0, _context15.t1);
          _context15.next = 21;
          return regeneratorRuntime.awrap(redis.get("game_room:".concat(gameRoomId, ":customGameMaster")));

        case 21:
          customGameMaster = _context15.sent;
          _context15.next = 24;
          return regeneratorRuntime.awrap(socket.emit('custom game master', {
            customGameMaster: customGameMaster
          }));

        case 24:
          _context15.next = 26;
          return regeneratorRuntime.awrap(socket.emit('sync board', {
            currentStepNum: currentStepNum,
            boardGrids: boardGrids
          }));

        case 26:
          _context15.next = 28;
          return regeneratorRuntime.awrap(socket.emit('sync players status', {
            playersStatusMap: playersStatusMap
          }));

        case 28:
          _context15.next = 30;
          return regeneratorRuntime.awrap(socket.emit('sync players info', {
            playersInfoMap: playersInfoMap
          }));

        case 30:
          _context15.next = 32;
          return regeneratorRuntime.awrap(socket.to(gameRoomId).emit('other player join', {
            playerId: userId,
            playerInfo: playersInfoMap[userId]
          }));

        case 32:
          // 给房间内所有玩家发送有人进房间的消息
          socket.data.gameStatus = 'gaming';
          socket.data.gameRoomId = gameRoomId;

        case 34:
        case "end":
          return _context15.stop();
      }
    }
  });
}

function handleGamingDisconnect(socket) {
  var _socket$data2, userId, gameStatus, gameRoomId;

  return regeneratorRuntime.async(function handleGamingDisconnect$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _socket$data2 = socket.data, userId = _socket$data2.userId, gameStatus = _socket$data2.gameStatus, gameRoomId = _socket$data2.gameRoomId;

          if (!(gameStatus === 'gaming')) {
            _context16.next = 6;
            break;
          }

          _context16.next = 4;
          return regeneratorRuntime.awrap(redis.hset("game_room:".concat(gameRoomId, ":players"), userId, ''));

        case 4:
          _context16.next = 6;
          return regeneratorRuntime.awrap(socket.to(gameRoomId).emit('other player leave', {
            playerId: userId
          }));

        case 6:
        case "end":
          return _context16.stop();
      }
    }
  });
}

function handleSubmitMove(socket, _ref10) {
  var movePos, stepNum, _socket$data3, userId, gameRoomId, boardGrids, currentStepNum, currentStepMap, playersMap, stopPlayers, allPlayersMoved, playerId, nextStepNum, _boardGrids, currentStep, oldPlayersPosMap, y, x, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, playerStep, oldPos, seizePlayer, playersStatusMap;

  return regeneratorRuntime.async(function handleSubmitMove$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          movePos = _ref10.movePos, stepNum = _ref10.stepNum;
          _socket$data3 = socket.data, userId = _socket$data3.userId, gameRoomId = _socket$data3.gameRoomId;
          _context17.t0 = JSON;
          _context17.next = 5;
          return regeneratorRuntime.awrap(redis.get("game_room:".concat(gameRoomId, ":boardGrids")));

        case 5:
          _context17.t1 = _context17.sent;
          boardGrids = _context17.t0.parse.call(_context17.t0, _context17.t1);
          _context17.t2 = Number;
          _context17.next = 10;
          return regeneratorRuntime.awrap(redis.get("game_room:".concat(gameRoomId, ":currentStepNum")));

        case 10:
          _context17.t3 = _context17.sent;
          currentStepNum = (0, _context17.t2)(_context17.t3);

          if (!(stepNum !== currentStepNum || boardGrids[movePos.y][movePos.x])) {
            _context17.next = 16;
            break;
          }

          _context17.next = 15;
          return regeneratorRuntime.awrap(socket.emit('sync game', {
            boardGrids: boardGrids,
            currentStepNum: currentStepNum
          }));

        case 15:
          return _context17.abrupt("return");

        case 16:
          _context17.next = 18;
          return regeneratorRuntime.awrap(redis.hset("game_room:".concat(gameRoomId, ":currentStep"), userId, "".concat(movePos.x, ":").concat(movePos.y, ":").concat(new Date().getTime())));

        case 18:
          _context17.next = 20;
          return regeneratorRuntime.awrap(redis.hgetall("game_room:".concat(gameRoomId, ":currentStep")));

        case 20:
          currentStepMap = _context17.sent;
          _context17.next = 23;
          return regeneratorRuntime.awrap(redis.hgetall("game_room:".concat(gameRoomId, ":players")));

        case 23:
          playersMap = _context17.sent;
          _context17.next = 26;
          return regeneratorRuntime.awrap(redis.smembers("game_room:".concat(gameRoomId, ":stopPlayers")));

        case 26:
          stopPlayers = _context17.sent;
          // 被暂停的用户
          allPlayersMoved = true;

          for (playerId in playersMap) {
            // 假如有玩家在线，且没有被暂停，他还没下棋，那此步就没结束
            if (playersMap[playerId] && !stopPlayers.includes(playerId) && !currentStepMap[playerId]) {
              allPlayersMoved = false;
            }
          } // 如果所有在线玩家都走好了


          if (!allPlayersMoved) {
            _context17.next = 93;
            break;
          }

          _context17.next = 32;
          return regeneratorRuntime.awrap(redis.unlink("game_room:".concat(gameRoomId, ":stopPlayers")));

        case 32:
          // 清空暂停的玩家
          nextStepNum = currentStepNum + 1;
          _context17.t4 = JSON;
          _context17.next = 36;
          return regeneratorRuntime.awrap(redis.get("game_room:".concat(gameRoomId, ":boardGrids")));

        case 36:
          _context17.t5 = _context17.sent;
          _boardGrids = _context17.t4.parse.call(_context17.t4, _context17.t5);
          currentStep = Object.keys(currentStepMap).map(function (playerId) {
            var _currentStepMap$playe = currentStepMap[playerId].split(':'),
                _currentStepMap$playe2 = _slicedToArray(_currentStepMap$playe, 3),
                x = _currentStepMap$playe2[0],
                y = _currentStepMap$playe2[1],
                time = _currentStepMap$playe2[2];

            return {
              playerId: playerId,
              x: Number(x),
              y: Number(y),
              time: Number(time)
            };
          }).sort(function (a, b) {
            // 根据提交时间排序
            return a.time - b.time;
          });
          oldPlayersPosMap = {}; // 把棋盘

          for (y = 0; y < _boardGrids.length; y++) {
            for (x = 0; x < _boardGrids.length; x++) {
              if (typeof _boardGrids[y][x] === 'string') {
                oldPlayersPosMap[_boardGrids[y][x]] = {
                  x: x,
                  y: y
                };
                _boardGrids[y][x] = 1;
              }
            }
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context17.prev = 44;
          _iterator = currentStep[Symbol.iterator]();

        case 46:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context17.next = 64;
            break;
          }

          playerStep = _step.value;

          if (!_boardGrids[playerStep.y][playerStep.x]) {
            _context17.next = 60;
            break;
          }

          oldPos = oldPlayersPosMap[userId];
          _boardGrids[oldPos.y][oldPos.x] = userId;
          seizePlayer = _boardGrids[playerStep.y][playerStep.x]; // 已经占据位置的玩家

          _context17.next = 54;
          return regeneratorRuntime.awrap(io.to(seizePlayer).emit('seize success', {
            stopStepNum: nextStepNum
          }));

        case 54:
          _context17.next = 56;
          return regeneratorRuntime.awrap(redis.sadd("game_room:".concat(gameRoomId, ":stopPlayers"), seizePlayer));

        case 56:
          _context17.next = 58;
          return regeneratorRuntime.awrap(socket.emit('seize fail'));

        case 58:
          _context17.next = 61;
          break;

        case 60:
          _boardGrids[playerStep.y][playerStep.x] = playerStep.playerId;

        case 61:
          _iteratorNormalCompletion = true;
          _context17.next = 46;
          break;

        case 64:
          _context17.next = 70;
          break;

        case 66:
          _context17.prev = 66;
          _context17.t6 = _context17["catch"](44);
          _didIteratorError = true;
          _iteratorError = _context17.t6;

        case 70:
          _context17.prev = 70;
          _context17.prev = 71;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 73:
          _context17.prev = 73;

          if (!_didIteratorError) {
            _context17.next = 76;
            break;
          }

          throw _iteratorError;

        case 76:
          return _context17.finish(73);

        case 77:
          return _context17.finish(70);

        case 78:
          _context17.next = 80;
          return regeneratorRuntime.awrap(redis.unlink("game_room:".concat(gameRoomId, ":currentStep")));

        case 80:
          _context17.next = 82;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":boardGrids"), JSON.stringify(_boardGrids)));

        case 82:
          _context17.next = 84;
          return regeneratorRuntime.awrap(redis.set("game_room:".concat(gameRoomId, ":currentStepNum"), nextStepNum));

        case 84:
          _context17.next = 86;
          return regeneratorRuntime.awrap(io.to(gameRoomId).emit('sync board', {
            boardGrids: _boardGrids,
            currentStepNum: nextStepNum
          }));

        case 86:
          _context17.next = 88;
          return regeneratorRuntime.awrap(get_players_status(gameRoomId));

        case 88:
          playersStatusMap = _context17.sent;
          _context17.next = 91;
          return regeneratorRuntime.awrap(io.to(gameRoomId).emit('sync players status', {
            playersStatusMap: playersStatusMap
          }));

        case 91:
          _context17.next = 95;
          break;

        case 93:
          _context17.next = 95;
          return regeneratorRuntime.awrap(socket.to(gameRoomId).emit('other player move', {
            playerId: userId
          }));

        case 95:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[44, 66, 70, 78], [71,, 73, 77]]);
}

io.on("connection", function _callee2(socket) {
  var socketFunc;
  return regeneratorRuntime.async(function _callee2$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          socketFunc = function socketFunc(func) {
            return function _callee() {
              var _len,
                  args,
                  _key,
                  _args18 = arguments;

              return regeneratorRuntime.async(function _callee$(_context18) {
                while (1) {
                  switch (_context18.prev = _context18.next) {
                    case 0:
                      for (_len = _args18.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = _args18[_key];
                      }

                      _context18.next = 3;
                      return regeneratorRuntime.awrap(func.apply(void 0, [socket].concat(args)));

                    case 3:
                      return _context18.abrupt("return", _context18.sent);

                    case 4:
                    case "end":
                      return _context18.stop();
                  }
                }
              });
            };
          };

          _context19.next = 3;
          return regeneratorRuntime.awrap(socketFunc(checkLogin)());

        case 3:
          socket.on('login', socketFunc(handleLogin));
          socket.on('login as tourist', socketFunc(handleLoginAsTourist));
          socket.on('logout', socketFunc(handleLogout));
          socket.on('disconnect', socketFunc(handleDisconect));
          socket.on('match game', socketFunc(handleMatchGame));
          socket.on('disconnect', socketFunc(handleMatchingDisconnect));
          socket.on('cancel match game', socketFunc(handleCancelMatchGame));
          socket.on('join game room', socketFunc(handleJoinGameRoom));
          socket.on('disconnect', socketFunc(handleGamingDisconnect));
          socket.on('submit move', socketFunc(handleSubmitMove));
          socket.on('custom game', socketFunc(handleCustomGame));
          socket.on('custom game base info', socketFunc(handleCustomGameBaseInfo));
          socket.on('custom game start', socketFunc(handleCustomGameStart));

        case 16:
        case "end":
          return _context19.stop();
      }
    }
  });
});