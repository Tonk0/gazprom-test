SELECT
  m.id as metric_id,
  m.datetime as metric_datetime,
  m.cpu_utilization as metric_cpu_utilization,
  m.memory_utilization as metric_memory_utilization,
  m.disk_utilization as metric_disk_utilization,
  m.node_id as metric_node_id,
  n.caption as node_caption,
  n.status as node_status_id,
  n.interface as node_interface_id,
  n.admin as node_admin_id
FROM metrics m
JOIN
  nodes n ON m.node_id = n.id