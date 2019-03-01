/**
 * @name occurrence-of-String-literal
 * @description The occurrence of a string literal. Just for testing
 * @id string-literal-occurrence
 * @kind problem
*/
import java
import MyStringLiteral

from MyStringLiteral s
select s.getLocation(), "There is a string literal"
