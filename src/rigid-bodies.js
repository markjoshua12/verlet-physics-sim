
class Body {

	constructor() {
		this.vertexCount = 0;
		this.constraintCount = 0;
		this.vertices = [];
		this.constraints = [];
		this.center = calculateVector();
		this.min = 0;
		this.max = 0;
	}

	calculateBoundingBox() {
		let minX = 99999.0, minY = 99999.0, maxX = -99999.0, maxY = -99999.0;

		for (let i = 0; i < this.vertexCount) {
			let v = this.vertices[i];

			if (v.x > maxX) maxX = p.x;
			if (v.y > maxY) maxY = p.y;
			if (v.x < minX) minX = p.x;
			if (v.y < minY) minY = p.y;
		}

		this.center.set((minX + maxX) * 0.5, (minY + maxY) * 0.5);
	}

	projectToAxis(axis) {
		let dotp = axis.dot(this.vertices[i].x, this.vertices[i].y);
		this.min = dotp;
		this.max = dotp

		for (let i = 1; i < vertexCount; i++) {
			dotp = axis.dot(this.vertices[i].x, this.vertices[i].y);

			this.min = min(dotp, this.min);
			this.max = max(dotp, this.max);
		}
	}
}

class CollisionInfo {
	constructor(depth, normal) {
		this.depth = depth;
		this.normal = normal;
	}
}

class Physics {
	constructor() {
		let depth = 0;
		let normal;
		let constraint;
		let vertex;
	}

	detectCollision(body1, body2) {
		let minDist = 10000.0;
		for (let i = 0; i < body1.constraintCount + body2.constraintCount; i++) {
			let c;

			if (i < body1.constraintCount)
				c = body1.constraints[i];
			else
				c = body2.constraints[i - body1.constraintCount];

			let axis = createVector(e.p1.y - e.p2.y, e.p2.x - e.p1.x);
			axis.normalize();

			body1.projectToAxis(axis);
			body2.projectToAxis(axis);

			let dst = intervalDistance(body1.min, body1.max,
						body2.min, body2.max);

			if (dst > 0)
				return false;
			else if (abs(dst) < minDist) {
				minDist = abs(dst);

				this.normal = axis;
				this.constraint = c;
			}
		}

		this.depth = minDist;

		if (this.constraint.body != body2) {
			let temp = body2;
			body2 = body1;
			body1 = temp;
		}

		let sign = this.normal.dot(body1.center.x - body2.center.x,
				body1.center.y - body2.center.y);

		if (sign < 0)
			this.normal.mult(-1);

		let smallestD = 10000.0;

		for (let i = 0; i < body1.vertexCount; i++) {
			let dst = this.normal.dot(body1.vertices[i].x - body2.center.x,
					body1.vertices[i].y - body2.center.y);
		}

		if (dst < smallestD) {
			smallestD = dst;
			this.vertex = body1.vertices[i];
		}

		return true;
	}

	processCollision() {
		let colVec = p5.Vector.mult(this.normal, this.depth);

		this.vertex.x += colVec.x * 0.5;
		this.vertex.y += colVec.y * 0.5;

		let p1 = this.constraint.p1;
		let p2 = this.constraint.p2;

		let T;
		if (abs(p1.x - p2.x) > abs(p1.y - p2.y))
			T = (this.vertex.x - colVec.x - p1.x) /
					(p2.x - p1.x);
		else
			T = (this.vertex.y - colVec.y - p1.y) /
					(p2.y - p1.y);

		let invT = 1 - T;
		let lambda = 1.0 / (T*T + invT * invT);

		let cx = colVec.x * 0.5 * lambda;
		let cy = colVec.y * 0.5 * lambda;

		p1.x -= cx * invT;
		p1.y -= cy * invT;
		p2.x -= cx * T;
		p2.y -= cy * T;

		this.vertex.x += colVec.x * 0.5;
		this.vertex.y += colVec.y * 0.5;
	}

	static intervalDistance(minA, maxA, minB, maxB) {
		if (minA < minB)
			return minB - maxA;
		else
			return minA - maxB;
	}
}