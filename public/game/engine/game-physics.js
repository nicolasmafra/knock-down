import * as CANNON from 'cannon';

const upVector = new CANNON.Vec3(0, 0, 1);
const contactNormal = new CANNON.Vec3();

const gamePhysics = {
    
	material: new CANNON.Material({
		friction: 0.05,
		restitution: 0.3,
	}),
	timeUnit: 0.02,
	world: null,
	gravity: 9.8,

	start: function() {
		this.world = new CANNON.World();
		this.world.gravity.set(0,0,-this.gravity);
		//this.world.broadphase = new CANNON.NaiveBroadphase();
		//this.world.solver.iterations = 10;
		/*this.world.addContactMaterial(new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
			friction: 0.1,
			restitution: 0.1,
		}));*/
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
		return contactNormal.dot(upVector) > 0.5;
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
