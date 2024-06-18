import { EggVariableAttributes, RawEggVariable } from "../types/user/eggVariable";
import { Server } from "./Server";
import { UserClient } from "./UserClient";

let client: UserClient
export class Variable implements EggVariableAttributes {
    readonly name: string;
    readonly description: string;
    readonly env_variable: string;
    readonly default_value: string;
    server_value: string;
    readonly is_editable: boolean;
    readonly rules: string;
    readonly parentServer: Server

    constructor(userClient: UserClient, variableProps: RawEggVariable, parentServer: Server) {
        client = userClient
        this.name = variableProps.attributes.name
        this.description = variableProps.attributes.description
        this.env_variable = variableProps.attributes.env_variable
        this.default_value = variableProps.attributes.default_value
        this.server_value = variableProps.attributes.server_value
        this.is_editable = variableProps.attributes.is_editable
        this.rules = variableProps.attributes.rules
        this.parentServer = parentServer
    }

    /**
     * Set a new value for this variable
     */
    public async setValue(value: any): Promise<void> {
        if (!this.is_editable) throw new Error("Variable is not editable")
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.parentServer.identifier + "/startup/variable");
        const res = await client.api({ url: endpoint.href, method: "PUT", data: { key: this.env_variable, value: value } }) as RawEggVariable
        this.server_value = res.attributes.server_value
    }

}