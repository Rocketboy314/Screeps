/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.spawner');
 * mod.thing == 'a thing'; // true
 */

var roleSpawner = {
    /** @param {Creep} creep **/
    run: function(spawner) {
        var hasContainer = false;
        var containers = spawner.room.find(FIND_STRUCTURES, {
            filter: (source) => {
                return source.structureType == STRUCTURE_CONTAINER;
            }
        });
        if (JSON.stringify(containers) !== "[]")
            hasContainer = true;
        if (spawner.memory.lastLevel != spawner.room.controller.level) {
            spawner.memory.lastLevel = spawner.room.controller.level;
            console.log("ANNOUNCEMENT: Leveled up to " + spawner.room.controller.level + "!");
        }
        if (spawner.memory.lastStorage != spawner.room.energyCapacityAvailable) {
            spawner.memory.lastStorage = spawner.room.energyCapacityAvailable;
            console.log("ANNOUNCEMENT: Storage increased to " + spawner.room.energyCapacityAvailable + "!");
        }
        if (spawner.room.memory.recycle == undefined) spawner.room.memory.recycle = -1;
        
        if (spawner.room.memory.recycle !== -1) {
            var creep = Game.getObjectById(spawner.room.memory.recycle);
            console.log("ANNOUNCEMENT: " + creep.name + " was recycled.");
            spawner.recycleCreep(creep);
            spawner.room.memory.recycle = -1;
        }
        
        if (spawner.room.memory.attackCooldown == undefined) {
            spawner.room.memory.attackCooldown = 0;
        } else if (spawner.room.memory.attackCooldown > 0) {
            spawner.room.memory.attackCooldown--;
        }
        var builders = {
            count: _.sum(Game.creeps, (c) => c.memory.role == 'builder'),
            name: 'builder'
        };
        var upgraders = {
            count: _.sum(Game.creeps, (c) => c.memory.role == 'upgrader'),
            name: 'upgrader'
        };
        var wall_fixers = {
            count: _.sum(Game.creeps, (c) => c.memory.role == 'wall_fixer'),
            name: 'wall_fixer'
        };
        var road_fixers = {
            count: _.sum(Game.creeps, (c) => c.memory.role == 'road_fixer'),
            name: 'road_fixer'
        };
        var miners = {
            count: _.sum(Game.creeps, (c) => c.memory.role == 'miner') - 1,
            name: 'miner'
        };
        var carriers = {
            count: _.sum(Game.creeps, (c) => c.memory.role == 'carrier'),
            name: 'carrier'
        };
        var soldiers = {
            count: _.sum(Game.creeps, (c) => c.memory.role == 'soldier'),
            name: 'soldier'
        };
        var scouts = {
            count: _.sum(Game.creeps, (c) => c.memory.role == 'scout'),
            name: 'scout'
        };
        var total = _.sum(Game.creeps, (c) => c.memory.role != 'dying');
        
        var proportion = {};
        var array = {
            work: [],
            mine: [],
            carry: [],
            soldier: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, 
                    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                    CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            scout: [TOUGH, TOUGH, MOVE, MOVE]
        };
        var buffer_amount = 0;
        var mode = "";
        if (spawner.room.memory.attackCooldown > 0) {
            proportion = {
                miners: 2,
                carriers: 1,
                builders: 1,
                upgraders: 1,
                wall_fixers: 2,
                road_fixers: 0,
                scouts: 0,
                soldiers: 5
            };
            array.work = [
                WORK, WORK,
                CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE
                ];
            array.mine = [
                WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE
                ];
            array.carry = [
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE
                ];
            buffer_amount = 0;
            mode = "Under Attack Spawn.";
        } else if (total >= 20 && spawner.room.energyCapacityAvailable > 400 && hasContainer) {
            proportion = {
                miners: 3,
                carriers: 2,
                builders: 5,
                upgraders: 7,
                wall_fixers: 2,
                road_fixers: 2,
                scouts: 20,
                soldiers: 0
            }
            array.work = [
                WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE
                ];
            array.mine = [
                WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE
                ];
            array.carry = [
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE
                ];
            buffer_amount = 200;
            mode = "Rich Spawn";
        } else if (total >= 15 && spawner.room.energyCapacityAvailable > 400 && hasContainer) {
            proportion = {
                miners: 5,
                carriers: 3,
                builders: 4,
                upgraders: 5,
                wall_fixers: 1,
                road_fixers: 1,
                scouts: 20,
                soldiers: 0
            }
            array.work = [
                WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE
                ];
            array.mine = [
                WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE
                ];
            array.carry = [
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE
                ];
                buffer_amount = 50;
            mode = "Prosperous Spawn";
        } else if (total >= 8 && spawner.room.energyCapacityAvailable > 400 && hasContainer) {
            proportion = {
                miners: 7,
                carriers: 4,
                builders: 3,
                upgraders: 3,
                wall_fixers: 1,
                road_fixers: 1,
                scouts: 20,
                soldiers: 0
            }
            array.work = [
                WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE
                ];
            array.mine = [
                WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE
                ];
            array.carry = [
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE
                ];
                buffer_amount = 0;
            mode = "Normal Spawn.";
        } else if (total >= 4 && spawner.room.energyCapacityAvailable > 400 && hasContainer) {
            proportion = {
                miners: 3,
                carriers: 2,
                builders: 0,
                upgraders: 1,
                wall_fixers: 0,
                road_fixers: 1,
                scouts: 0,
                soldiers: 0
            }
            array.work = [
                WORK, WORK,
                CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE
                ];
            array.mine = [
                WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE
                ];
            array.carry = [
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE
                ];
            buffer_amount = 0;
            mode = "Low Resource Spawn.";
        } else if (spawner.room.energyCapacityAvailable > 400 && hasContainer) {
            proportion = {
                miners: 1,
                carriers: 1,
                builders: 0,
                upgraders: 0,
                wall_fixers: 0,
                road_fixers: 0,
                scouts: 0,
                soldiers: 0
            }
            array.work = [
                WORK,
                CARRY, CARRY,
                MOVE, MOVE
                ];
            array.mine = [
                WORK,
                CARRY, CARRY,
                MOVE
                ];
            array.carry = [
                CARRY, CARRY,
                MOVE, MOVE
                ];
            buffer_amount = 0;
            mode = "Danger Spawn.";
        } else {
            proportion = {
                miners: 2,
                carriers: 0,
                builders: 1,
                upgraders: 2,
                wall_fixers: 0,
                road_fixers: 0,
                scouts: 0,
                soldiers: 0
            }
            array.work = [
                WORK,
                CARRY, CARRY,
                MOVE
                ];
            array.mine = [
                WORK,
                CARRY, CARRY,
                MOVE
                ];
            array.carry = [
                CARRY, CARRY,
                MOVE, MOVE
                ];
            buffer_amount = 0;
            mode = "Beginning Spawn.";
        }
            
        if (miners.count >= 6 || spawner.memory.lastJob == 'miner') proportion.miners = 0;
        builders.count /= proportion.builders;
        miners.count /= proportion.miners;
        carriers.count /= proportion.carriers;
        upgraders.count /= proportion.upgraders;
        wall_fixers.count /= proportion.wall_fixers;
        road_fixers.count /= proportion.road_fixers;
        soldiers.count /= proportion.soldiers;
        scouts.count /= proportion.scouts;
        
        function getLeast(arr) {
            for (var i = 0; i< arr.length; i++) {
                if (arr[i].name == 'soldier' && arr[i].count < 3)
                    return 'soldier';
                else if (arr[i].count == NaN || !(arr[i].count >= -Infinity)) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            arr.sort(function(a,b){
                a.count = a.count == null ? 1000 : a.count;
                b.count = b.count == null ? 1000 : b.count;
                return a.count - b.count;
            });
            return arr[0].name;
        }
        var goal_role = getLeast([builders, miners, carriers, upgraders, wall_fixers, road_fixers, soldiers, /*scouts*/]);
        var parts = array.work;
        if (goal_role == 'miner') {
            parts = array.mine;
        } else if (goal_role == 'carrier') {
            parts = array.carry;
        } else if (goal_role == 'soldier') {
            parts = array.soldier;
        } else if (goal_role == 'scout') {
            parts = array.scout;
        }
        
        var buffer = 0;
        if (goal_role !== 'soldier') {
            var cost = 0;
            for (var i=0; i<parts.length; i++) {
                cost += BODYPART_COST[parts[i]];
            }
            buffer = cost+buffer_amount;
        }
        
        var suffix = "__1_0_3";
        var name = "RocketCreep__" + goal_role + suffix + Math.floor(Math.random()*1000000);
        var status;
        if (Game.spawns['RocketSpawnA'].room.energyAvailable > buffer) {
            status = Game.spawns['RocketSpawnA'].spawnCreep(parts, name, { memory: { role: goal_role } } );
        } else {
            status = ERR_NOT_ENOUGH_RESOURCES;
        }
        if (status === 0) {
            if (goal_role == 'miner') {
                if (spawner.memory.source == undefined)
                    spawner.memory.source = 0;
                else
                    spawner.memory.source = (spawner.memory.source+1)%2;
                Game.creeps[name].memory.target = spawner.memory.source;
            }
            console.log("ANNOUNCEMENT: Spawned " + name + " with role " + goal_role +  ". " + mode);
            spawner.memory.lastJob = goal_role;
            var bored = true;
            if (bored) {
                console.log();
                console.log("Miners:      " + miners.count + " (" + (miners.count*proportion.miners + 1) + ")");
                console.log("Carriers:    " + carriers.count + " (" + (carriers.count*proportion.carriers) + ")");
                console.log("Builders:    " + builders.count + " (" + (builders.count*proportion.builders) + ")");
                console.log("Upgraders:   " + upgraders.count + " (" + (upgraders.count*proportion.upgraders) + ")");
                console.log("Wall Fixers: " + wall_fixers.count + " (" + (wall_fixers.count*proportion.wall_fixers) + ")");
                console.log("Road Fixers: " + road_fixers.count + " (" + (road_fixers.count*proportion.road_fixers) + ")");
                console.log("Soldiers:    " + soldiers.count + " (" + (soldiers.count*proportion.soldiers) + ")");
                console.log("Scouts:      " + scouts.count + " (" + (scouts.count*proportion.scouts) + ")");
                console.log("Total: " + total);
                console.log();
            }
        }
    }
}

module.exports = roleSpawner;