# Angular testing notes

Demo application: https://github.com/joeeames/PSAngularUnitTestingCourse

(modified Tour of Heroes)

## Overview

### Automated Testing

- Unit Testing - test a "unit" (generally per class)
- End to End Testing - against live running application.  Automating the browser.
- Integration/Functional Testing - More than unit, less than the complete application

### Mocking

- Ensures only testing one unit of code at a time.
- e.g., injected service into component. Use a mock for the service
- Types of mocks:
    - Dummies - simple object
    - Stubs - controllable behavior
    - Spies - keeps track of method calls, etc.
    - True mocks - verify they were used in a specific way
    
### Unit Tests in Angular
- Isolated test - exercise a single unit of code (generally just the class)
- Integration - more complex. Test in the context of an Angular module
    - Shallow - only test single component
    - Deep - parent and child
    
### Tools of Angular Unit Testing
- Karma - test runner
- Jasmine - used to create mocks and expectations
- Other - Jest (from Facebook), Mocha, Chai (Jasmine replacement), Sinon/TestDouble (mocking framework), Wallaby (paid), Cypress (end-to-end)


### Create first test

create the file with the `.spec.ts` extension - tells karma that this is a test spec.

`Describe(<desciptor>: string, <callback function>)` function - allows tests to be grouped together
``` javascript
describe('my first test', () => {

});

```
`let sut;` - variable declared in the test 

`BeforeEach(<callbackFunction>)` - resets the state of your test, eliminates pollution
```javascript
beforeEach(() => {
        sut = {}
    })
```

`It(<descriptor>:string, <callback function>)` - represents a test
```javascript
it('should be true if true', () => {
        //arrange
        sut.a = false;

        //act
        sut.a = true;

        //assert
        expect(sut.a).toBe(true);
    });
```
Unit Tests should follow the AAA (arrange, act, assert) pattern

Completed first test:
```javascript
describe('my first test', () => {
    let sut; //statement under test

    beforeEach(() => {
        sut = {}
    });

    it('should be true if true', () => {
        //arrange
        sut.a = false;

        //act
        sut.a = true;

        //assert
        expect(sut.a).toBe(true);
    });
});
```

### Running Tests

`ng test` or `npm test`

outputs to Powershell and also opens a Karma browser tab - you can leave this open and it will automatically detect new tests and run them

### Writing Good Unit Tests

- Structuring Tests
    - AAA - Arrange - set the state, Act - change the state, Assert - ensure state change
    - DRY - Don't Repeat Yourself - Remove duplication
    - DAMP - Repeat yourself if necessary - A good test should tell a story. The complete story should be in the `It()` function. Should not have to look around a lot to understand the test.
        - Techniques:
            - Move less interesting set up into the `BeforeEach()` function.
            - Keep critical setup in the `it()` function. Duplication is OK if it helps tell the story of the test.
            - Include Arrange, Act, Assert within the `it()` function.
            
## Isolated Unit Tests
### Testing a pipe

Create `.spec.ts` along side the class being tested

Example of a pipe test
```javascript
import { StrengthPipe } from "./strength.pipe";

describe('StrengthPipe', () => {
    it('should display weak if strength is 5', () => {
        //arrange
        let pipe = new StrengthPipe();

        //act, assert
        expect(pipe.transform(5)).toEqual('5 (weak)');
    });

    it('should display strong if strength is 10', () => {
        //arrange
        let pipe = new StrengthPipe();

        //act, assert
        expect(pipe.transform(10)).toEqual('10 (strong)');
    });

    it('should display unbelievable if strength is 21', () => {
        //arrange
        let pipe = new StrengthPipe();

        //act, assert
        expect(pipe.transform(21)).toEqual('21 (unbelievable)');
    });
});
```

### Testing a Service

Create `.spec.ts` along side the class being tested

Example of a service test:
```javascript
import { MessageService } from "./message.service";

describe('MessageService',() => {
    let service: MessageService;

    it('should have no messages to start', () => {
        service = new MessageService();

        expect(service.messages.length).toBe(0);
    });

    it('should add a message when add is called', () => {
        service = new MessageService();

        service.add('message 1');
        
        expect(service.messages.length).toBe(1);
    })

    it('should remove all messages when clear is called', () => {
        service = new MessageService();
        service.add('message 1');
        
        service.clear();
        
        expect(service.messages.length).toBe(0);
    })
});
```

