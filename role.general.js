/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.general');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    getSource: function(creep) {
        var total = _.sum(Game.creeps, (c) => c.memory.role != 'dying');
        var buffer = 0;
        if (total >= 8) buffer = 0.05;
        if (total >= 15) buffer = 0.1;
        if (total >= 20) buffer = 0.25;
        var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (source) => {
                return (source.structureType == STRUCTURE_CONTAINER ||
                        source.structureType == STRUCTURE_STORAGE) && source.store.energy > source.storeCapacity * buffer;
            }
        });
        if (source !== null) {
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
                if(creep.withdraw(source, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#55FF55'}});
                }
                var amount = sources[creep.memory.target].energy - (sources[creep.memory.target].storeCapacity * buffer);
                if(creep.withdraw(sources[creep.memory.target], RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.target], {visualizePathStyle: {stroke: '#55FF55'}});
                }
        } else {
            var sources = creep.room.find(FIND_SOURCES)
            if (creep.memory.target == -1 || creep.memory.target == undefined) {
                creep.memory.target = Math.floor(Math.random()*2);
                creep.say("Source: " + creep.memory.target);
            }
            if(creep.harvest(sources[creep.memory.target]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.target], {visualizePathStyle: {stroke: '#55FF55'}});
            }
        }
    },
    
    dyingBreath: function(creep) {
        if (creep.ticksToLive < 300) {
            creep.memory.role = 'dying';
            console.log("ANNOUNCEMENT: " + creep.name + " is dying.");
        }
    },
	
	markRoom: function (creep) {
		if (creep.signController(creep.room.controller, "Thanks to whoever made these walls, but they're mine now.") == ERR_NOT_IN_RANGE) {
			creep.moveTo(creep.room.controller);
		}
	}
};