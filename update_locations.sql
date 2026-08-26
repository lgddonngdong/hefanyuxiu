-- Update plant locations to Yellow River basin (Henan section)
-- Replace non-Yellow River basin cities and update district names

UPDATE plants SET location = '郑州市惠济区' WHERE location = '郑州市金水区';
UPDATE plants SET location = '洛阳市孟津区' WHERE location = '洛阳市洛龙区';
UPDATE plants SET location = '新乡市原阳县' WHERE location = '新乡市牧野区';
UPDATE plants SET location = '焦作市武陟县' WHERE location = '焦作市解放区';
UPDATE plants SET location = '三门峡市湖滨区' WHERE location = '南阳市卧龙区';
UPDATE plants SET location = '濮阳市华龙区' WHERE location = '信阳市浉河区';
UPDATE plants SET location = '郑州市中牟县' WHERE location = '周口市川汇区';
UPDATE plants SET location = '洛阳市新安县' WHERE location = '驻马店市驿城区';
UPDATE plants SET location = '商丘市梁园区' WHERE location = '商丘市睢阳区';
