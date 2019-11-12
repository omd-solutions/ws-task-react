import TaskReport from "./TaskReport";
import React, {Component, ReactNode} from "react";
import {Client} from "@stomp/stompjs";
import {Container, List, ListItem, ListItemText} from "@material-ui/core";
import Task from "./Task";

type Props = {
    brokerUrl: string | undefined
    msgEndpoint: string | undefined
    status: string
}

type State = {
    tasks: TaskReport [],
    stompClient: Client
}

class TaskList extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        let client = new Client();
        let brokerUrl = props.brokerUrl;
        if(!brokerUrl) {
            let loc = window.location;
            if(loc.protocol === "https:") {
                brokerUrl = "wss:";
            } else {
                brokerUrl = "ws:";
            }
            brokerUrl += "//" + loc.host;
            brokerUrl += "/stomp";
        }
        let msgEndpoint = props.msgEndpoint ? props.msgEndpoint : "/topic/task";
        client.configure({
            brokerURL: brokerUrl,
            onConnect: () => {
                this.state.stompClient.subscribe(msgEndpoint, message => {
                    let newState = this.state.tasks.slice();
                    let updatedTasks = JSON.parse(message.body);
                    updatedTasks.forEach((updatedTask: TaskReport) => {
                        let index = newState.findIndex(t => t.taskId === updatedTask.taskId);
                        if(index !== -1) {
                            if(updatedTask.status !== "Running") {
                                newState.splice(index, 1);
                            } else {
                                newState[index] = updatedTask;
                            }
                        } else {
                            if(updatedTask.status === "Running") {
                                newState.unshift(updatedTask);
                            }
                        }
                    });
                    this.setState({tasks: newState});
                });
            }
        });
        this.state = {tasks: [], stompClient: client};
    }

    componentDidMount(): void {
        this.componentDidUpdate(this.props, this.state);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if(prevProps.status !== this.props.status) {
            this.state.stompClient.deactivate();
            fetch("/api/tasks?status=" + this.props.status)
                .then(results => {
                    return results.json();
                })
                .then(data => {
                    if(this.props.status === "RUNNING") {
                        this.state.stompClient.activate();
                    }
                    this.setState({tasks: data.reverse()});
                });
        }
    }

    componentWillUnmount(): void {
        this.state.stompClient.deactivate();
    }

    render(): ReactNode {
        return (
            <Container fixed>
                <List dense={true} >
                    {this.state.tasks.map((task: TaskReport, index: number) => this.createTaskItem(task, index))}
                </List>
            </Container>
        );
    }

    createTaskItem(task: TaskReport, index: number): ReactNode {
        return (
            <ListItem key={"task-" + index} divider={true}>
                <ListItemText primary={
                    <React.Fragment>
                        <Task task={task} />
                    </React.Fragment>
                } />
            </ListItem>
        );
    }
}

export default TaskList;