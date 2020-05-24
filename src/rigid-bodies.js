
class Physics {
	constructor() {
		this.depth = 0;
		this.normal = createVector();
		this.constraint;
		this.body;
		this.vertex = createVector();
	}

	detectCollision(body1, body2) {
		let minDist = 10000.0;
		for (let i = 0; i < body1.constraintCount + body2.constraintCount; i++) {
			let c;

			if (i < body1.constraintCount)
				c = body1.constraints[i];
			else
				c = body2.constraints[i - body1.constraintCount];

			let axis = createVector(c.p1.y - c.p2.y, c.p2.x - c.p1.x);
			axis = axis.normalize();

			body1.projectToAxis(axis);
			body2.projectToAxis(axis);

			let dst = Physics.intervalDistance(body1.min, body1.max,
						body2.min, body2.max);

			if (dst > 0)
				return false;
			else if (abs(dst) < minDist) {
				minDist = abs(dst);

				this.normal = axis;
				this.constraint = c;
				this.body = i < body1.constraint ? body1 : body2;
			}
		}

		this.depth = minDist;

		if (this.body != null && this.body != body2) {
			let temp = body2;
			body2 = body1;
			body1 = temp;
		}

		let sign = this.normal ? this.normal.dot(body1.center.x - body2.center.x,
				body1.center.y - body2.center.y) : 0;

		if (sign < 0)
			this.normal.mult(-1);

		let smallestD = 10000.0;
		let dst;

		for (let i = 0; i < body1.vertexCount; i++) {
			dst = this.normal.dot(body1.vertices[i].x - body2.center.x,
					body1.vertices[i].y - body2.center.y);

			if (dst < smallestD) {
				smallestD = dst;
				this.vertex = body1.vertices[i];
			}
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

		let invT = 1.0 - T;
		let lambda = 1.0 / (T * T + invT * invT);

		let hcx = colVec.x * 0.5;
		let hcy = colVec.y * 0.5;
		let lcx = hcx * lambda;
		let lcy = hcy * lambda;

		p1.x -= lcx * invT;
		p1.y -= lcy * invT;
		p2.x -= lcx * T;
		p2.y -= lcy * T;

		this.vertex.x += hcx;
		this.vertex.y += hcy;
	}

	static intervalDistance(minA, maxA, minB, maxB) {
		if (minA < minB)
			return minB - maxA;
		else
			return minA - maxB;
	}
}

class Body {

	constructor() {
		this.vertexCount = 0;
		this.constraintCount = 0;
		this.vertices = [];
		this.constraints = [];
		this.center = createVector();
		this.min = 0;
		this.max = 0;
	}

	calculateBBox() {
		let minX = 99999.0,
			minY = 99999.0,
			maxX = -99999.0,
			maxY = -99999.0;

		for (let i = 0; i < this.vertexCount; i++) {
			let v = this.vertices[i];

			if (v.x > maxX) maxX = v.x;
			if (v.y > maxY) maxY = v.y;
			if (v.x < minX) minX = v.x;
			if (v.y < minY) minY = v.y;
		}

		this.center.set((minX + maxX) * 0.5, (minY + maxY) * 0.5);
	}

	projectToAxis(axis) {
		let dotp = axis.dot(this.vertices[0].x, this.vertices[0].y);
		this.min = dotp;
		this.max = dotp;

		for (let i = 1; i < this.vertexCount; i++) {
			dotp = axis.dot(this.vertices[i].x, this.vertices[i].y);

			this.min = min(dotp, this.min);
			this.max = max(dotp, this.max);
		}
	}
}