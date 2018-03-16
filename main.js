var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleWallFixer = require('role.wall_fixer');
var roleRoadFixer = require('role.road_fixer');
var roleTower = require('role.tower');
var roleSoldier = require('role.soldier');
var roleScout = require('role.scout');
var roleDying = require('role.dying');

var roleSpawner = require('role.spawner');

var general = require('role.general');

module.exports.loop = function () {
    var myRoomName = "E54N3";
    var walls = Game.rooms[myRoomName].find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
        && s.pos.y < 49 && s.pos.y > 0 && s.pos.x < 49 && s.pos.x > 0
    });
    for (let wall of walls) {
        if (wall.hits <= 10) {
            Game.rooms[myRoomName].controller.activateSafeMode();
        }
    }
    
    if (Game.creeps["Emergency!"] != null) {
        roleCarrier.run(Game.creeps["Emergency!"]);
    }
    for (var name in Memory.creeps) {
        if (typeof Game.creeps[name] === "undefined") {
            Memory.creeps[name] = undefined;
            console.log("ANNOUNCEMENT: " + name + " has died.");
        }
    }
    
    var tower_ids = [
        '5a5c336f7388e152053363dc'
        ];
    
    for(var i=0; i<tower_ids.length; i++) {
        var tower = Game.getObjectById(tower_ids[i]);
        roleTower.run(tower);
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'wall_fixer') {
            roleWallFixer.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'road_fixer') {
            roleRoadFixer.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'soldier') {
            roleSoldier.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'scout') {
            roleScout.run(creep);
            general.dyingBreath(creep);
        }
        if(creep.memory.role == 'dying') {
            roleDying.run(creep);
        }
    }
    
    for(var name in Game.spawns) {
        var spawner = Game.spawns[name];
        roleSpawner.run(spawner);
    }
}