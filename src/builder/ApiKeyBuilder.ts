export class ApiKeyBuilder {

    description: string
    allowed_ips: Array<string> = []

    constructor() {
        this.description = ''
    }

    /**
     * Add a ip that is allowed to use this api key
     */
    addAllowedIp(ip: string): ApiKeyBuilder {
        this.allowed_ips.push(ip)
        return this
    }

    /**
     * Set which ip addresses are allowed to use this api key
     */
    setAllowedIps(ips: Array<string>): ApiKeyBuilder {
        this.allowed_ips = ips
        return this
    }

    /**
     * Set the description of this api key
     */
    setDescription(description: string): ApiKeyBuilder {
        this.description = description
        return this
    }

}