import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../enum/role";
import { Neo4jService } from "nest-neo4j/dist";
import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import { verifySession } from "supertokens-node/recipe/session/framework/express";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
		private readonly neo4jService: Neo4jService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) {
      return true;
    }

		const ctx = context.switchToHttp();
    let err = undefined;
    const req = ctx.getRequest();
		const res = ctx.getResponse();
		await superTokensNextWrapper(
			async (next) => {
					await verifySession()(req, res, next);
			},
			req,
			res
		);
		let userId = req.session!.getUserId();

		const roles = await this.roles(userId);
		console.log(roles);
    return requireRoles.some((role) => roles.includes(role));
  }

	async roles(userId): Promise<string[]> {
		const res = await this.neo4jService.read(
			`
			MATCH (p:Person { id: $userId })-[r:WORKS_AT { default: true }]->(o:Organization)
			RETURN r.role
			`,
			{ userId },
		);
		return res.records.length ? res.records[0].get('r.role') : [];
	}
}
