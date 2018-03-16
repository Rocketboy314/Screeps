/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.wall_fixer');
 * mod.thing == 'a thing'; // true
 */

var wall_fixer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.going == undefined) creep.memory.going = false;
        var priorities = {
            "rampart": 0,
            "constructedWall": 1,
            "tower": 2
        }
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.wall = -1;
            creep.memory.building = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.target = -1;
	        creep.memory.building = true;
	        creep.say('🚧');
	    }

	    if(creep.memory.building) {
	        if (creep.memory.going) {
	            var rampart = Game.getObjectById(creep.memory.rampart);
	            if (rampart != undefined) {
	                rampart = Game.getObjectById(creep.memory.rampart);
	                var distance = Math.sqrt(Math.pow((creep.pos.x - rampart.pos.x),2) +
	                    Math.pow((creep.pos.y - rampart.pos.y),2));
	                if (distance > 3) {
	                    creep.moveTo(rampart);
	                } else {
        	            return;
	                }
	            } else {
	                creep.memory.wall = -1;
	                creep.memory.going = false;
	                creep.memory.rampart = -1;
	            }
	            return;
	        }
	        var target;
	        if (creep.memory.wall == -1 || creep.memory.wall == undefined) {
                var structures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => (
                        structure.structureType == STRUCTURE_WALL ||
                        structure.structureType == STRUCTURE_RAMPART) &&
                        structure.pos.y < 49 && structure.pos.y > 0 &&
                        structure.pos.x < 49 && structure.pos.x > 0
                });
                for (var i=0; i<structures.length; i++) {
                    structures[i].priority = structures[i].hits +
                        priorities[structures[i].structureType] * 1000;
                }
                structures.sort(function(a,b) {
                    return a.priority-b.priority;
                });
                target = structures[0].id;
                creep.memory.wall = target;
	        } else {
	            target = creep.memory.wall;
	        }
            if (creep.repair(Game.getObjectById(target)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(target), {visualizePathStyle: {stroke: '#FFFFFF'}});
            }
	    }
	    else {
            var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (source) => {
                    return source.structureType == STRUCTURE_CONTAINER && source.store.energy > 0;
                }
            });
            if (source !== null) {
                if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#55FFFF', lineStyle: 'dotted'}});
                }
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.memory.target == -1 || creep.memory.target == undefined) {
                    creep.memory.target = Math.floor(Math.random()*2);
                    creep.say("Source: " + creep.memory.target);
                }
                if(creep.harvest(sources[creep.memory.target]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.target], {visualizePathStyle: {stroke: '#55FF55'}});
                }
            }
	    }
    }
}

module.exports = wall_fixer;