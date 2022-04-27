import { SafeResourceUrl } from "@angular/platform-browser";

export class Menu {
    constructor(public menuId: number = 0,
        public name: string = '',
        public description: string = '',
        public category: string = '',
        public price: number = 0,
        public image: string = '',
        public fileName: string = '',
        public extension: string = '',
        public deleted: boolean = false,
        public imagePath: SafeResourceUrl = '',
        public quantity: number = 0) {
    }
}