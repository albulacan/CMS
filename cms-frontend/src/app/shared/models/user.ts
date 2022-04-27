export class UserModel {
    constructor(public userId: number = 0,
        public firstName: string = '',
        public middleName: string = '',
        public lastName: string = '',
        public address: string = '',
        public mobileNo: string = '',
        public emailAddress: string = '',
        public username: string = '',
        public password: string = '',
        public confirmPassword: string = '',
        public admin: boolean = false,
        public activated: boolean = false,
        public isAuthenticated: boolean = false) {
    }
}

export class OTP {
    constructor(public userId: number = 0,
        public otp: string = '',
        public emailAddress: string = '') {
    }
}