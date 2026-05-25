import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UpdateUserPayload, UserData } from "../types";
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findByEmailWithPassword(email: string): Promise<User | null>;
    getHashPassword(password: string): Promise<string>;
    create({ firstName, lastName, email, pass, role, tenantId }: UserData): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        pass: string;
        role: string;
        tenantId: {
            id: number;
        } | undefined;
    } & User>;
    get(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    updateById(userId: number, userData: UpdateUserPayload): Promise<User | null>;
    delete(userId: number): Promise<import("typeorm").DeleteResult | null>;
}
//# sourceMappingURL=UserService.d.ts.map