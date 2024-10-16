import EntityBase from "./Base"

class EntityRayPoint extends EntityBase {
  md5?: string; // TEXT, -- 数据md5
  encryption_type?: string; // TEXT default 'base64', -- 加密类型：base64
  point_type?: string; // TEXT, -- 类型：vless、vmess、trojan、shadowsocks、scoks
  describe?: string // TEXT, -- 描述
  point_content?: string; // TEXT, -- 完整的节点
  source_from?: string; // TEXT, -- 来源 
}

export default EntityRayPoint