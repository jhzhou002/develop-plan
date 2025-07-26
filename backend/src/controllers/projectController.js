const { getConnection } = require('../config/database');

class ProjectController {
  // 自动修复无效的tech_stack数据
  async fixInvalidTechStack(projectId) {
    try {
      const connection = getConnection();
      await connection.execute(
        'UPDATE projects SET tech_stack = ? WHERE id = ?',
        ['[]', projectId]
      );
      console.log(`Auto-fixed tech_stack for project ${projectId}`);
    } catch (error) {
      console.error(`Failed to auto-fix tech_stack for project ${projectId}:`, error);
    }
  }
  async getAllProjects(req, res) {
    try {
      const connection = getConnection();
      const { status, category, priority } = req.query;
      
      let query = `
        SELECT p.*, 
               GROUP_CONCAT(t.name) as tags,
               (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
               (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_tasks
        FROM projects p
        LEFT JOIN project_tags pt ON p.id = pt.project_id
        LEFT JOIN tags t ON pt.tag_id = t.id
      `;
      
      const conditions = [];
      const params = [];
      
      if (status) {
        conditions.push('p.status = ?');
        params.push(status);
      }
      
      if (category) {
        conditions.push('p.category = ?');
        params.push(category);
      }
      
      if (priority) {
        conditions.push('p.priority = ?');
        params.push(priority);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' GROUP BY p.id ORDER BY p.updated_at DESC';
      
      const [rows] = await connection.execute(query, params);
      
      const projects = rows.map(row => {
        let techStack = [];
        if (row.tech_stack) {
          try {
            // 如果是字符串且不是JSON格式，清理数据
            if (typeof row.tech_stack === 'string') {
              if (row.tech_stack.startsWith('[') && row.tech_stack.endsWith(']')) {
                techStack = JSON.parse(row.tech_stack);
              } else if (row.tech_stack.startsWith('{') && row.tech_stack.endsWith('}')) {
                techStack = JSON.parse(row.tech_stack);
              } else {
                // 如果不是有效的JSON格式，设为空数组并记录警告
                console.warn(`Invalid tech_stack format for project ${row.id}: "${row.tech_stack}"`);
                techStack = [];
                // 可选：自动修复数据库中的数据
                this.fixInvalidTechStack(row.id);
              }
            } else if (Array.isArray(row.tech_stack)) {
              techStack = row.tech_stack;
            }
          } catch (error) {
            console.warn(`Failed to parse tech_stack for project ${row.id}:`, error.message);
            techStack = [];
            // 自动修复数据库中的数据
            this.fixInvalidTechStack(row.id);
          }
        }
        
        return {
          ...row,
          tech_stack: Array.isArray(techStack) ? techStack : [],
          tags: row.tags ? row.tags.split(',').filter(tag => tag.trim()) : []
        };
      });
      
      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('获取项目列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取项目列表失败'
      });
    }
  }

  async getProjectById(req, res) {
    try {
      const connection = getConnection();
      const { id } = req.params;
      
      const [rows] = await connection.execute(
        `SELECT p.*, 
                GROUP_CONCAT(t.name) as tags
         FROM projects p
         LEFT JOIN project_tags pt ON p.id = pt.project_id
         LEFT JOIN tags t ON pt.tag_id = t.id
         WHERE p.id = ?
         GROUP BY p.id`,
        [id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: '项目不存在'
        });
      }
      
      let techStack = [];
      if (rows[0].tech_stack) {
        try {
          if (typeof rows[0].tech_stack === 'string') {
            if (rows[0].tech_stack.startsWith('[') && rows[0].tech_stack.endsWith(']')) {
              techStack = JSON.parse(rows[0].tech_stack);
            } else if (rows[0].tech_stack.startsWith('{') && rows[0].tech_stack.endsWith('}')) {
              techStack = JSON.parse(rows[0].tech_stack);
            } else {
              console.warn(`Invalid tech_stack format for project ${rows[0].id}: "${rows[0].tech_stack}"`);
              techStack = [];
              this.fixInvalidTechStack(rows[0].id);
            }
          } else if (Array.isArray(rows[0].tech_stack)) {
            techStack = rows[0].tech_stack;
          }
        } catch (error) {
          console.warn(`Failed to parse tech_stack for project ${rows[0].id}:`, error.message);
          techStack = [];
          this.fixInvalidTechStack(rows[0].id);
        }
      }
      
      const project = {
        ...rows[0],
        tech_stack: techStack,
        tags: rows[0].tags ? rows[0].tags.split(',') : []
      };
      
      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('获取项目详情失败:', error);
      res.status(500).json({
        success: false,
        message: '获取项目详情失败'
      });
    }
  }

  async createProject(req, res) {
    try {
      const connection = getConnection();
      const {
        title,
        description,
        status = 'idea',
        priority = 'medium',
        category,
        tech_stack = [],
        start_date,
        target_date,
        tags = []
      } = req.body;
      
      if (!title) {
        return res.status(400).json({
          success: false,
          message: '项目标题不能为空'
        });
      }
      
      const [result] = await connection.execute(
        `INSERT INTO projects (title, description, status, priority, category, tech_stack, start_date, target_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, status, priority, category, JSON.stringify(tech_stack), start_date, target_date]
      );
      
      const projectId = result.insertId;
      
      if (tags.length > 0) {
        for (const tagName of tags) {
          await connection.execute(
            'INSERT IGNORE INTO tags (name) VALUES (?)',
            [tagName]
          );
          
          const [tagRows] = await connection.execute(
            'SELECT id FROM tags WHERE name = ?',
            [tagName]
          );
          
          if (tagRows.length > 0) {
            await connection.execute(
              'INSERT IGNORE INTO project_tags (project_id, tag_id) VALUES (?, ?)',
              [projectId, tagRows[0].id]
            );
          }
        }
      }
      
      res.status(201).json({
        success: true,
        data: { id: projectId },
        message: '项目创建成功'
      });
    } catch (error) {
      console.error('创建项目失败:', error);
      res.status(500).json({
        success: false,
        message: '创建项目失败'
      });
    }
  }

  async updateProject(req, res) {
    try {
      const connection = getConnection();
      const { id } = req.params;
      const updateData = req.body;
      
      if (updateData.tech_stack) {
        updateData.tech_stack = JSON.stringify(updateData.tech_stack);
      }
      
      const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      values.push(id);
      
      await connection.execute(
        `UPDATE projects SET ${setClause} WHERE id = ?`,
        values
      );
      
      res.json({
        success: true,
        message: '项目更新成功'
      });
    } catch (error) {
      console.error('更新项目失败:', error);
      res.status(500).json({
        success: false,
        message: '更新项目失败'
      });
    }
  }

  async deleteProject(req, res) {
    try {
      const connection = getConnection();
      const { id } = req.params;
      
      await connection.execute('DELETE FROM projects WHERE id = ?', [id]);
      
      res.json({
        success: true,
        message: '项目删除成功'
      });
    } catch (error) {
      console.error('删除项目失败:', error);
      res.status(500).json({
        success: false,
        message: '删除项目失败'
      });
    }
  }
}

module.exports = new ProjectController();