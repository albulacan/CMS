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
        public amountDue = 0,
        public amountPaid = 0,
        public status = '',
        public createdOn = '',
        
        public packages: Package[] = [],
        public menus: Menu[] = [],
        
        public clientName: string = '',
        
        public user = new UserModel()) {
    }
}