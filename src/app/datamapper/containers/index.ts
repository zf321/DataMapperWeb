import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    moduleId: module.id,
    selector: 'datamapper-index',
    template: '<router-outlet></router-outlet>',
})
export class DataMapperIndexComponent {
    constructor(
        public route: ActivatedRoute,
        public router: Router
    ) {
    }
}
