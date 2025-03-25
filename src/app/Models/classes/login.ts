export class Login{
    EmailId:string='';
    Password:string='';

    constructor() {
        this.EmailId='';
        this.Password=''
    }
}

export class SignUp{
    UserName:string='';
    EmailId:string='';
    Mobile:string='';
    Password:string=''

    constructor(){
        this.UserName='';
        this.EmailId='';
        this.Mobile='';
        this.Password=''
    }
}

export interface LoginResponse {
    message: string;
}

