// CAS 计算资源
export const CAS_COMPUTE_COLUMNS = [
  {
    title: "集群IP",
    key: "cvmVip",
  },
  {
    title: "主机池",
    key: "hostPool",
  },
  {
    title: "集群名称",
    key: "clusterName",
  },
  {
    title: "CVK主机数量",
    key: "cvkNum",
  },
  {
    title: "虚拟机数量",
    key: "vmNum",
  },
  {
    title: "虚拟机密度",
    key: "vmDensity",
  },
  {
    title: "CPU总核数",
    key: "cpuTotal",
  },
  {
    title: "CPU已分配核数",
    key: "cpuAllocated",
  },
  {
    title: "CPU分配率",
    key: "cpuAllocatedPercent",
  },
  {
    title: "CPU使用率",
    key: "cpuUsedPercent",
  },
  {
    title: "内存总量(GB)",
    key: "memoryTotal",
  },
  {
    title: "内存已分配量(GB)",
    key: "memoryAllocated",
  },
  {
    title: "内存分配率",
    key: "memoryAllocatedPercent",
  },
  {
    title: "剩余内存(GB)",
    key: "memoryFree",
  },
  {
    title: "内存使用率",
    key: "memoryUsedPercent",
  }
];
// CVK 计算资源
export const CVK_COMPUTE_COLUMNS = [
  {
    title: "集群名称",
    key: "clusterName",
  },
  {
    title: "主机池",
    key: "hostPool",
  },
  {
    title: "集群IP",
    key: "cvmVip",
    width: 160,
  },
  {
    title: "主机IP",
    key: "hostIp",
    width: 160,
  },
  {
    title: "CPU总核数",
    key: "cpuTotal",
  },
  {
    title: "CPU已分配核数",
    key: "cpuAllocated",
  },
  {
    title: "CPU分配率",
    key: "cpuAllocatedPercent",
  },
  {
    title: "CPU使用率",
    key: "cpuUsedPercent",
  },
  {
    title: "内存总量(GB)",
    key: "memoryTotal",
  },
  {
    title: "内存已分配量(GB)",
    key: "memoryAllocated",
  },
  {
    title: "内存分配率",
    key: "memoryAllocatedPercent",
  },
  {
    title: "内存使用量(GB)",
    key: "memoryUsed",
  },
  {
    title: "内存使用率",
    key: "memoryUsedPercent",
  },
  {
    title: "磁盘总量(GB)",
    key: "diskStorage",
  },
  {
    title: "磁盘使用量(GB)",
    key: "diskStorageUsed",
  },
  {
    title: "磁盘使用率",
    key: "diskStorageRate",
  }
];
// 独立存储资源
export const STORAGE_ALONE_COLUMNS = [
  {
    title: "存储IP",
    key: "storageIp",
    width: 160,
  },
  {
    title: "存储系统名称",
    key: "name",
  },
  {
    title: "存储类型",
    key: "type",
  },
  {
    title: "磁盘类型",
    key: "diskType",
  },
  {
    title: "RAID类型",
    key: "raidType",
  },
  {
    title: "总容量(GB)",
    key: "totalSize",
  },
  {
    title: "已分配容量(GB)",
    key: "allocatedSize",
  },
  {
    title: "剩余容量(GB)",
    key: "freeSize",
  },
  {
    title: "系统占用容量(GB)",
    key: "systemSize",
  },
  {
    title: "系统损耗率",
    key: "systemSizeRate",
  }
];
// CAS存储资源
export const STORAGE_CAS_COLUMNS = [
  {
    title: "集群IP",
    key: "cvmVip",
    width: 160,
  },
  {
    title: "主机池",
    key: "hostPool",
  },
  {
    title: "存储池",
    key: "storagePool",
  },
  {
    title: "总容量(GB)",
    key: "totalSize",
  },
  {
    title: "已分配容量(GB)",
    key: "allocatedSize",
  },
  {
    title: "分配率",
    key: "allocatedPercent",
  },
  {
    title: "剩余容量(GB)",
    key: "freeSize",
  },
  {
    title: "使用率",
    key: "usedPercent",
  }
];
// UIS集群资源
export const UIS_CLUSTER_COLUMNS = [
  {
    title: "集群名称",
    key: "clusterName",
  },
  {
    title: "CPU总核数",
    key: "cpuTotal",
  },
  {
    title: "CPU已分配核数",
    key: "cpuAllocated",
  },
  {
    title: "CPU分配率",
    key: "cpuAllocatedPercent",
  },
  {
    title: "CPU使用率",
    key: "cpuUsedPercent",
  },
  {
    title: "内存总量(GB)",
    key: "memoryTotal",
  },
  {
    title: "内存已分配量(GB)",
    key: "memoryAllocated",
  },
  {
    title: "内存分配率",
    key: "memoryAllocatedPercent",
  },
  {
    title: "内存使用量(GB)",
    key: "memoryUsed",
  },
  {
    title: "内存使用率",
    key: "memoryUsedPercent",
  },
  {
    title: "磁盘总量(GB)",
    key: "diskTotal",
  },
  {
    title: "磁盘使用量(GB)",
    key: "diskUsed",
  },
  {
    title: "磁盘使用率",
    key: "diskUsedPercent",
  },
  {
    title: "磁盘已分配量(GB)",
    key: "diskAllocated",
  },
  {
    title: "磁盘分配率",
    key: "diskAllocatedPercent",
  }
];

// UIS计算资源
export const UIS_COMPUTER_COLUMNS = [
  {
    title: "主机名称",
    key: "hostName",
  },
  {
    title: "主机IP",
    key: "hostIp",
  },
  {
    title: "虚拟机数量",
    key: "vmNum",
  },
  {
    title: "CPU总核数",
    key: "cpuTotal",
  },
  {
    title: "CPU已分配核数",
    key: "cpuAllocated",
  },
  {
    title: "CPU分配率",
    key: "cpuAllocatedPercent",
  },
  {
    title: "CPU使用率",
    key: "cpuUsedPercent",
  },
  {
    title: "内存总量(GB)",
    key: "memoryTotal",
  },
  {
    title: "内存已分配量(GB)",
    key: "memoryAllocated",
  },
  {
    title: "内存分配率",
    key: "memoryAllocatedPercent",
  },
  {
    title: "剩余内存(GB)",
    key: "memoryFree",
  },
  {
    title: "内存使用率",
    key: "memoryUsedPercent",
  },
  {
    title: "磁盘总量(GB)",
    key: "diskTotal",
  },
  {
    title: "磁盘使用率",
    key: "diskUsedPercent",
  }
];
// UIS存储资源
export const UIS_STORAGE_COLUMNS = [
  {
    title: "存储名称",
    key: "diskName",
  },
  {
    title: "总容量(GB)",
    key: "totalSize",
  },
  {
    title: "已分配容量(GB)",
    key: "allocatedSize",
  },
  {
    title: "分配率",
    key: "allocatedPercent",
  },
  {
    title: "剩余容量(GB)",
    key: "freeSize",
  },
  {
    title: "使用率",
    key: "usedPercent",
  }
];
export default {
  CAS_COMPUTE_COLUMNS,
  CVK_COMPUTE_COLUMNS,
  STORAGE_ALONE_COLUMNS,
  STORAGE_CAS_COLUMNS,
  UIS_CLUSTER_COLUMNS,
  UIS_COMPUTER_COLUMNS,
  UIS_STORAGE_COLUMNS
};


