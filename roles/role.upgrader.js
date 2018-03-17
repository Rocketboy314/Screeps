var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('??');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.target = -1;
	        creep.memory.upgrading = true;
	        creep.say('?');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#FF5555'}});
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

module.exports = roleUpgrader;