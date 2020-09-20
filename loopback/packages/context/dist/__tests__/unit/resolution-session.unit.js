"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const resolution_session_1 = require("../../resolution-session");
describe('ResolutionSession', () => {
    let MyController = class MyController {
        constructor(b) {
            this.b = b;
        }
    };
    MyController = tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('b')),
        tslib_1.__metadata("design:paramtypes", [String])
    ], MyController);
    function givenInjection() {
        return {
            target: MyController,
            bindingSelector: 'b',
            methodDescriptorOrParameterIndex: 0,
            metadata: {},
        };
    }
    let session;
    beforeEach(() => {
        session = new __1.ResolutionSession();
    });
    it('tracks bindings', () => {
        const binding = new __1.Binding('a');
        session.pushBinding(binding);
        testlab_1.expect(session.currentBinding).to.be.exactly(binding);
        testlab_1.expect(session.bindingStack).to.eql([binding]);
        testlab_1.expect(session.popBinding()).to.be.exactly(binding);
    });
    it('tracks injections', () => {
        const injection = givenInjection();
        session.pushInjection(injection);
        testlab_1.expect(session.currentInjection).to.be.exactly(injection);
        testlab_1.expect(session.injectionStack).to.eql([injection]);
        testlab_1.expect(session.popInjection()).to.be.exactly(injection);
    });
    it('popBinding() reports error if the top element is not a binding', () => {
        const injection = givenInjection();
        session.pushInjection(injection);
        testlab_1.expect(session.currentBinding).to.be.undefined();
        testlab_1.expect(() => session.popBinding()).to.throw(/The top element must be a binding/);
    });
    it('popInjection() reports error if the top element is not an injection', () => {
        const binding = new __1.Binding('a');
        session.pushBinding(binding);
        testlab_1.expect(session.currentInjection).to.be.undefined();
        testlab_1.expect(() => session.popInjection()).to.throw(/The top element must be an injection/);
    });
    it('tracks mixed bindings and injections', () => {
        const bindingA = new __1.Binding('a');
        session.pushBinding(bindingA);
        const injection = givenInjection();
        session.pushInjection(injection);
        const bindingB = new __1.Binding('b');
        session.pushBinding(bindingB);
        testlab_1.expect(session.currentBinding).to.be.exactly(bindingB);
        testlab_1.expect(session.bindingStack).to.eql([bindingA, bindingB]);
        testlab_1.expect(session.currentInjection).to.be.exactly(injection);
        testlab_1.expect(session.injectionStack).to.eql([injection]);
        testlab_1.expect(session.getBindingPath()).to.eql('a --> b');
        testlab_1.expect(session.getInjectionPath()).to.eql('MyController.constructor[0]');
        testlab_1.expect(session.getResolutionPath()).to.eql('a --> @MyController.constructor[0] --> b');
        testlab_1.expect(session.toString()).to.eql('a --> @MyController.constructor[0] --> b');
        testlab_1.expect(session.popBinding()).to.be.exactly(bindingB);
        testlab_1.expect(session.popInjection()).to.be.exactly(injection);
        testlab_1.expect(session.popBinding()).to.be.exactly(bindingA);
    });
    describe('fork()', () => {
        it('returns undefined if the current session does not exist', () => {
            testlab_1.expect(__1.ResolutionSession.fork(undefined)).to.be.undefined();
        });
        it('creates a new session with the same state as the current one', () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            session1.pushInjection(injection);
            const bindingB = new __1.Binding('b');
            session1.pushBinding(bindingB);
            const session2 = __1.ResolutionSession.fork(session1);
            testlab_1.expect(session1).not.to.be.exactly(session2);
            testlab_1.expect(session1.stack).not.to.be.exactly(session2.stack);
            testlab_1.expect(session1.stack).to.be.eql(session2.stack);
            const bindingC = new __1.Binding('c');
            session2.pushBinding(bindingC);
            testlab_1.expect(session2.currentBinding).to.be.exactly(bindingC);
            testlab_1.expect(session1.currentBinding).to.be.exactly(bindingB);
        });
    });
    describe('runWithBinding()', () => {
        it('allows current session to be undefined', () => {
            const bindingA = new __1.Binding('a');
            const val = __1.ResolutionSession.runWithBinding(() => 'ok', bindingA);
            testlab_1.expect(val).to.eql('ok');
        });
        it('allows a promise to be returned', async () => {
            const bindingA = new __1.Binding('a');
            const val = await __1.ResolutionSession.runWithBinding(() => Promise.resolve('ok'), bindingA);
            testlab_1.expect(val).to.eql('ok');
        });
        it('pushes/pops the binding atomically for a sync action', () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            session1.pushInjection(injection);
            const bindingB = new __1.Binding('b');
            const val = __1.ResolutionSession.runWithBinding(() => 'ok', bindingB, session1);
            testlab_1.expect(val).to.eql('ok');
            testlab_1.expect(session1.bindingStack).to.be.eql([bindingA]);
            testlab_1.expect(session1.injectionStack).to.be.eql([injection]);
        });
        it('pushes/pops the binding atomically for a failed sync action', () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            session1.pushInjection(injection);
            const bindingB = new __1.Binding('b');
            testlab_1.expect(() => {
                __1.ResolutionSession.runWithBinding(() => {
                    throw new Error('bad');
                }, bindingB, session1);
            }).to.throw('bad');
            testlab_1.expect(session1.bindingStack).to.be.eql([bindingA]);
            testlab_1.expect(session1.injectionStack).to.be.eql([injection]);
        });
        it('pushes/pops the binding atomically for an async action', async () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            session1.pushInjection(injection);
            const bindingB = new __1.Binding('b');
            const val = await __1.ResolutionSession.runWithBinding(() => Promise.resolve('ok'), bindingB, session1);
            testlab_1.expect(val).to.eql('ok');
            testlab_1.expect(session1.bindingStack).to.be.eql([bindingA]);
            testlab_1.expect(session1.injectionStack).to.be.eql([injection]);
        });
        it('pushes/pops the binding atomically for a failed action', async () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            session1.pushInjection(injection);
            const bindingB = new __1.Binding('b');
            const val = __1.ResolutionSession.runWithBinding(() => Promise.reject(new Error('bad')), bindingB, session1);
            await testlab_1.expect(val).to.rejectedWith('bad');
            testlab_1.expect(session1.bindingStack).to.be.eql([bindingA]);
            testlab_1.expect(session1.injectionStack).to.be.eql([injection]);
        });
    });
    describe('runWithInjection()', () => {
        it('allows current session to be undefined', () => {
            const injection = givenInjection();
            const val = __1.ResolutionSession.runWithInjection(() => 'ok', injection);
            testlab_1.expect(val).to.eql('ok');
        });
        it('allows a promise to be returned', async () => {
            const injection = givenInjection();
            const val = await __1.ResolutionSession.runWithInjection(() => Promise.resolve('ok'), injection);
            testlab_1.expect(val).to.eql('ok');
        });
        it('pushes/pops the injection atomically for a sync action', () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            const val = __1.ResolutionSession.runWithInjection(() => 'ok', injection, session1);
            testlab_1.expect(val).to.eql('ok');
            testlab_1.expect(session1.bindingStack).to.be.eql([bindingA]);
            testlab_1.expect(session1.injectionStack).to.be.eql([]);
        });
        it('pushes/pops the injection atomically for a failed sync action', () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            testlab_1.expect(() => {
                __1.ResolutionSession.runWithInjection(() => {
                    throw new Error('bad');
                }, injection, session1);
            }).to.throw('bad');
            testlab_1.expect(session1.bindingStack).to.be.eql([bindingA]);
            testlab_1.expect(session1.injectionStack).to.be.eql([]);
        });
        it('pushes/pops the injection atomically for an async action', async () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            const val = await __1.ResolutionSession.runWithInjection(() => Promise.resolve('ok'), injection, session1);
            testlab_1.expect(val).to.eql('ok');
            testlab_1.expect(session1.bindingStack).to.be.eql([bindingA]);
            testlab_1.expect(session1.injectionStack).to.be.eql([]);
        });
        it('pushes/pops the injection atomically for a failed async action', async () => {
            const session1 = new __1.ResolutionSession();
            const bindingA = new __1.Binding('a');
            session1.pushBinding(bindingA);
            const injection = givenInjection();
            const val = __1.ResolutionSession.runWithInjection(() => Promise.reject(new Error('bad')), injection, session1);
            await testlab_1.expect(val).to.rejectedWith('bad');
            testlab_1.expect(session1.bindingStack).to.be.eql([bindingA]);
            testlab_1.expect(session1.injectionStack).to.be.eql([]);
        });
    });
    describe('ResolutionError', () => {
        let resolutionErr;
        before(givenResolutionError);
        it('includes contextual information in message', () => {
            testlab_1.expect(resolutionErr.message).to.eql('Binding not found (context: test, binding: b, resolutionPath: ' +
                'a --> @MyController.constructor[0] --> b)');
        });
        it('includes contextual information in toString()', () => {
            testlab_1.expect(resolutionErr.toString()).to.eql('ResolutionError: Binding not found ' +
                '(context: test, binding: b, resolutionPath: ' +
                'a --> @MyController.constructor[0] --> b)');
        });
        function givenResolutionError() {
            const ctx = new __1.Context('test');
            const bindingA = new __1.Binding('a');
            ctx.add(bindingA);
            session.pushBinding(bindingA);
            const injection = givenInjection();
            session.pushInjection(injection);
            const bindingB = new __1.Binding('b');
            ctx.add(bindingB);
            session.pushBinding(bindingB);
            resolutionErr = new resolution_session_1.ResolutionError('Binding not found', {
                options: { session },
                context: ctx,
                binding: bindingB,
            });
            return resolutionErr;
        }
    });
});
//# sourceMappingURL=resolution-session.unit.js.map