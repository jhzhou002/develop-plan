-- 开发计划管理系统数据库表结构

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `develop-plan` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `develop-plan`;

-- 项目表
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '项目标题',
  `description` text COMMENT '项目描述',
  `status` enum('idea','planning','development','testing','completed','paused') NOT NULL DEFAULT 'idea' COMMENT '项目状态',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium' COMMENT '优先级',
  `category` varchar(100) COMMENT '项目分类',
  `tech_stack` json COMMENT '技术栈',
  `start_date` date COMMENT '开始日期',
  `target_date` date COMMENT '目标完成日期',
  `actual_date` date COMMENT '实际完成日期',
  `progress` int(3) NOT NULL DEFAULT 0 COMMENT '进度百分比',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';

-- 任务表
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL COMMENT '项目ID',
  `title` varchar(255) NOT NULL COMMENT '任务标题',
  `description` text COMMENT '任务描述',
  `status` enum('todo','in_progress','done','blocked') NOT NULL DEFAULT 'todo' COMMENT '任务状态',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium' COMMENT '优先级',
  `estimated_hours` decimal(5,2) COMMENT '预估工时',
  `actual_hours` decimal(5,2) COMMENT '实际工时',
  `due_date` date COMMENT '截止日期',
  `sort_order` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort_order` (`sort_order`),
  CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- 标签表
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '标签名称',
  `color` varchar(7) NOT NULL DEFAULT '#1890ff' COMMENT '标签颜色',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 项目标签关联表
CREATE TABLE `project_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_project_tag` (`project_id`,`tag_id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_tag_id` (`tag_id`),
  CONSTRAINT `fk_project_tags_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_project_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目标签关联表';

-- 笔记表
CREATE TABLE `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL COMMENT '笔记标题',
  `content` longtext NOT NULL COMMENT '笔记内容',
  `type` enum('text','markdown') NOT NULL DEFAULT 'markdown' COMMENT '内容类型',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  CONSTRAINT `fk_notes_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='笔记表';

-- 插入一些初始数据
INSERT INTO `tags` (`name`, `color`) VALUES
('前端', '#52c41a'),
('后端', '#1890ff'),
('移动端', '#722ed1'),
('AI/ML', '#eb2f96'),
('工具', '#fa8c16'),
('学习', '#13c2c2');

INSERT INTO `projects` (`title`, `description`, `status`, `priority`, `category`, `tech_stack`, `start_date`, `target_date`, `progress`) VALUES
('开发计划管理系统', '一个用于记录和管理产品想法和开发计划的网站', 'development', 'high', 'Web应用', '["Vue3", "Node.js", "MySQL"]', '2025-01-26', '2025-02-15', 30);