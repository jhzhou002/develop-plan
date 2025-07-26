-- 修复数据库中的tech_stack数据问题

USE `develop-plan`;

-- 查看当前有问题的数据
SELECT id, title, tech_stack FROM projects WHERE tech_stack IS NOT NULL AND tech_stack != '';

-- 清理无效的tech_stack数据
UPDATE projects 
SET tech_stack = '[]' 
WHERE tech_stack IS NOT NULL 
  AND tech_stack != '' 
  AND (
    tech_stack NOT LIKE '[%' 
    OR tech_stack NOT LIKE '%]'
    OR tech_stack LIKE '%V%'
  );

-- 确保所有空值都设置为空数组
UPDATE projects 
SET tech_stack = '[]' 
WHERE tech_stack IS NULL OR tech_stack = '' OR tech_stack = 'null';

-- 验证修复结果
SELECT id, title, tech_stack FROM projects;