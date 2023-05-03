import * as CANNON from 'cannon';

const contactNormal = new CANNON.Vec3();

const gamePhysics = {
    
	upVector: new CANNON.Vec3(0, 0, 1),
	material: new CANNON.Material({
		friction: 0.03,
		restitution: 0.4,
	}),
	timeUnit: 0.02,
	world: null,
	gravity: 9.8,

	start: function() {
		this.world = new CANNON.World();
		this.world.gravity.set(0,0,-this.gravity);
	},

	update: function() {
		this.world.bodies.forEach(body => {
			const userData = body.userData;
			if (userData && userData.mesh && body.type != CANNON.Body.STATIC) {
				this.updateMesh(userData);
			}
		});
		this.world.step(this.timeUnit);
	},

	updateMesh: function(object) {
		object.mesh.position.copy(object.body.position);
		object.mesh.quaternion.copy(object.body.quaternion);
	},

	findContact: function(bodyA, bodyB) {
		return this.world.contacts
			.find(contact => contact.bi.id == bodyA.id && contact.bj.id == bodyB.id
				|| contact.bi.id == bodyB.id && contact.bj.id == bodyA.id);
	},

	inContact: function(contact, body) {
		if (contact.bi.id === body.id) {
			return contact.bj;
		} else {
			return contact.bi;
		}
	},

	bodyIsOver: function(contact, body) {
		if (contact.bi.id === body.id) {
			contact.ni.negate(contactNormal)
		} else {
			contactNormal.copy(contact.ni)
		}
		return contactNormal.dot(this.upVector) > 0.5;
	},

	clampHorizontalVelocity: function(body, max) {
		const x = body.velocity.x;
		const y = body.velocity.y;
		const v2 = x*x + y*y;
		if (v2 < max * max) return;

		const ratio = Math.sqrt(v2) / max;
		body.velocity.x /= ratio;
		body.velocity.y /= ratio;
	},
};

export default gamePhysics;
