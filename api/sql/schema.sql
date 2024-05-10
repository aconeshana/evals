CREATE TABLE `eval_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `content` longtext NOT NULL COMMENT 'jsonl',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_by` varchar(100) DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`id`),
  KEY `IDX_NAME` (`name`)
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE `eval_execution` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `model` varchar(50) NOT NULL DEFAULT '' COMMENT '模型',
  `desc` varchar(2000) NOT NULL DEFAULT '' COMMENT '描述',
  `match` varchar(100) NOT NULL DEFAULT '' COMMENT '匹配方式',
  `args` varchar(8000) DEFAULT NULL COMMENT '参数',
  `data_id` int(11) NOT NULL COMMENT '数据id',
  `result` text COMMENT '结果',
  `progress` varchar(100) DEFAULT NULL COMMENT '进度',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_by` varchar(100) DEFAULT NULL COMMENT '创建者',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB CHARSET=utf8;