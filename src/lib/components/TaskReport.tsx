class TaskReport {

    taskId: string | undefined;
    taskName: string | undefined;
    status: string | undefined;
    statusMessage: string | undefined;
    progress: number | undefined;
    queuedAt: number | undefined;
    startedAt: number | undefined;
    finishedAt: number | undefined;
    warnings: string [] = [];
    errorStack: string | undefined;

}

export default TaskReport