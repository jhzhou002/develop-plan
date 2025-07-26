-- 修复tech_stack字段的数据类型和数据问题

USE `develop-plan`;

-- 首先备份有问题的数据
CREATE TABLE IF NOT EXISTS `projects_backup` AS SELECT * FROM `projects`;

-- 更新tech_stack字段类型为TEXT（如果需要）
ALTER TABLE `projects` MODIFY COLUMN `tech_stack` TEXT COMMENT '技术栈';

-- 清理并修复可能有问题的tech_stack数据
UPDATE `projects` 
SET `tech_stack` = '[]' 
WHERE `tech_stack` IS NULL OR `tech_stack` = '' OR `tech_stack` = 'null';

-- 检查并修复无效的JSON数据
UPDATE `projects` 
SET `tech_stack` = '[]' 
WHERE `tech_stack` IS NOT NULL 
  AND `tech_stack` != '' 
  AND `tech_stack` NOT LIKE '[%'
  AND `tech_stack` NOT LIKE '{%';

-- 确保现有数据是有效的JSON格式
UPDATE `projects` 
SET `tech_stack` = CASE 
  WHEN `tech_stack` LIKE 'Vue3%' THEN '["Vue3", "Node.js", "MySQL"]'
  WHEN `tech_stack` = '["Vue3", "Node.js", "MySQL"]' THEN `tech_stack`
  ELSE '[]'
END
WHERE `tech_stack` IS NOT NULL AND `tech_stack` != '';

-- 验证修复结果
SELECT id, title, tech_stack FROM `projects`;