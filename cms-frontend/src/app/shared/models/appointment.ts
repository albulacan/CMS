import { Reservation } from "./reservation";
import { UserModel } from "./user";

export class Appointment {
    constructor(public appointmentId: number = 0,
        public referenceNo: string = '',
        public date: string = '',
        public time: string = '',
        public userId: number = 0,
        public user: UserModel = new UserModel(),
        public reservation: Reservation = new Reservation(),
        public createdOn = '') {
    }
}