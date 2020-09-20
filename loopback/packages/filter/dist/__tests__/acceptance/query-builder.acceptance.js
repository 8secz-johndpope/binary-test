"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/filter
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('WhereBuilder', () => {
    it('builds where object', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder
            .eq('a', 1)
            .gt('b', 2)
            .lt('c', 2)
            .eq('x', 'x')
            .build();
        testlab_1.expect(where).to.eql({ a: 1, b: { gt: 2 }, c: { lt: 2 }, x: 'x' });
    });
    it('builds where object with multiple clauses using the same key', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.gt('a', 2).lt('a', 4).build();
        testlab_1.expect(where).to.eql({ and: [{ a: { gt: 2 } }, { a: { lt: 4 } }] });
    });
    it('builds where object with inq', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.inq('x', [1, 2, 3]).inq('y', ['a', 'b']).build();
        testlab_1.expect(where).to.eql({ x: { inq: [1, 2, 3] }, y: { inq: ['a', 'b'] } });
    });
    it('builds where object with nin', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.nin('x', [1, 2, 3]).nin('y', ['a', 'b']).build();
        testlab_1.expect(where).to.eql({ x: { nin: [1, 2, 3] }, y: { nin: ['a', 'b'] } });
    });
    it('builds where object with neq', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.neq('x', 1).build();
        testlab_1.expect(where).to.eql({ x: { neq: 1 } });
    });
    it('builds where object with gte', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.gte('x', 1).build();
        testlab_1.expect(where).to.eql({ x: { gte: 1 } });
    });
    it('builds where object with lte', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.lte('x', 1).build();
        testlab_1.expect(where).to.eql({ x: { lte: 1 } });
    });
    it('builds where object with exists', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.exists('x', true).build();
        testlab_1.expect(where).to.eql({ x: { exists: true } });
    });
    it('builds where object with exists default to true', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.exists('x').build();
        testlab_1.expect(where).to.eql({ x: { exists: true } });
    });
    it('builds where object with between', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder
            .between('x', 1, 2)
            .between('y', 'a', 'b')
            .build();
        testlab_1.expect(where).to.eql({ x: { between: [1, 2] }, y: { between: ['a', 'b'] } });
    });
    it('builds where object with string like', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.like('x', /\d{3}/.source).build();
        testlab_1.expect(where).to.eql({ x: { like: /\d{3}/.source } });
    });
    it('builds where object with string nlike', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.nlike('x', /\d{3}/.source).build();
        testlab_1.expect(where).to.eql({ x: { nlike: /\d{3}/.source } });
    });
    it('builds where object with string ilike', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.ilike('x', /\d{3}/.source).build();
        testlab_1.expect(where).to.eql({ x: { ilike: /\d{3}/.source } });
    });
    it('builds where object with string nilike', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.nilike('x', /\d{3}/.source).build();
        testlab_1.expect(where).to.eql({ x: { nilike: /\d{3}/.source } });
    });
    it('builds where object with string regexp', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.regexp('x', /\d{3}/.source).build();
        testlab_1.expect(where).to.eql({ x: { regexp: /\d{3}/.source } });
    });
    it('builds where object with literal regexp', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.regexp('x', /\d{3}/).build();
        testlab_1.expect(where).to.eql({ x: { regexp: /\d{3}/ } });
    });
    it('builds where object with object regexp', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder.regexp('x', new RegExp(/\d{3}/)).build();
        testlab_1.expect(where).to.eql({ x: { regexp: /\d{3}/ } });
    });
    it('builds where object with or', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder
            .eq('a', 1)
            .gt('b', 2)
            .lt('c', 2)
            .or({ x: 'x' }, { y: { gt: 1 } }, [{ a: 1 }, { b: 2 }])
            .build();
        testlab_1.expect(where).to.eql({
            a: 1,
            b: { gt: 2 },
            c: { lt: 2 },
            or: [{ x: 'x' }, { y: { gt: 1 } }, { a: 1 }, { b: 2 }],
        });
    });
    it('builds where object with and', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder
            .eq('a', 1)
            .gt('b', 2)
            .lt('c', 2)
            .and({ x: 'x' }, { y: { gt: 1 } }, [{ a: 1 }, { b: 2 }])
            .build();
        testlab_1.expect(where).to.eql({
            a: 1,
            b: { gt: 2 },
            c: { lt: 2 },
            and: [{ x: 'x' }, { y: { gt: 1 } }, { a: 1 }, { b: 2 }],
        });
    });
    it('builds where object with existing and', () => {
        const whereBuilder = new __1.WhereBuilder();
        const where = whereBuilder
            .eq('a', 1)
            .and({ x: 'x' }, { y: { gt: 1 } })
            .and({ b: 'b' }, { c: { lt: 1 } })
            .build();
        testlab_1.expect(where).to.eql({
            and: [
                {
                    a: 1,
                    and: [{ x: 'x' }, { y: { gt: 1 } }],
                },
                {
                    and: [{ b: 'b' }, { c: { lt: 1 } }],
                },
            ],
        });
    });
    it('builds where object from an existing one', () => {
        const whereBuilder = new __1.WhereBuilder({ y: 'y' });
        const where = whereBuilder
            .eq('a', 1)
            .gt('b', 2)
            .lt('c', 2)
            .eq('x', 'x')
            .build();
        testlab_1.expect(where).to.eql({ y: 'y', a: 1, b: { gt: 2 }, c: { lt: 2 }, x: 'x' });
    });
    it('constrains an existing where object with another where filter', () => {
        const builder = new __1.WhereBuilder({ x: 'x' });
        const where = builder.impose({ x: 'y', z: 'z' }).build();
        testlab_1.expect(where).to.be.deepEqual({ and: [{ x: 'x' }, { x: 'y', z: 'z' }] });
    });
    it('compiles valid where clause', () => {
        const k1 = 'id';
        // const k2: Key = 'regexp'; // fail to compile, regexp is a keyword
        // const k3: Key = 'gte'; // fail to compile, gte is a keyword
        const t1 = {
            // id: 'foo', // fail to compile, wrong type
            or: [{ id: 42 }],
        };
        const t2 = {
            id: 42,
        };
        const t3 = {
            id: 42,
        };
        // Force usage to disable unused var warnings
        testlab_1.expect([k1, t1, t2, t3]).to.eql([k1, t1, t2, t3]);
    });
});
describe('FilterBuilder', () => {
    context('isFilter', () => {
        it('returns false for objects containing illegal fields', () => {
            const badFilter = { where: {}, badKey: 'bad key' };
            testlab_1.expect(__1.isFilter(badFilter)).to.be.false();
        });
        it('returns true for objects containing only the legal fields', () => {
            const legalFilter = { where: {}, limit: 5 };
            testlab_1.expect(__1.isFilter(legalFilter)).to.be.true();
        });
    });
    it('builds a filter object with field names', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.fields('a', 'b', 'c');
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            fields: {
                a: true,
                b: true,
                c: true,
            },
        });
    });
    it('builds a filter object with field object', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.fields({ a: true, b: false });
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            fields: {
                a: true,
                b: false,
            },
        });
    });
    it('builds a filter object with mixed field names/objects/arrays', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.fields({ a: true, b: false }, 'c', ['d', 'e']);
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            fields: {
                a: true,
                b: false,
                c: true,
                d: true,
                e: true,
            },
        });
    });
    it('builds a filter object with multiple fields', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.fields({ a: true, b: false }).fields('c').fields(['d', 'e']);
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            fields: {
                a: true,
                b: false,
                c: true,
                d: true,
                e: true,
            },
        });
    });
    it('builds a filter object with limit/offset', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.limit(10).offset(5);
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            limit: 10,
            offset: 5,
        });
    });
    it('builds a filter object with limit/skip', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.limit(10).skip(5);
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            limit: 10,
            offset: 5,
        });
    });
    it('validates limit', () => {
        testlab_1.expect(() => {
            const filterBuilder = new __1.FilterBuilder();
            filterBuilder.limit(-10).offset(5);
        }).to.throw(/Limit \-10 must a positive number/);
    });
    it('builds a filter object with order names', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.order('a', 'b', 'c');
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            order: ['a ASC', 'b ASC', 'c ASC'],
        });
    });
    it('builds a filter object with order object', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.order({ a: 'ASC', b: 'DESC' });
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            order: ['a ASC', 'b DESC'],
        });
    });
    it('builds a filter object with mixed order names/objects/arrays', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.order({ a: 'ASC', b: 'DESC' }, 'c DESC', ['d', 'e DESC']);
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            order: ['a ASC', 'b DESC', 'c DESC', 'd ASC', 'e DESC'],
        });
    });
    it('builds a filter object with multiple orders', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.order('a', 'b').order('c DESC');
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            order: ['a ASC', 'b ASC', 'c DESC'],
        });
    });
    it('validates order', () => {
        testlab_1.expect(() => {
            const filterBuilder = new __1.FilterBuilder();
            filterBuilder.order('a x');
        }).to.throw(/Invalid order/);
    });
    it('builds a filter object with where', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.where({ x: 1, and: [{ a: { gt: 2 } }, { b: 2 }] });
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            where: { x: 1, and: [{ a: { gt: 2 } }, { b: 2 }] },
        });
    });
    it('builds a filter object with included relation names', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.include('orders', 'friends');
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            include: [{ relation: 'orders' }, { relation: 'friends' }],
        });
    });
    it('builds a filter object with included an array of relation names', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.include(['orders', 'friends']);
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            include: [{ relation: 'orders' }, { relation: 'friends' }],
        });
    });
    it('builds a filter object with inclusion objects', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.include({ relation: 'orders' }, { relation: 'friends', scope: { where: { name: 'ray' } } });
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            include: [
                { relation: 'orders' },
                { relation: 'friends', scope: { where: { name: 'ray' } } },
            ],
        });
    });
    it('builds a filter object with multiple includes', () => {
        const filterBuilder = new __1.FilterBuilder();
        filterBuilder.include(['orders']).include('friends');
        const filter = filterBuilder.build();
        testlab_1.expect(filter).to.eql({
            include: [{ relation: 'orders' }, { relation: 'friends' }],
        });
    });
    it('imposes a constraint with only a where object on an existing filter', () => {
        const filterBuilder = new __1.FilterBuilder()
            .fields({ a: true }, 'b')
            .include('orders')
            .limit(5)
            .offset(2)
            .order('a ASC')
            .where({ x: 'x' });
        filterBuilder.impose({ where: { x: 'y', z: 'z' } });
        testlab_1.expect(filterBuilder.build()).to.have.properties([
            'fields',
            'include',
            'limit',
            'offset',
            'order',
        ]);
        testlab_1.expect(filterBuilder.build()).to.have.property('where', {
            and: [{ x: 'x' }, { x: 'y', z: 'z' }],
        });
    });
    it('imposes a constraint with a where object', () => {
        const filterBuilder = new __1.FilterBuilder()
            .fields({ a: true }, 'b')
            .include('orders')
            .limit(5)
            .offset(2)
            .order('a ASC')
            .where({ x: 'x' });
        filterBuilder.impose({ x: 'y', fields: 'z' });
        testlab_1.expect(filterBuilder.build()).to.have.properties([
            'fields',
            'include',
            'limit',
            'offset',
            'order',
        ]);
        testlab_1.expect(filterBuilder.build()).to.have.property('where', {
            and: [{ x: 'x' }, { x: 'y', fields: 'z' }],
        });
    });
    it('throws an error when imposing a constraint filter with unsupported properties', () => {
        const filterBuilder = new __1.FilterBuilder()
            .fields({ a: true }, 'b')
            .include('orders')
            .limit(5)
            .offset(2)
            .order('a ASC')
            .where({ x: 'x' });
        const constraint = new __1.FilterBuilder()
            .fields({ a: false }, { c: false })
            .include({ relation: 'orders', scope: { limit: 5 } })
            .limit(10)
            .offset(3)
            .order('b DESC', 'a DESC', 'c ASC')
            .where({ x: 'y', y: 'z' })
            .build();
        testlab_1.expect(() => {
            filterBuilder.impose(constraint);
        }).to.throw(/merging strategy for selection, pagination, and sorting not implemented/);
    });
});
describe('FilterTemplate', () => {
    it('builds filter object', () => {
        const filter = __1.filterTemplate `{"limit": ${'limit'},
    "where": {${'key'}: ${'value'}}}`;
        const result = filter({ limit: 10, key: 'name', value: 'John' });
        testlab_1.expect(result).to.eql({
            limit: 10,
            where: {
                name: 'John',
            },
        });
    });
    it('builds filter object with nesting properties', () => {
        const filter = __1.filterTemplate `{"limit": ${'pagination.limit'},
    "where": {${'key'}: ${'value'}}}`;
        const result = filter({
            pagination: { limit: 10 },
            key: 'age',
            value: 25,
        });
        testlab_1.expect(result).to.eql({
            limit: 10,
            where: {
                age: 25,
            },
        });
    });
    it('builds filter object with null nesting properties', () => {
        const filter = __1.filterTemplate `{"where": {${'x.key'}: ${'x.value'}}}`;
        const result = filter({ x: { key: 'name' } });
        testlab_1.expect(result).to.eql({
            where: {
                name: null,
            },
        });
    });
    it('builds filter object with number literals', () => {
        const value = 25;
        const filter = __1.filterTemplate `{"where": {${'key'}: ${value}}}`;
        const result = filter({
            key: 'age',
        });
        testlab_1.expect(result).to.eql({
            where: {
                age: 25,
            },
        });
    });
    it('reports error if the template does not generate a valid json object', () => {
        testlab_1.expect(() => {
            const filter = __1.filterTemplate `{"limit": ${'limit'},
    where": {${'key'}: ${'value'}}}`;
            filter({ limit: 10, key: 'name', value: 'John' });
        }).throw(/Invalid JSON/);
    });
});
//# sourceMappingURL=query-builder.acceptance.js.map