
class Body {

	constructor() {
		this.vertexCount = 0;
		this.constraintCount = 0;

		this.vertices = [];
		this.constraints = [];
	}

	projectToAxis(axis) {
		let dotp = axis.dot(vertices[i].x, vertices[i].y);
		let min = max = dotp;

		for (let i = 1; i < vertexCount; i++) {
			dotp = axis.dot(vertices[i].x, vertices[i].y);

			min = min(dotp, min);
			max = max(dotp, max);
		}
		return [min, max];
	}
}

class CollisionInfo {
	constructor(depth, normal) {
		this.depth = depth;
		this.normal = normal;
	}
}

class PhysicsHandler {


	static detectCollision(body1, body2) {
		let minDist = 10000.0;
		for (let i = 0; i < body1.constraintCount + body2.constraintCount; i++) {
			let c;

			if (i < body1.constraintCount)
				c = body1.constraints[i];
			else
				c = body2.constraints[i - body1.constraintCount];

			let axis = createVector(e.p1.y - e.p2.y, e.p2.x - e.p1.x);
			axis.normalize();

			let mmaxA = body1.projectToAxis(axis);
			let mmaxB = body2.projectToAxis(axis);

			let dst = intervalDistance(mmaxA[0], mmaxA[1], mmaxB[0], mmaxB[1]);

			if (dst > 0)
				return false;
			else if (abs(dst) < minDist)
				minDist = abs(dst);
		}
		return true;
	}

	static intervalDistance(minA, maxA, minB, maxB) {
		if (minA < minB)
			return minB - maxA;
		else
			return minA - maxB;
	}
}