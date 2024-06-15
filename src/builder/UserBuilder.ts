export class UserBuilder {
    private email: string;
    private username: string;
    private first_name: string;
    private last_name: string;
    private password?: string 
    private root_admin?: number 
    constructor() {
        this.email = '';
        this.username = '';
        this.first_name = '';
        this.last_name = '';
        this.root_admin = 0;
    }
    /**
     * The email address of the user
     * Must be valid & unique!
     * @required
     */
    public setEmail(email: string): UserBuilder {
        this.email = email;
        return this;
    }
    /**
     * The username of the user
     * Must be unique!
     * @required
     */
    public setUsername(username: string): UserBuilder {
        this.username = username;
        return this;
    }
     /**
     * The first name of the user
     * @required
     */
    public setFirstName(first_name: string): UserBuilder {
        this.first_name = first_name;
        return this;
    }
    /**
     * The last name of the user
     * @required
     */
    public setLastName(last_name: string): UserBuilder {
        this.last_name = last_name;
        return this;
    }
    /**
     * The password for a user
     * If unset, the user will receive a setup email
     * @optional
     */
    public setPassword(password: string): UserBuilder {
        this.password = password;
        return this;
    }
    /**
     * Should the user be an administrator
     * @optional
     */
    public setAdmin(admin: boolean): UserBuilder {
        this.root_admin = admin ? 1 : 0;
        return this;
    }
}