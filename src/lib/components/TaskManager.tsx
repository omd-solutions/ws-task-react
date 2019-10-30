import React, {Component, ReactNode} from "react";
import {AppBar, Tab, Tabs} from "@material-ui/core";
import TaskList from "./TaskList";

type Props = {
    brokerUrl: string | undefined
    msgEndpoint: string | undefined
}

type State = {
    tabIndex: number
}

class TaskManager extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {tabIndex: 0};
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    getTabProps(index: number): any {
        return {
            id: "tab-" + index,
            "aria-controls": "tabpanel-" + index
        };
    }

    handleTabChange(event: any, newValue: number): void {
        this.setState({tabIndex: newValue});
    }

    render(): ReactNode {
        let status = "RUNNING";
        if (this.state.tabIndex === 1) {
            status = "QUEUED";
        } else if(this.state.tabIndex === 2) {
            status = "FINISHED,ERROR";
        }

        return (
            <div>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.tabIndex}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth">
                        <Tab label="Running" {...this.getTabProps(0)} />
                        <Tab label="Queued" {...this.getTabProps(1)} />
                        <Tab label="Finished" {...this.getTabProps(2)} />
                    </Tabs>
                </AppBar>
                <div style={{overflowY: "auto"}} >
                    <TaskList brokerUrl={this.props.brokerUrl} msgEndpoint={this.props.msgEndpoint} status={status}/>
                </div>
            </div>
        );
    }

}

export default TaskManager