export class Package {
    constructor(public packageId: number = 0,
        public name: string = '',
        public description: string = '',
        public pax: number = 0,
        public menu: number = 0,
        public addsOn: string = '',
        public price: number = 0,
        public deleted: boolean = false,
        public optionals: Optional[] = [],
        public selected: boolean = false) {
    }
}

export class Optional {
    constructor(public optionId: number = 0,
        public packageId: number = 0,
        public description: string = '',
        public price: number = 0,
        public reservationPackageId: number = 0,
        public checked: boolean = false) {
    }
}