### Using a Mock
Use `jasmine.createSpyObj()` to mock a service, and pass in the service functions to mock.

Example of creating a mock service: `mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);`

If the service function uses `subscribe`, use the following `.and.returnValue(of(true))` - the `of(true)` returns a true subscription. (Import from `rxjs`)

Example of mocking the subscription: `mockHeroService.deleteHero.and.returnValue(of(true));`

To ensure that a function was called on the mock with a specific parameter, use `.toHaveBeenCalledWith(<paramter value>)`

Example of an `ensure` for a mock function call: `expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);`

### Testing a Component

Create `.spec.ts` along side the class being tested

Example of component test (with mocked service):
```javascript
import { HeroesComponent } from "./heroes.component";
import { of } from "rxjs";

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            {id: 1, name:'SpiderDude', strength:8 },
            {id:2, name:'Wonderful Woman', strength: 24},
            {id:3, name:'SuperDude', strength: 55}
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        component = new HeroesComponent(mockHeroService);

    });

    describe('delete', () => {
        it('should remove the indicated hero from the heroes list', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            expect(component.heroes.length).toBe(2);
        });

        it('should call deleteHero with the correct hero', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
        });
    });
});
```

## Debugging Techniques

- Open developer tools (console) in the Karma web browser
- modify package.json, change `"tests"` from `ng test` to `ng test --source-map=false`

## Shallow Integration Tests

Only test a single component and none of it's child components or directives

Create `.spec.ts` along side the class being tested

### Test Bed

`TestBed` - test component and template running together.  Creates a testing module (similar to app.module).  Using `TestBed.createComponent(<component>)` returns a fixture of type `ComponentFixture<component>`.  Your tests can then access the component's properties and methods using `fixture.componentInstance`

Use `schemas: [NO_ERRORS_SCHEMA]` in the `TestBed` declaration to ignore errors from unknown attributes or element in the html template.  Do not over-use this because it can hide real problems.  Only if completely necessary.

Example of a TestBed:
```javascript
beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroComponent);
    });
```

### Testing Rendered HTML

Use `fixture.nativeElement.querySelector('<element>').textContent` to access a particular DOM element

Use the `toContain()` assertion, so that minor changes to the element don't break the test. For example: `expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');`


### NativeElement versus DebugElement

`nativeElement` exposes the classic DOM API

`debugElement` is a wrapper around a DOM node to access to the root element of the template.  `fixture.debugElement.query(By.css('a'))`.  Can use `jQuery` like selectors - e.g. `.class`, `#id`, etc.  Debug element can get a handle on a directive.

One Example of a Shallow Integration Test:
```javascript
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { HeroComponent } from "./hero.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

describe ('Hero Component (shallow tests)', () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name:'SuperDude', strength:3 };

        expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
    });

    it('should render the hero name in an anchor tag', () => {
        fixture.componentInstance.hero = { id: 1, name:'SuperDude', strength:3 };
        fixture.detectChanges();

        let debugElementAnchor = fixture.debugElement.query(By.css('a'));
        expect(debugElementAnchor.nativeElement.textContent).toContain('SuperDude');

        // expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
    });
});
```

### More Complex Shallow Testing

Components with child components and service injection

### Mocking an injected service

services are registered with a module in the providers array

Use the long hand to injust a mock service into the component `{provide: <service>, useValue: <mock service>}`.

```javascript
mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

TestBed.configureTestingModule({
            declarations: [HeroesComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
```

### Mocking Child Components

create mock child component - since shallow tests, do not want to test the child component.

Can create a fake component by importing the `@Component` directive - and add it to the TestBed declarations

Example of a fake component:
```javascript
@Component({
        selector: 'app-hero',
        template: '<div></div>'
      })
      class FakeHeroComponent {
        @Input() hero: Hero;
        // @Output() delete = new EventEmitter();
      }
      
      .
      .
      .
      
      //Test Bed config:
      TestBed.configureTestingModule({
            declarations: [HeroesComponent, FakeHeroComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService}
            ]
        });
```

