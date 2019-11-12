import React from 'react';
import {storiesOf} from '@storybook/react';
import Task from './Task';
import TaskReport from "./TaskReport";

export const taskReport: TaskReport = {
    taskId: "123",
    taskName: "A really useful task",
    status: "Queued",
    statusMessage: "Not Started",
    progress: 0,
    queuedAt: new Date().getTime(),
    startedAt: undefined,
    finishedAt: undefined,
    warnings: [],
    errorStack: undefined
};

storiesOf("Task", module)
    .add("queued", () => <Task task={taskReport} />)
    .add("running", () => <Task task={{...taskReport,
        status: "Running",
        statusMessage: "I'm about half way through this",
        progress: 50,
        startedAt: new Date().getTime()
    }} />)
    .add("success", () => <Task task={{...taskReport,
        status: "Success",
        statusMessage: "Finished",
        progress: 100,
        finishedAt: new Date().getTime()
    }} />)
    .add("with warnings", () => <Task task={{...taskReport,
        status: "Success",
        statusMessage: "Finished",
        progress: 100,
        finishedAt: new Date().getTime(),
        warnings: ["Here's an initial warning", "Oh no, and here's a second"]
    }} />)
    .add("with error", () => <Task task={{...taskReport,
        status: "Error",
        statusMessage: "Error",
        progress: 100,
        finishedAt: new Date().getTime(),
        errorStack: "This is a long and pre-formatted block of text - usually a Java stacktrace"
    }} />)
    .add("with warnings and error", () => <Task task={{...taskReport,
        status: "Error",
        statusMessage: "Error",
        progress: 100,
        finishedAt: new Date().getTime(),
        warnings: ["Here's an initial warning", "Oh no, and here's a second"],
        errorStack: "This is a long and pre-formatted block of text - usually a Java stacktrace"
    }} />);