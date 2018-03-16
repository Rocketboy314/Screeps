/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carrier');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
/** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.doneDepositing == undefined || creep.carry.energy == 0)
            creep.memory.doneDepositing = true;
	    if(creep.carry.energy < creep.carryCapacity && creep.memory.doneDepositing) {
	        var sources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            var total = _.sum(Game.creeps, (c) => c.memory.role != 'dying');
            var buffer = 0;
            if (total >= 8) buffer = 0.02;
            if (total >= 15) buffer = 0.05;
            if (total >= 20) buffer = 0.15;
	        if (sources == null || creep.room.memory.attackCooldown >= 40) {
                sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (source) => {
                        return (source.structureType == STRUCTURE_CONTAINER ||
                                source.structureType == STRUCTURE_STORAGE) && source.store.energy > source.storeCapacity * buffer;
                    }
                });
	        } else {
	            sources = [sources];
	        }
            if (sources.length == 0) {
                creep.memory.doneDepositing = false;
            }
            if (creep.memory.target == -1 || creep.memory.target == undefined) {
                creep.memory.target = Math.floor(Math.random()*sources.length);
                creep.say("Source: " + creep.memory.target);
            }
            if(creep.pickup(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#55FF55', opacity: '1.0'}});
            } else if (creep.pickup(sources[0], RESOURCE_ENERGY == ERR_INVALID_TARGET)) {
                try {
                    var amount = sources[creep.memory.target].store.energy - (sources[creep.memory.target].storeCapacity * buffer);
                    var maxCarry = 0;
                    for (var i=0; i<creep.body.length; i++) {
                        if (creep.body[i].type == CARRY) {
                            maxCarry += 50;
                        }
                    }
                    if (amount > maxCarry) amount = maxCarry;
                } catch (e) { /* No Sources! */ }
                if(creep.withdraw(sources[creep.memory.target], RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.target], {visualizePathStyle: {stroke: '#55FF55'}});
                }
            }
        }
        else {
            creep.memory.doneDepositing = false;
            creep.memory.target = -1;
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
            });
            if(target != null) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#5555FF'}});
                }
            } else {
                creep.say("New Stuff!");
            }
        }
	}
};