const gamePhysics = {
    
	timeUnit: 0.02,
	gravity: 9.8,
	minSpeed: 0.01,
	maxSpeed: 5.0,
	groundFriction: 5.0,

    applyGround: function(obj, fnIfOnGround) {
		let depth = obj.geometry.parameters.depth;
		if (obj.position.z <= depth/2) {
			obj.position.z = depth/2;

			this.applyGroundFriction(obj, this.minSpeed, this.maxSpeed);
			
            if (fnIfOnGround) fnIfOnGround();
		}
    },

	applyInertia: function(obj) {
		obj.userData.velocity.z -= this.gravity * this.timeUnit;

		obj.position.addScaledVector(obj.userData.velocity, this.timeUnit);
	},

	applyGroundFriction: function(obj, minSpeed, maxSpeed) {
		obj.userData.velocity.z = 0;
		let length = obj.userData.velocity.length();
		length -= this.groundFriction * this.timeUnit;
		if (length > maxSpeed) length = maxSpeed;
		if (length < minSpeed) length = 0;
		obj.userData.velocity.setLength(length);
	},

	clampHorizontal: function(obj, min, max) {
		let width = obj.geometry.parameters.width;
		let height = obj.geometry.parameters.height;
		if (obj.position.x < min + width/2) {
			obj.position.x = min + width/2;
			if (obj.userData.velocity.x < 0) obj.userData.velocity.x = 0;
		}
		if (obj.position.x > max - width/2) {
			obj.position.x = max - width/2;
			if (obj.userData.velocity.x > 0) obj.userData.velocity.x = 0;
		}
		if (obj.position.y < min + height/2) {
			obj.position.y = min + height/2;
			if (obj.userData.velocity.y < 0) obj.userData.velocity.y = 0;
		}
		if (obj.position.y > max - height/2) {
			obj.position.y = max - height/2;
			if (obj.userData.velocity.y > 0) obj.userData.velocity.y = 0;
		}
	},
};

export default gamePhysics;
