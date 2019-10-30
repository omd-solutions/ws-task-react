import React, {Component, ReactNode} from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    List,
    ListItem, ListItemText,
    Typography
} from "@material-ui/core";
import {ErrorTwoTone, WarningTwoTone} from "@material-ui/icons";
import TaskReport from "./TaskReport";
let moment = require("moment");


type Props = {
    task: TaskReport
}

type State = {
    showWarnings: boolean,
    showError: boolean
}

class Task extends Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {showWarnings: false, showError: false};
    }

    render(): ReactNode {
        if (!this.props.task) {
            return null;
        }
        let statusColor = "#7399c6";
        let dateString = "Queued At: " + moment(this.props.task.queuedAt).format("DD/MM/YYYY hh:mm:ss");
        if (this.props.task.status === "Running") {
            statusColor = "#27ae60";
            dateString = "Started At: " + moment(this.props.task.startedAt).format("DD/MM/YYYY hh:mm:ss");
        } else if (this.props.task.status === "Success") {
            dateString = "Finished At: " + moment(this.props.task.finishedAt).format("DD/MM/YYYY hh:mm:ss");
            if (this.props.task.warnings.length > 0) {
                statusColor = "#f1c40f";
            } else {
                statusColor = "#27ae60";
            }
        } else if (this.props.task.status === "Error") {
            dateString = "Failed At: " + moment(this.props.task.finishedAt).format("DD/MM/YYYY hh:mm:ss");
            statusColor = "#c0392b";
        }

        let warningButton = null;
        if (this.props.task.warnings.length > 0) {
            warningButton = (
                <IconButton onClick={() => this.setState({showWarnings: true})}>
                    <WarningTwoTone/>
                </IconButton>
            );
        }
        let errorButton = null;
        if (this.props.task.errorStack) {
            errorButton = (
                <IconButton onClick={() => this.setState({showError: true})} style={{color: "#c0392b"}}>
                    <ErrorTwoTone/>
                </IconButton>
            );
        }

        return (
            <div style={{height: "100px"}}>
                <div>
                    <Typography
                        component="span"
                        variant="body1"
                        color="textPrimary">
                        {this.props.task.taskName}
                    </Typography>
                    <div style={{float: "right"}}>
                        <Typography
                            component="div"
                            variant="body1"
                            style={{color: statusColor, height: "48px", display: "inline-block"}}>
                            {this.props.task.status}
                        </Typography>
                        <div style={{marginLeft: "10px", display: "inline-block"}}>
                            {warningButton}
                            {errorButton}
                        </div>
                        <Typography
                            component="div"
                            variant="body2"
                            color="textSecondary">
                            {dateString}
                        </Typography>
                    </div>
                </div>
                <Typography
                    component="div"
                    variant="body2"
                    noWrap={true}
                    color="textSecondary"
                    style={{marginBottom: "40px"}}>
                    {this.props.task.statusMessage}
                </Typography>
                <LinearProgress variant="determinate" value={this.props.task.progress}/>
                <Dialog aria-labelledby="warn-dialog-title" open={this.state.showWarnings}
                        onClose={() => this.setState({showWarnings: false})}>
                    <DialogTitle id="warn-dialog-title">Task Warnings</DialogTitle>
                    <DialogContent>
                        <List dense={true}>
                            {this.props.task.warnings.map((warning: string, index: number) => Task.createWarningItem(warning, index))}
                        </List>
                    </DialogContent>
                </Dialog>
                <Dialog aria-labelledby="error-dialog-title" open={this.state.showError}
                        onClose={() => this.setState({showError: false})}>
                    <DialogTitle id="error-dialog-title">Task Error</DialogTitle>
                    <DialogContent>
                        <Typography
                            component="pre"
                            variant="body2"
                            color="textSecondary">
                            {this.props.task.errorStack}
                        </Typography>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    static createWarningItem(warning: string, index: number): ReactNode {
        return (
            <ListItem key={index} divider={true} >
                <ListItemText>{warning}</ListItemText>
            </ListItem>
        );
    }

}

export default Task;