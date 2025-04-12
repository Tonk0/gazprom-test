SELECT
  g.id as group_id,
  g.caption as group_caption,
  n.id as node_id,
  n.caption as node_caption,
  n.status as node_status_id,
  ns.color as node_status_color,
  ns.description as node_status_description,
  i.id as interface_id,
  i.caption as interface_caption,
  i.status as interface_status_id,
  ints.color as interface_status_color,
  ints.description as interface_status_description,
  a.id as application_id,
  a.caption as application_caption,
  u.id as admin_id,
  u.firstname as admin_firstname,
  u.lastname as admin_lastname,
  u.email as admin_email
FROM "groups" g
JOIN
  groups_nodes gn ON g.id = gn.group_id
JOIN
  nodes n ON gn.node_id = n.id
JOIN
  statuses ns ON n.status = ns."Id"
JOIN
  interfaces i ON n.interface = i.id
JOIN
  statuses ints ON i.status = ints."Id"
JOIN
  nodes_applications na ON n.id = na.node_id
JOIN
  applications a ON na.application_id = a.id
JOIN
  users u ON n.admin = u.id
ORDER BY
  g.id, n.id, a.id