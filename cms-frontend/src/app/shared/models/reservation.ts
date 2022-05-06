import { Menu } from "./menu";
import { Package } from "./package";
import { UserModel } from "./user";

export class Reservation {
    constructor(public reservationId = 0,
        public referenceNo = '',
        public userId = 0,
        public date = '',
        public time = '',
        public pax = 0,
        public venue = '',
        public occasion = '',
        public tableService = '',
        public motif = '',
        public theme = '',
        public paymentOption = '',
        public paymentMethod = '',
        public amountDue = 0,
        public amountPaid = 0,
        public status = '',
        public createdOn = '',
        public appointmentDate = '',
        
        public packages: Package[] = [],
        public menus: Menu[] = [],
        public payments: Payment[] = [],
        
        public clientName: string = '',
        
        public user = new UserModel()) {
    }
}

export class Payment {
    constructor(public paymentId: number = 0,
        public reservationId: number = 0,
        public amount: number = 0,
        public fileName: string = '',
        public attachment: string = '',
        public createdOn: string = '') {
    }
}