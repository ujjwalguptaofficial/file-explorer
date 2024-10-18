import { Wall } from "fortjs";

export class CorsWall extends Wall {
    async onIncoming() {

        const origin = this.request.headers.origin || '';
        this.response.setHeader('Access-Control-Allow-Origin', origin);
        this.response.setHeader("Access-Control-Allow-Headers", 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        this.response.setHeader('Access-Control-Allow-Credentials', 'true');
        this.response.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS,PATCH');
        return null;
    }

    async onOutgoing() {

    }

}    
