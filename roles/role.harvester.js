var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var priorities = {
            "extension": 0,
            "spawn": 1,
            "container": 2
        };
        if(creep.memory.doneDepositing == undefined || creep.carry.energy == 0)
            creep.memory.doneDepositing = true;
	    if(creep.carry.energy < creep.carryCapacity && creep.memory.doneDepositing) {
            var sources = creep.room.find(FIND_SOURCES, {
                filter: (source) => {
                    return source.energy > 0;
                }
            });
            if (creep.memory.target == -1 || creep.memory.target == undefined) {
                creep.memory.target = Math.floor(Math.random()*2);
                creep.say("Source: " + creep.memory.target);
            }
            if(creep.harvest(sources[creep.memory.target]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.target], {visualizePathStyle: {stroke: '#55FF55'}});
            }
        }
        else {
            creep.memory.doneDepositing = false;
            creep.memory.target = -1;
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                for (var i=0; i<targets.length; i++) {
    	            targets[i].priority = priorities[targets[i].structureType] * 1000 +
    	                Math.ceil(Math.sqrt(Math.pow(targets[i].pos.x - creep.pos.x),2 + 
    	                Math.pow(targets[i].pos.y - creep.pos.y),2));
    	        }
    	        targets.sort(function(a,b){
    	            return a.priority - b.priority;
    	        });
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#5555FF'}});
                }
            } else {
                creep.say("New Stuff!");
            }
        }
	}
};

module.exports = roleHarvester;