import n1qlFormatter from "xr/sqlFormatter/n1qlFormatter";

describe("n1qlFormatter", function() {
    describe("SELECT", function() {
        it("formats simple sentence", function() {
            const result = n1qlFormatter.format("SELECT count(*),'Column1' FROM `Table1`;");
            expect(result).toBe(
                "SELECT\n" +
                "  COUNT(*),\n" +
                "  'Column1'\n" +
                "FROM\n" +
                "  `Table1`;\n"
            );
        });

        it("formats DISTINCT keyword", function() {
            const result = n1qlFormatter.format("SELECT distinct orderlines[0].productId FROM orders;");
            expect(result).toBe(
                "SELECT\n" +
                "  DISTINCT orderlines[0].productId\n" +
                "FROM\n" +
                "  orders;\n"
            );
        });

        it("formats functions on the data", function() {
            const result = n1qlFormatter.format(
                "SELECT fname, age, ROUND(age/7) as age_dog_years FROM tutorial WHERE fname='Dave';"
            );
            expect(result).toBe(
                "SELECT\n" +
                "  fname,\n" +
                "  age,\n" +
                "  ROUND(age / 7) AS age_dog_years\n" +
                "FROM\n" +
                "  tutorial\n" +
                "WHERE\n" +
                "  fname = 'Dave';\n"
            );
        });

        it("formats string concat", function() {
            const result = n1qlFormatter.format(
                "SELECT fname || \" \" || lname AS full_name FROM tutorial;"
            );
            expect(result).toBe(
                "SELECT\n" +
                "  fname || \" \" || lname AS full_name\n" +
                "FROM\n" +
                "  tutorial;\n"
            );
        });

        it("formats primary key quering", function() {
            const result = n1qlFormatter.format(
                "SELECT fname, email FROM tutorial USE KEYS ['dave', 'ian'];"
            );
            expect(result).toBe(
                "SELECT\n" +
                "  fname,\n" +
                "  email\n" +
                "FROM\n" +
                "  tutorial\n" +
                "USE KEYS\n" +
                "  ['dave', 'ian'];\n"
            );
        });

        it("formats unnest", function() {
            const result = n1qlFormatter.format(
                "SELECT t.relation, COUNT(*) AS count, AVG(c.age) AS avg_age FROM tutorial t " +
                "UNNEST t.children c WHERE c.age > 10 GROUP BY t.relation HAVING COUNT(*) > 1 " +
                "ORDER BY avg_age DESC LIMIT 1 OFFSET 1;"
            );
            expect(result).toBe(
                "SELECT\n" +
                "  t.relation,\n" +
                "  COUNT(*) AS count,\n" +
                "  AVG(c.age) AS avg_age\n" +
                "FROM\n" +
                "  tutorial t\n" +
                "UNNEST\n" +
                "  t.children c\n" +
                "WHERE\n" +
                "  c.age > 10\n" +
                "GROUP BY\n" +
                "  t.relation\n" +
                "HAVING\n" +
                "  COUNT(*) > 1\n" +
                "ORDER BY\n" +
                "  avg_age DESC\n" +
                "LIMIT\n" +
                "  1 OFFSET 1;\n"
            );
        });

        it("formats nest and other same-line reserved words", function() {
            const result = n1qlFormatter.format(
                "SELECT usr.personal_details, orders FROM users_with_orders usr " +
                "USE KEYS \"Elinor_33313792\" NEST orders_with_users orders " +
                "ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history end;"
            );
            expect(result).toBe(
                "SELECT\n" +
                "  usr.personal_details,\n" +
                "  orders\n" +
                "FROM\n" +
                "  users_with_orders usr\n" +
                "USE KEYS\n" +
                "  \"Elinor_33313792\"\n" +
                "NEST\n" +
                "  orders_with_users orders ON KEYS ARRAY s.order_id FOR s IN usr.shipped_order_history END;\n"
            );
        });
    });

    describe("EXPLAIN", function() {
        it("formats simple sentence", function() {
            const result = n1qlFormatter.format(
                "EXPLAIN DELETE FROM tutorial t USE KEYS 'baldwin' RETURNING t"
            );
            expect(result).toBe(
                "EXPLAIN DELETE FROM\n" +
                "  tutorial t\n" +
                "USE KEYS\n" +
                "  'baldwin' RETURNING t\n"
            );
        });
    });

    describe("UPDATE", function() {
        it("formats simple sentence", function() {
            const result = n1qlFormatter.format(
                "UPDATE tutorial USE KEYS 'baldwin' SET type = 'actor' RETURNING tutorial.type"
            );
            expect(result).toBe(
                "UPDATE\n" +
                "  tutorial\n" +
                "USE KEYS\n" +
                "  'baldwin'\n" +
                "SET\n" +
                "  type = 'actor' RETURNING tutorial.type\n"
            );
        });
    });
});
