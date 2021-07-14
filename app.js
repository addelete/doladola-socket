'use strict';

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const mock = require('mockjs');
const { port, socket_io_options, jwt_secret, mongodb_uri } = require("./config");
const io = require("socket.io")(port, socket_io_options);
const Redis = require("ioredis");
const { v4: uuid } = require('uuid');

const redis = new Redis({ db: 1 });

mongoose.connect(mongodb_uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
const userSchema = mongoose.Schema({
  nickname: String,
  avatar: String,
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    hide: true,
  },
  isTourist: Boolean,
});
const UserModel = mongoose.model('User', userSchema)

/**
 * 解码jwt token里面的数据
 * @param {string} token
 * @returns
 */
function jwt_decode(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, jwt_secret);
  } catch {
    return null
  }
}

/**
 * 根据游戏类型获取游戏初始化信息
 * @param {string} gameType
 * @returns
 */
function get_game_info(gameType) {
  const gameInfoMap = {
    s4p2: {
      type: 's4p2',
      name: '方格2人战',
      playersNum: 2,
      boardGrids: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
    s4p4: {
      type: 's4p4',
      name: '方格4人战',
      playersNum: 4,
      boardGrids: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
    s4p8: {
      type: 's4p8',
      name: '方格8人战',
      playersNum: 8,
      boardGrids: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
    s4g9: {
      type: 's4g9',
      name: '自定义方格9x9',
      boardGrids: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
    s4g15: {
      type: 's4g15',
      name: '自定义方格15x15',
      boardGrids: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
    s4g21: {
      type: 's4g21',
      name: '自定义方格21x21',
      boardGrids: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
  };
  return gameInfoMap[gameType];
};

/**
 * 统一处理登录成功之后的逻辑
 * @param {*} socket
 * @param {*} user
 */
async function login_sucess(socket, user) {
  const token = jwt.sign({ userId: user._id }, jwt_secret); // 生成一个新的token
  await socket.emit('login success', {
    token,
    account: user,
  });
  socket.join(user._id.toString()); // 假如用户ID同名的room
  socket.data.userId = user._id.toString(); // 更新socket data
}

/**
 * 查询房间内玩家状态
 * @returns
 */
async function get_players_status(gameRoomId) {
  const playersOnlineMap = await redis.hgetall(`game_room:${gameRoomId}:players`); // 从缓存内查询房间内玩家在线情况
  const currentStepMap = await redis.hgetall(`game_room:${gameRoomId}:currentStep`);
  return Object.keys(playersOnlineMap).reduce((result, playerId) => {
    result[playerId] = {
      move: !!currentStepMap[playerId],
      online: !!playersOnlineMap[playerId],
    }
    return result;
  }, {})
}

/**
 * 查询当前局面状态
 * @param {*} gameRoomId
 * @returns
 */
async function get_board(gameRoomId) {
  const boardGrids = JSON.parse(await redis.get(`game_room:${gameRoomId}:boardGrids`));
  const currentStepNum = Number(await redis.get(`game_room:${gameRoomId}:currentStepNum`));
  return { boardGrids, currentStepNum };
}

/**
 * 检查位置是否被围死
 * @param {*} pos
 * @param {*} boardGrids
 * @returns
 */
function check_pos_is_dead(pos, boardGrids) {
  const maxX = boardGrids[0].length - 1
  const maxY = boardGrids.length - 1
  const positions = [
    { x: pos.x + 1, y: pos.y },
    { x: pos.x - 1, y: pos.y },
    { x: pos.x, y: pos.y + 1 },
    { x: pos.x, y: pos.y - 1 },
  ] // 把四周的坐标求出来
  const canMovePositions = positions.filter(({ x, y }) => !(x < 0 || x > maxX || y < 0 || y > maxY || boardGrids[y][x])) // 判断下一步还能走不
  return canMovePositions.length === 0;
}

/**
 * 连结时检查是否已经登录
 * @param {*} socket
 */
async function checkLogin(socket) {
  const jwtData = jwt_decode(socket.handshake.auth.token);
  if (!jwtData || !jwtData.userId) {
    socket.emit('need login');
  } else {
    const user = await UserModel.findById(jwtData.userId).select('avatar nickname')
    if (!user) {
      await socket.emit('need login');
    } else {
      await login_sucess(socket, user)
    }
  }
}

/**
 * 登录 TODO:
 * @param {*} socket
 * @param {*} param1
 */
async function handleLogin(socket, { email, password }) {
  console.log(email, password);
}

/**
 * 游客登录
 * 模拟一个用户，使用这个模拟的用户信息登录
 * @param {*} socket
 */
async function handleLoginAsTourist(socket) {
  const nickname = mock.Random.cname();
  const avatar = `/random/w,120,h,120,b,${mock.Random.color().slice(1)},f,000000,t,${nickname}`
  const user = await UserModel.create({
    nickname,
    avatar,
    email: mock.Random.email(),
    isTourist: true,
  })
  await login_sucess(socket, user)
}

/**
 * 退出
 * @param {*} socket
 */
async function handleLogout(socket) {
  socket.data.userId = undefined
  await socket.emit('need login')
}

/**
 * 断开连接后的逻辑
 * @param {*} socket
 */
async function handleDisconect(socket) {

}

/**
 * 自定义游戏
 * @param {*} socket
 * @param {*} param1
 */
async function handleCustomGame(socket, { gameType }) {
  const { boardGrids } = get_game_info(gameType)
  const { userId } = socket.data;
  const gameRoomId = uuid();
  await redis.set(`game_room:${gameRoomId}:gameType`, gameType);
  await redis.set(`game_room:${gameRoomId}:boardGrids`, JSON.stringify(boardGrids));
  await redis.set(`game_room:${gameRoomId}:currentStepNum`, 0);
  await redis.set(`game_room:${gameRoomId}:customGameMaster`, userId);
  await redis.hmset(`game_room:${gameRoomId}:players`, userId, '');
  await socket.emit('custom game success', { gameRoomId });
}

/**
 * 自定义游戏信息
 * 邀请的玩家，根据自定义游戏的信息进入游戏
 * @param {*} socket
 * @param {*} param1
 */
async function handleCustomGameBaseInfo(socket, { gameRoomId }) {
  const gameType = await redis.get(`game_room:${gameRoomId}:gameType`)
  const currentStepNum = Number(await redis.get(`game_room:${gameRoomId}:currentStepNum`))
  const canJoin = Number(currentStepNum) === 0
  await socket.emit('custom game base info success', { gameRoomId, gameType, canJoin })
}

/**
 * 开始游戏
 * @param {*} socket
 * @param {*} param1
 */
async function handleCustomGameStart(socket, { gameRoomId }) {
  await redis.set(`game_room:${gameRoomId}:currentStepNum`, 1)
  const { currentStepNum, boardGrids } = await get_board(gameRoomId); // 当前局面状态
  await io.to(gameRoomId).emit('sync board', { currentStepNum, boardGrids }); // 给当前房间玩家发送棋盘状态
}

/**
 * 玩家请求匹配游戏
 * 插入一个队列，如果人数凑够，就开始游戏
 * @param {*} socket
 * @param {*} param1
 */
async function handleMatchGame(socket, { gameType }) {
  const { playersNum, boardGrids } = get_game_info(gameType);
  const { userId } = socket.data;
  let matchingUsers = [userId];
  let cursor = 0;
  let matched = true;
  while (matched) {
    const queue = await redis.zscan(`game_matching_queue:${gameType}`, 0);
    cursor = Number(queue[0]);
    matchingUsers = queue[1].reduce((result, item, index) => {
      if (index % 2 === 0) {
        result.push(item)
      }
      return result
    }, matchingUsers)
    if (matchingUsers.length >= playersNum) {
      await redis.zrem(`game_matching_queue:${gameType}`, ...matchingUsers.slice(0, playersNum))
      break;
    }
    if (cursor === 0 && matchingUsers.length < playersNum) {
      matched = false;
    }
  }
  if (matched) {
    // 匹配成功
    const playersHsetArgs = matchingUsers.reduce((result, item) => {
      result.push(item, '');
      return result;
    }, []);
    const gameRoomId = uuid();
    await redis.set(`game_room:${gameRoomId}:gameType`, gameType);
    await redis.set(`game_room:${gameRoomId}:boardGrids`, JSON.stringify(boardGrids));
    await redis.set(`game_room:${gameRoomId}:currentStepNum`, 1);
    await redis.hmset(`game_room:${gameRoomId}:players`, ...playersHsetArgs);
    await io.to(matchingUsers).emit('match game success', { gameRoomId });
    socket.data.gameStatus = undefined;
    socket.data.gameType = undefined;
  } else {
    await redis.zadd(`game_matching_queue:${gameType}`, new Date().getTime(), userId);
    socket.data.gameStatus = 'matching';
    socket.data.gameType = gameType;
  }
}

/**
 * 当匹配游戏的时候断开连接
 * @param {*} socket
 */
async function handleMatchingDisconnect(socket) {
  const { userId, gameStatus, gameType } = socket.data;
  if (gameStatus === 'matching') {
    await redis.zrem(`game_matching_queue:${gameType}`, userId);
  }
}

/**
 * 玩家主动取消匹配
 * @param {*} socket
 * @param {*} param1
 */
async function handleCancelMatchGame(socket, { gameType }) {
  const { userId } = socket.data;
  await redis.zrem(`game_matching_queue:${gameType}`, userId);
  await socket.emit('canceled match game');
}

/**
 * 玩家加入游戏房间
 * @param {*} socket
 * @param {*} param1
 */
async function handleJoinGameRoom(socket, { gameRoomId }) {
  const { userId } = socket.data;

  const { currentStepNum, boardGrids } = await get_board(gameRoomId); // 当前局面状态
  if (currentStepNum > 1) {
    let hadMyself;
    for (const row of boardGrids) {
      for (const grid of row) {
        if (grid === userId) {
          hadMyself = true
          break
        }
      }
      if (hadMyself) {
        break
      }
    }
    if (!hadMyself) {
      await socket.emit('game over cause miss step')
      return
    }
  }
  await socket.join(gameRoomId); // 加入房间
  await redis.hset(`game_room:${gameRoomId}:players`, userId, '1');
  const playersStatusMap = await get_players_status(gameRoomId); // 玩家状态
  const playersInfoMap = (await UserModel
    .find({ _id: { $in: Object.keys(playersStatusMap) } })
    .select('avatar nickname')
  ).reduce((result, item) => {
    result[item._id.toString()] = item;
    return result;
  }, {}); // 玩家信息
  const customGameMaster = await redis.get(`game_room:${gameRoomId}:customGameMaster`) // 自定义房间的主人
  await socket.emit('custom game master', { customGameMaster });
  await socket.emit('sync board', { currentStepNum, boardGrids }); // 给当前玩家发送棋盘状态
  await socket.emit('sync players status', { playersStatusMap }); // 给当前玩家发送其他玩家在线情况
  await socket.emit('sync players info', { playersInfoMap }); // 给当前玩家发送其他玩家信息
  await socket.to(gameRoomId).emit('other player join', { playerId: userId, playerInfo: playersInfoMap[userId] }); // 给房间内所有玩家发送有人进房间的消息
  socket.data.gameStatus = 'gaming';
  socket.data.gameRoomId = gameRoomId;
}

/**
 * 游戏中掉线
 * @param {*} socket
 */
async function handleGamingDisconnect(socket) {
  const { userId, gameStatus, gameRoomId } = socket.data
  if (gameStatus === 'gaming') {
    await redis.hset(`game_room:${gameRoomId}:players`, userId, '');
    await socket.to(gameRoomId).emit('other player leave', { playerId: userId });
  }
}

/**
 * 玩家提交移动
 * @param {*} socket
 * @param {*} param1
 * @returns
 */
async function handleSubmitMove(socket, { oldPos, movePos, stepNum }) {

  // 判断移动合法性
  if(!oldPos && stepNum > 1) {
    await socket.emit('game over cause miss step', {i: 1});
    return
  }
  if(oldPos) {
    const dx = Math.abs(oldPos.x - movePos.x)
    const dy = Math.abs(oldPos.y - movePos.y)
    if(!((dx === 0 && dy === 1) || (dx === 1 && dy === 0))) {
      await socket.emit('game over cause miss step', {i: 2});
      return
    }
  }


  const { userId, gameRoomId } = socket.data;
  const boardGrids = JSON.parse(await redis.get(`game_room:${gameRoomId}:boardGrids`));
  // 再次判断合法性
  if(oldPos && boardGrids[oldPos.y][oldPos.x] !== userId){
    await socket.emit('game over cause miss step', {i: 3});
    return
  }
  const currentStepNum = Number(await redis.get(`game_room:${gameRoomId}:currentStepNum`));
  if (Number(stepNum) !== currentStepNum || boardGrids[movePos.y][movePos.x]) {
    await socket.emit('game over cause miss step', {i: 4});
    return;
  }
  // 查询当前别人已下的步骤
  const currentStepMap = await redis.hgetall(`game_room:${gameRoomId}:currentStep`); //
  const currentStep = Object.keys(currentStepMap).map(playerId => {
    const [x, y, time] = currentStepMap[playerId].split(':');
    return { playerId, x: Number(x), y: Number(y), time: Number(time) };
  }).sort((a, b) => { // 根据提交时间排序
    return (a.time - b.time);
  });

  // 判断是否和别人的步骤冲突，如果冲突，提示冲突，让玩家重走
  const isClashed = currentStep.findIndex(step => step.x === movePos.x && step.y === movePos.y) > -1
  if (isClashed) {
    if(oldPos) {
      boardGrids[movePos.y][movePos.x] = 1
      const isDead = check_pos_is_dead(oldPos, boardGrids) // 判断被别人先走之后，自己是否已被围死
      if(isDead) {
        await redis.sadd(`game_room:${gameRoomId}:losingPlayers`, userId);
        await socket.emit('game over', { result: 'normal' })
        return
      }
    }
    await socket.emit('clashed moving', { boardGrids, currentStepNum });
    return;
  }

  // 把当前玩家的操作插入到当前步骤中
  const time = new Date().getTime()
  await redis.hset(`game_room:${gameRoomId}:currentStep`, userId, `${movePos.x}:${movePos.y}:${time}`);
  // 更新当前步骤map和array
  currentStepMap[userId] = `${movePos.x}:${movePos.y}:${time}`;
  currentStep.push({ playerId: userId, x: movePos.x, y: movePos.y, time })
  // 判断这一步是不是所有在线玩家都走好了
  const playersMap = await redis.hgetall(`game_room:${gameRoomId}:players`); // 玩家在线情况
  const losingPlayers = await redis.smembers(`game_room:${gameRoomId}:losingPlayers`); // 已经失败的用户

  let allPlayersMoved = true;
  for (const playerId in playersMap) {
    if (playersMap[playerId] && // 假如玩家在线
      !losingPlayers.includes(playerId) && // 且玩家没有输
      !currentStepMap[playerId] // 并且他还没下棋
    ) {
      allPlayersMoved = false; // 那就说明还有玩家没走好
    }
  }

  if (!allPlayersMoved) { // 如果还有玩家没走好
    await socket.to(gameRoomId).emit('other player move', { playerId: userId }); // 给房间其他玩家发消息，说有人走了一步
  } else { // 如果所有玩家都走好了
    await handleGotoNextStep(gameRoomId);
  }
}



async function handleGotoNextStep(gameRoomId) {
  const playersMap = await redis.hgetall(`game_room:${gameRoomId}:players`); // 玩家在线情况
  const currentStepNum = Number(await redis.get(`game_room:${gameRoomId}:currentStepNum`)); // 当前回合数
  // 查询当前别人已下的步骤
  const currentStepMap = await redis.hgetall(`game_room:${gameRoomId}:currentStep`); //
  const currentStep = Object.keys(currentStepMap).map(playerId => {
    const [x, y, time] = currentStepMap[playerId].split(':');
    return { playerId, x: Number(x), y: Number(y), time: Number(time) };
  }).sort((a, b) => { // 根据提交时间排序
    return (a.time - b.time);
  });
  const nextStepNum = currentStepNum + 1;
  const boardGrids = JSON.parse(await redis.get(`game_room:${gameRoomId}:boardGrids`));
  // 把棋盘玩家id换成1
  for (let y = 0; y < boardGrids.length; y++) {
    for (let x = 0; x < boardGrids[y].length; x++) {
      if (typeof boardGrids[y][x] === 'string') {
        boardGrids[y][x] = 1;
      }
    }
  }
  // 根据本步各玩家移动在棋盘上填充玩家id
  for (const playerStep of currentStep) {
    boardGrids[playerStep.y][playerStep.x] = playerStep.playerId;
  }
  // 清空当前步缓存
  await redis.unlink(`game_room:${gameRoomId}:currentStep`);
  // 存储当前局面和当前回合数
  await redis.set(`game_room:${gameRoomId}:boardGrids`, JSON.stringify(boardGrids));
  await redis.set(`game_room:${gameRoomId}:currentStepNum`, nextStepNum);
  // 给所有玩家发送最新局面和玩家状态
  await io.to(gameRoomId).emit('sync board', { boardGrids, currentStepNum: nextStepNum });
  const playersStatusMap = await get_players_status(gameRoomId)
  await io.to(gameRoomId).emit('sync players status', { playersStatusMap });
  // 判断是否有人出局，或已经结束游戏
  const losers = []; // 被围死的在线玩家列表
  const survivors = []; // 幸存的在线玩家列表
  // 检查每个格子，如果是玩家id，检查周围格子是否还能走
  for (let y = 0; y < boardGrids.length; y++) {
    for (let x = 0; x < boardGrids[y].length; x++) {
      const playerId = boardGrids[y][x];
      if (typeof playerId !== 'string' || !playersMap[playerId]) { // 假如当前格子不是玩家，或者是玩家但不在线，就跳过
        continue
      }
      if (check_pos_is_dead({ x, y }, boardGrids)) {
        losers.push(playerId)
      } else {
        survivors.push(playerId)
      }
    }
  }
  if (losers.length > 0) {
    await redis.sadd(`game_room:${gameRoomId}:losingPlayers`, ...losers);
  }
  if (survivors.length === 0) { // 没有幸存者，判定为平局
    await io.to(gameRoomId).emit('game over', { result: 'draw' })
  } else if (survivors.length === 1) { // 只有一个幸存者，判定此幸存者胜
    await io.to(gameRoomId).emit('game over', { result: 'normal', winner: survivors[0] })
  } else if(losers.length > 0) {
    for(const loser in losers) {
      await io.to(loser).emit('game over', { result: 'normal' })
    }
  }
}

/**
 * 玩家退出游戏
 * @param {*} socket
 */
async function handleQuitGameStart(socket) {
  const { userId, gameRoomId } = socket.data;
  await redis.hset(`game_room:${gameRoomId}:players`, userId, '');
  await socket.emit('quit game success');
  await socket.to(gameRoomId).emit('other player quit game', { playerId: userId });
  await socket.leave(gameRoomId);
  // 检查房间内在线玩家数，如果小于等于1，结束游戏
  const playersMap = await redis.hgetall(`game_room:${gameRoomId}:players`); // 玩家在线情况
  const onlinePlayers = Object.keys(playersMap).reduce((result, item) => {
    if (playersMap[item] === '1') {
      result.push(item);
    }
    return result
  }, []);

  if (onlinePlayers.length === 1) { // 只有一个在线玩家
    const isLosing = await redis.sismember(`game_room:${gameRoomId}:losingPlayers`, onlinePlayers[0])
    if (!isLosing) { // 如果此玩家没有被围死，判定此在线玩家胜
      await io.to(gameRoomId).emit('game over', { result: 'normal', winner: onlinePlayers[0] })
    }
  }
}



/**
 * 投票重开游戏
 * @param {*} socket
 * @param {*} param1
 */
async function handleVoteRestart(socket, { vote }) {
  const { userId, gameRoomId } = socket.data;
  if (!vote) {
    await redis.unlink(`game_room:${gameRoomId}:voteRestartPlayers`)
    await socket.to(gameRoomId).emit('vote restart failed')
  } else {
    
    await redis.sadd(`game_room:${gameRoomId}:voteRestartPlayers`, userId);
    const voteRestartPlayers = await redis.smembers(`game_room:${gameRoomId}:voteRestartPlayers`); // 赞同者列表
    if(voteRestartPlayers.length === 1) { //发起
      await socket.to(gameRoomId).emit('vote restart call')
    }
    const playersOnlineMap = await redis.hgetall(`game_room:${gameRoomId}:players`); // 从缓存内查询房间内玩家在线情况
    const onlinePlayersCount = Object.keys(playersOnlineMap).reduce((result, playerId) => {
      if (playersOnlineMap[playerId]) {
        result++;
      }
      return result;
    }, 0)
    // 假如在线玩家数和投票数一样多，投票成功
    if (voteRestartPlayers.length === onlinePlayersCount) {
      await redis.unlink(`game_room:${gameRoomId}:voteRestartPlayers`)
      const gameType = await redis.get(`game_room:${gameRoomId}:gameType`);
      const { boardGrids } = get_game_info(gameType)
      await redis.set(`game_room:${gameRoomId}:boardGrids`, JSON.stringify(boardGrids));
      await redis.set(`game_room:${gameRoomId}:currentStepNum`, 1);
      await redis.unlink(`game_room:${gameRoomId}:currentStep`);
      await redis.unlink(`game_room:${gameRoomId}:losingPlayers`);
      await redis.unlink(`game_room:${gameRoomId}:voteNextStepPlayers`);
      const underlinePlayers = Object.keys(playersOnlineMap).reduce((result, playerId) => {
        if (!playersOnlineMap[playerId]) {
          result.push(playerId);
        }
        return result;
      }, [])
      if (underlinePlayers.length > 0) {
        await redis.hdel(`game_room:${gameRoomId}:players`, ...underlinePlayers);
      }
      await io.to(gameRoomId).emit('vote restart success'); // 重开游戏成功
      await io.to(gameRoomId).emit('sync board', { currentStepNum: 1, boardGrids }); // 给当前房间玩家发送棋盘状态
      const playersStatusMap = await get_players_status(gameRoomId); // 玩家状态
      await io.to(gameRoomId).emit('sync players status', { playersStatusMap }); // 给当前玩家发送其他玩家在线情况

    }
  }

}
/**
 * 投票拨轮
 * @param {*} socket
 * @param {*} param1
 */
async function handleVoteNextStep(socket, {vote}) {
  const { userId, gameRoomId } = socket.data;
  if (!vote) {
    await redis.unlink(`game_room:${gameRoomId}:voteNextStepPlayers`)
    await socket.to(gameRoomId).emit('vote next step failed')
  } else {
    await redis.sadd(`game_room:${gameRoomId}:voteNextStepPlayers`, userId);
    const voteNextStepPlayers = await redis.smembers(`game_room:${gameRoomId}:voteNextStepPlayers`); // 赞同者列表
    if(voteNextStepPlayers.length === 1) {
      await socket.to(gameRoomId).emit('vote next step call')
    }
    const playersOnlineMap = await redis.hgetall(`game_room:${gameRoomId}:players`); // 从缓存内查询房间内玩家在线情况
    const onlinePlayersCount = Object.keys(playersOnlineMap).reduce((result, playerId) => {
      if (playersOnlineMap[playerId]) {
        result++;
      }
      return result;
    }, 0)
    // 假如在线玩家数和投票数一样多，投票成功
    if (voteNextStepPlayers.length === onlinePlayersCount) {
      await redis.unlink(`game_room:${gameRoomId}:voteNextStepPlayers`)
      await handleGotoNextStep(gameRoomId)
    }
  }
}



io.on("connection", async socket => {
  const socketFunc = (func) => {
    return async (...args) => await func(socket, ...args)
  }

  await socketFunc(checkLogin)()
  socket.on('login', socketFunc(handleLogin))
  socket.on('login as tourist', socketFunc(handleLoginAsTourist))
  socket.on('logout', socketFunc(handleLogout))
  socket.on('disconnect', socketFunc(handleDisconect))
  socket.on('match game', socketFunc(handleMatchGame))
  socket.on('disconnect', socketFunc(handleMatchingDisconnect))
  socket.on('cancel match game', socketFunc(handleCancelMatchGame))
  socket.on('join game room', socketFunc(handleJoinGameRoom))
  socket.on('disconnect', socketFunc(handleGamingDisconnect))
  socket.on('submit move', socketFunc(handleSubmitMove))
  socket.on('custom game', socketFunc(handleCustomGame))
  socket.on('custom game base info', socketFunc(handleCustomGameBaseInfo))
  socket.on('custom game start', socketFunc(handleCustomGameStart))
  socket.on('quit game', socketFunc(handleQuitGameStart))
  socket.on('vote restart', socketFunc(handleVoteRestart))
  socket.on('vote next step', socketFunc(handleVoteNextStep))
});


console.log(`🍻now socket work on: http://127.0.0.1:${port}`)
