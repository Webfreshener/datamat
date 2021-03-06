import {Model} from "./index";
import {default as deepEqual} from "deep-equal";
import {
    stringsCollection,
    stringsMinMaxCollection,
    objectCollection, objectCollectionDefaults
} from "../../fixtures/ItemsModel.schemas";
import {BaseModel} from "./base-model";

describe("ItemsModel Class Suite", function () {

    describe("Simple ItemsModel Tests", () => {
        beforeEach(() => {
            this.owner = new Model({schemas: [stringsCollection]});
        });

        describe("LifeCycle: Instantiation", () => {
            it("should initialize a schema and a schema object", () => {
                expect(this.owner.model.$model).toBeDefined();
                expect(this.owner.model.$model instanceof BaseModel).toBe(true);
            });

            it("should not initialize a invalid schema and schema object", () => {
                let badSchema = Object.assign({}, stringsCollection, {
                    items: [{type: "INVALID"}],
                });
                expect(() => new Model({schemas: [badSchema]})).toThrow();
            });
        });

        describe("ItemsModel LifeCycle: Creation", () => {

            let _d;

            it("should populate with valid data and make that data accessible", (done) => {
                _d = ["abc", "def", "ghi"];
                let _cnt = 0;

                this.owner.subscribe({
                    next: (m) => {
                        _cnt++;
                        expect(deepEqual(this.owner.model, _d)).toBe(true);
                    },
                    error: done,
                });

                setTimeout(() => {
                    expect(_cnt).toEqual(1);
                    done();
                }, 100);

                this.owner.model = _d;
            });

            it("should reject invalid data and leave model pristine", () => {
                _d = [99, 100, 101];

                this.owner.model = _d;
                expect(deepEqual(this.owner.model, {})).toBe(true);
            });
        });
    });

    describe("Nested Elements Tests", () => {
        beforeEach(() => {
            this.owner = new Model({schemas: [objectCollection]});
        });

        describe("LifeCycle: Instantiation", () => {
            it("should initialize a valid schema and a schema object", () => {
                expect(this.owner.model.$model).toBeDefined();
                expect(this.owner.model.$model instanceof BaseModel).toBe(true);
                expect(this.owner.model.$model).toBeDefined();
                expect(this.owner.model.$model instanceof BaseModel).toBe(true);
            });
        });

        describe("ItemsModel LifeCycle: Nested Create", () => {

            let _d;

            it("should populate with valid data and make that data accessible", (done) => {
                _d = [{
                    name: "Item A",
                    value: 1,
                }, {
                    name: "Item B",
                }, {
                    name: "Item C",
                    value: 2,
                }];

                let _cnt = 0;

                this.owner.subscribe({
                    next: (m) => {
                        _cnt++;
                    },
                    error: done,
                });

                setTimeout(() => {
                    expect(_cnt).toEqual(1);
                    done();
                }, 100);

                this.owner.model = _d;
                // expect(deepEqual(this.owner.model, _d)).toBe(true);
            });

            it("should reject invalid data and leave model pristine", () => {
                _d = [{
                    name: 123,
                    value: 1,
                }, {
                    value: "Item B",
                }, {
                    value: 2,
                }];

                this.owner.model = _d;
                expect(typeof this.owner.errors).toBe("object");
                expect(deepEqual(this.owner.model, [])).toBe(true);
            });
        });

        describe("LifeCycle: Update", () => {

            let _d;

            it("should update nested models with valid data and pass validation", () => {
                _d = [{
                    name: "Item A",
                    value: 1,
                }, {
                    name: "Item B",
                }, {
                    name: "Item C",
                    value: 2,
                }];

                this.owner.model = _d;

                this.owner.model[1] = {
                    name: "Item B",
                    value: 3
                };

                expect(this.owner.errors).toBe(null);
                expect(this.owner.model[1]).toEqual({name: "Item B", value: 3});
            });

            it("should updated properties in nested objects with valid data and pass validation", () => {
                _d = [{
                    name: "Item A",
                    value: 1,
                }, {
                    name: "Item B",
                }, {
                    name: "Item C",
                    value: 2,
                }];

                this.owner.model = _d;

                this.owner.model[1].value = 3;


                expect(this.owner.errors).toBe(null);
                expect(this.owner.model[1]).toEqual({name: "Item B", value: 3});
            });
        });

        describe("LifeCycle: Delete", () => {
            beforeEach(() => {
                this.owner = new Model({schemas: [stringsMinMaxCollection]});
            });

            let _d = ["Item A", "Item B", "Item C"];

            it("should allow deletion of nested properties that are not required", () => {
                this.owner.model = _d;
                delete this.owner.model[1];
                expect(this.owner.errors).toBe(null);
                expect(this.owner.model.length).toBe(2);
            });

            it("should prevent deletion of nested properties that are required", () => {
                this.owner.model = _d;
                delete this.owner.model[0];
                delete this.owner.model[1];
                delete this.owner.model[2];
                expect(typeof this.owner.errors).toBe("object");
                expect(this.owner.model.length).toBe(1);
            });
        });

        describe("LifeCycle: Reset", () => {
            beforeEach(() => {
                this.owner = new Model({schemas: [objectCollection]});
            });

            it("should notifiy subsequent validations", () => {
                const _d = [{
                    name: "Item A",
                    value: 1,
                }, {
                    name: "Item B",
                }, {
                    name: "Item C",
                    value: 2,
                }];

                this.owner.model = _d;

                setTimeout(() => {
                    this.owner.subscribe({
                        next: (m) => {
                            expect(m.models.length).toEqual(3);
                            done()
                        },
                        error: done,
                    });

                    this.owner.model = _d;
                }, 100);
            });
        });


    });

    describe("Array Prototype method tests", () => {
        beforeEach(() => {
            this.owner = new Model({schemas: [stringsMinMaxCollection]});
            this.owner.model = ["Item A", "Item B", "Item C"];
        });

        it("should fill with validation", () => {
            this.owner.model.fill(["Item A", "Item B", "Item C", "Item D"]);
            expect(typeof this.owner.errors).toBe("object");
            expect(this.owner.model.length).toBe(3);
        });

        it("should pop with validation", () => {
            this.owner.model.pop();
            this.owner.model.pop();
            this.owner.model.pop();
            expect(typeof this.owner.errors).toBe("object");
            expect(this.owner.model.length).toBe(1);
        });

        it("should push with validation", () => {
            this.owner.model.push("Item D");
            expect(typeof this.owner.errors).toBe("object");
            expect(this.owner.model.length).toBe(3);
            expect(this.owner.model[2]).toBe("Item C");
        });

        it("should shift with validation", () => {
            this.owner.model.shift();
            this.owner.model.shift();
            this.owner.model.shift();
            expect(typeof this.owner.errors).toBe("object");
            expect(this.owner.model.length).toBe(1);
        });

        it("should splice with validation", () => {
            // remove all..
            this.owner.model.splice(0, -1);
            expect(typeof this.owner.errors).toBe("object");
            expect(this.owner.model.length).toBe(3);
            // append element...
            this.owner.model.splice(0, 0, "Item D");
            expect(typeof this.owner.errors).toBe("object");
            expect(this.owner.model.length).toBe(3);
        });

        it("should unshift with validation", () => {
            this.owner.model.unshift("Item Z");
            expect(typeof this.owner.errors).toBe("object");
            expect(this.owner.model.length).toBe(3);
        });
    });

    describe("Default Values", () => {
        it("should apply defaults to items", () => {
            this.owner = new Model({schemas: [objectCollectionDefaults]}, {ajvOptions: {useDefaults: true}});
            this.owner.model = [{}];
            expect(this.owner.model[0]).toEqual({name: "abc"});
        });
    });

    describe("Model Class methods ", () => {

        it("should not reset if it would invalidate model", () => {
            const _owner = new Model({schemas: [stringsMinMaxCollection]});
            _owner.model = ["Item A", "Item B", "Item C"];
            expect(_owner.model.length).toBe(3);
            _owner.model.$model.reset();
            expect(_owner.model.length).toBe(3);
        });

        it("should reset it's collection if allowed", () => {
            const _owner = new Model({schemas: [stringsCollection]});
            _owner.model = ["Item A", "Item B", "Item C"];
            _owner.model = ["Item A", "Item B", "Item C"];
            expect(_owner.model.length).toBe(3);
            _owner.model.$model.reset();
            expect(_owner.model.length).toBe(0);
        });

        it("should quietly validate data with the validate method", () => {
            const _owner = new Model({schemas: [stringsCollection]});
            expect(_owner.model.$model.validate([1, 2, 3])).toBe("data/0 should be string");
            expect(_owner.model.$model.validate(["1", "2", "3"])).toBe(true);
        });

        it("should freeze it's model", () => {
            const _owner = new Model({schemas: [stringsCollection]});
            _owner.model = ["Item A", "Item B", "Item C"];
            _owner.model.$model.freeze();
            expect(_owner.model.$model.isFrozen).toBe(true);
            _owner.model = ["1", "2", "3"];
            expect(deepEqual(_owner.model, ["Item A", "Item B", "Item C"])).toBe(true);
        });

        it("should freeze it's model hierarchy", () => {
            const _owner = new Model({schemas: [objectCollection]});
            const _orig = [{
                name: "My Name",
                active: true,
            }];

            _owner.model = _orig;
            _owner.model.$model.freeze();

            expect(() => _owner.model[0].name = "Other Name")
                .toThrow("model path \"root#/items\" is non-configurable and non-writable");
        });
    });
});
