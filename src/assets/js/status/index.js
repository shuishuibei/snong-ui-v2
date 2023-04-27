import {detailed_server_status,simple_server_status} from './resource/server.js';
import volume_status from './resource/volume.js';
import bare_status from '@/assets/js/status/resource/bare-metal.js';
import {power_disk, move_state, power_host_status, mount_power_host_status, power_can_mount_disk} from '@/assets/js/status/resource/power-disk-host.js';
import virtual_network_status from './resource/virtual-network.js';
import order_status from './order/order.js';
import process_status from './process/process.js';
import log_status from './log/log.js';

export const ServerStatus = detailed_server_status;
export const SimpleServerStatus = simple_server_status;
export const VolumeStatus = volume_status;
export const VirtualNetworkStatus = virtual_network_status;
export const OrderStatus = order_status;
export const ProcessStatus = process_status;
export const bareStatus = bare_status;
export const powerDisk = power_disk;
export const moveState = move_state;
export const powerHostStatus = power_host_status;
export const mountPowerHostStatus = mount_power_host_status;
export const powerCanMountDisk = power_can_mount_disk;
export const logStatus = log_status;