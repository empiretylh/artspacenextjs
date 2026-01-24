export const PERMISSIONS = {
   TASK_CREATE: "task:create",
   TASK_READ_OWN: "task:read:own",
   TASK_READ_ANY: "task:read:any",
   TASK_UPDATE_OWN: "task:update:own",
   TASK_UPDATE_ANY: "task:update:any",
   TASK_DELETE_OWN: "task:delete:own",
   TASK_DELETE_ANY: "task:delete:any",
   USER_MANAGE: "user:manage",
   ROLE_MANAGE: "role:manage",
} as const;
