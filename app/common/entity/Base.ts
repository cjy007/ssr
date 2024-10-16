class EntityBase {
  id?: number; // INTEGER PRIMARY KEY autoincrement,
  create_time?: string; // TEXT default current_timestamp,
  update_time?: string; // TEXT default current_timestamp,
  create_user_id?: string; // INTEGER,
  last_modify_user_id?: string; // INTEGER,
  delete_status?: number; // INTEGER default 0, -- 删除状态：1 已删除，0 未删除
  status?: number; // INTEGER default 1, -- 数据状态：0 禁用，1 启用
  remark?: string;// TEXT, -- 备注
}

export default EntityBase