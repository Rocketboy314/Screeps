/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.road_fixer');
 * mod.thing == 'a thing'; // true
 */
 
 var roleWallFixer = require('role.wall_fixer');

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
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
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleWallFixer.run(creep);
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
};