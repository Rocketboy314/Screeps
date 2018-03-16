/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        var priorities = {
            "container": 0,
            "extension": 1
        };
        if(creep.memory.doneDepositing == undefined || creep.carry.energy == 0)
            creep.memory.doneDepositing = true;
	    if(creep.carry.energy < creep.carryCapacity && creep.memory.doneDepositing) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.memory.target == -1 || creep.memory.target == undefined) {
                creep.memory.target = Math.floor(Math.random()*2);
                creep.say("Source: " + creep.memory.target);
            }
            if(creep.harvest(sources[creep.memory.target]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.target], {visualizePathStyle: {stroke: '#55FF55'}});
            } else if (creep.harvest(sources[creep.memory.target]) == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.doneDepositing = false;
            }
        }
        else {
            creep.memory.doneDepositing = false;
            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER &&
                                structure.store.energy < structure.storeCapacity);
                    }
            });
            if(targets == null) {
                targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION) &&
                                structure.energy < structure.energyCapacity;
                    }
            });
            }
            if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets, {visualizePathStyle: {stroke: '#5555FF'}});
            }
        }
    }
};