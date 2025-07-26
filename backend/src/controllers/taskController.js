const { getConnection } = require('../config/database');

class TaskController {
  async getTasksByProject(req, res) {
    try {
      const connection = getConnection();
      const { projectId } = req.params;
      
      const [rows] = await connection.execute(
        'SELECT * FROM tasks WHERE project_id = ? ORDER BY sort_order ASC, created_at DESC',
        [projectId]
      );
      
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('获取任务列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取任务列表失败'
      });
    }
  }

  async createTask(req, res) {
    try {
      const connection = getConnection();
      const { projectId } = req.params;
      const {
        title,
        description,
        status = 'todo',
        priority = 'medium',
        estimated_hours,
        due_date,
        sort_order = 0
      } = req.body;
      
      if (!title) {
        return res.status(400).json({
          success: false,
          message: '任务标题不能为空'
        });
      }
      
      const [result] = await connection.execute(
        `INSERT INTO tasks (project_id, title, description, status, priority, estimated_hours, due_date, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [projectId, title, description, status, priority, estimated_hours, due_date, sort_order]
      );
      
      res.status(201).json({
        success: true,
        data: { id: result.insertId },
        message: '任务创建成功'
      });
    } catch (error) {
      console.error('创建任务失败:', error);
      res.status(500).json({
        success: false,
        message: '创建任务失败'
      });
    }
  }

  async updateTask(req, res) {
    try {
      const connection = getConnection();
      const { id } = req.params;
      const updateData = req.body;
      
      const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      values.push(id);
      
      await connection.execute(
        `UPDATE tasks SET ${setClause} WHERE id = ?`,
        values
      );
      
      res.json({
        success: true,
        message: '任务更新成功'
      });
    } catch (error) {
      console.error('更新任务失败:', error);
      res.status(500).json({
        success: false,
        message: '更新任务失败'
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const connection = getConnection();
      const { id } = req.params;
      
      await connection.execute('DELETE FROM tasks WHERE id = ?', [id]);
      
      res.json({
        success: true,
        message: '任务删除成功'
      });
    } catch (error) {
      console.error('删除任务失败:', error);
      res.status(500).json({
        success: false,
        message: '删除任务失败'
      });
    }
  }
}

module.exports = new TaskController();