### Lists of Components

Should use the template in a good integration test and verify that DOM elements are being specified correctly.

Use the `queryAll()` function off of the `debugElement` for counting LIs for example: `expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);`

A more complicated example of a Shallow Integration Test:
```javascript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { NO_ERRORS_SCHEMA, Component, Input } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

describe('HeroesComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    @Component({
        selector: 'app-hero',
        template: '<div></div>'
      })
      class FakeHeroComponent {
        @Input() hero: Hero;
        // @Output() delete = new EventEmitter();
      }
      
    beforeEach(() => {
        HEROES = [
            {id: 1, name:'SpiderDude', strength:8 },
            {id:2, name:'Wonderful Woman', strength: 24},
            {id:3, name:'SuperDude', strength: 55}
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent, 
                FakeHeroComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService}
            ]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should set heroes correctly from the service', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges(); //fire ngOnInit()

        expect(fixture.componentInstance.heroes.length).toBe(3);
    });

    it('should create one li for each hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges(); //fire ngOnInit()

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    })
});
```

## Deep Integration Tests

Test components with their live children

### Finding elements by directive

`const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));` will return a pointer to each of the `<app-hero>` nodes.

example of asserting against a list of child components:
```javascript
it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        //run ngOnInit()
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toEqual(3);
        for (let i = 0; i < heroComponentDEs.length; i++){
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });
```

### Integration testing of services

Angular has a special mocking service for `http`.  In order to use it, use the following import: `import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";`

Import the ClientTestingModule into the `TestBed` as follows:
```javascript
TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                HeroService,
                { provide: MessageService, useValue: mockMessageService }
            ]
        });
```



To get an instance to a service used in the TestBed, use `Testbed.get(<service-type>)`

Example:
```javascript
httpTestingController = TestBed.get(HttpTestingController);
```

### Implementing a test with Mocked HTTP

Get a handle to a service, using `inject([array of services], (callback to get service))`

Example:
```javascript
describe('GetHero', () => {
        it('should call get with the correct url', 
            inject([HeroService, HttpTestingController],  
                (service: HeroService, controller: HttpTestingController) => {
            
            service.getHero(4).subscribe();
        }));
    });
```

It is cleaner to use the first method of getting a handle to the service using `Testbed.get(<service-type>)`.  It makes the tests easier to read.

Example of testing HTTP Mock:
```javascript
import { TestBed, inject } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('HeroService', () => {
    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let service: HeroService;

    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(['add']);

        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                HeroService,
                { provide: MessageService, useValue: mockMessageService }
            ]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(HeroService);

    });

    describe('GetHero', () => {
        it('should call get with the correct url', () => {
            
            service.getHero(4).subscribe(); //send request

            const req = httpTestingController.expectOne('api/heroes/4'); //expect request
            req.flush({ id: 4, name: 'SuperDude', strength: 100 }); //tell it what to return
            httpTestingController.verify(); //verify no unexpected requests were made
        });
    });
});
```

## Testing DOM Interaction and Routing Components

## Triggering events on elements

Find all child component directives using the debugElement's `queryAll(By.Directive(<directive name>))`

For example:
```javascript
const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
```

Trigger an event on an element using `.triggerEventHandler(<event name>, <event object>)`

For example:
```javascript
heroComponents[0].query(By.css('button'))
                .triggerEventHandler('click', {stopPropagation: () => {}})
```

`spyOn(<component>, <method)>` - a jasmine object that allows you to spy on a component's method and ensure envovation.  For example,
```javascript
spyOn(fixture.componentInstance, 'delete');
```

Example of testing trigger of event on child component:
```javascript
it(`should call heroService.deleteHero when the Hero Component's 
    delete button is clicked`,() => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponents[0].query(By.css('button'))
            .triggerEventHandler('click', {stopPropagation: () => {}});

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
});
```

## Emitting events from children

Instead of clikcing the button on the child in the test, we can raise the event from the child.

Example of emitting event from a child component:
```javascript
const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
(<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);
```

