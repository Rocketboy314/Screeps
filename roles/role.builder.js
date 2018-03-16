var roleRoadFixer = require('role.road_fixer');
var general = require('role.general');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var priorities = {
            "rampart": 0,
            "constructedWall": 1,
            "extension": 2,
            "container": 3,
            "storage": 4,
            "tower": 5,
            "road": 6
        };
        if (creep.memory.building == null) creep.memory.building = true;
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.target = -1;
	        creep.memory.building = true;
	        creep.say('🚧');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        for (var i=0; i<targets.length; i++) {
	            targets[i].priority = (priorities[targets[i].structureType]*10000 +
	                    targets[i].progressTotal - targets[i].progress);
	        }
	        targets.sort(function(a,b){
	            return a.priority - b.priority;
	        });
            if(targets.length) {
                if (targets[0].structureType == STRUCTURE_RAMPART) {
                    for (var name in Game.creeps) {
                        var c = Game.creeps[name];
                        if (c.memory.role == 'wall_fixer') {
                            c.memory.rampart = targets[0].id;
                            c.memory.going = true;
                        }
                    }
                }
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#FFFF55'}});
                }
            } else {
                roleRoadFixer.run(creep);
            }
	    }
	    else {
	        general.getSource(creep);
	    }
	}
};

module.exports = roleBuilder;