import {
    ADD_TASK,
    EDIT_TASK,
    CANCEL_TASK,
    COMPLETE_TASK,
} from "../constants";

let id = 0;

export const addTask = taskInfo => ({
    type: ADD_TASK,
    data: {
        id: ++id,
        taskInfo
    }
});

export const editTask = taskInfo => ({
    type: EDIT_TASK,
    data: {
        id,
        taskInfo
    }
});

export const completeTask = taskInfo => ({
    type: COMPLETE_TASK,
    data: {
        id,
        taskInfo
    }
});

export const cancelTask = id => ({
    type: CANCEL_TASK,
    data: {
        id
    }
});

