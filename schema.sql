DROP table if exists t_entity_ray_point;
CREATE TABLE IF NOT EXISTS t_entity_ray_point (
	`id` INTEGER PRIMARY KEY,
	`create_time` DATETIME default current_timestamp,
	`update_time` DATETIME default current_timestamp,
	`create_user_id` INTEGER,
  `last_modify_user_id` INTEGER,
	`delete_status` INTEGER default 0, -- 删除状态：1 已删除，0 未删除
	`status` INTEGER default 1, -- 数据状态：0 禁用，1 启用
	`remark` TEXT, -- 备注
	`md5` TEXT, -- 数据md5
	`md5_sub` TEXT, -- 子数据md5
	`encryption_type` TEXT default 'base64', -- 加密类型：base64
	`point_type` TEXT, -- 类型：vless、vmess、trojan、shadowsocks、scoks
	`context` TEXT, -- 去除类型的节点内容
	`point_content` TEXT, -- 完整的节点
	`source_from` TEXT -- 来源
);
create index idx_all on t_entity_ray_point (md5, point_type);