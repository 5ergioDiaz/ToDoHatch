import { ADD_TASK, EDIT_TASK, COMPLETE_TASK, CANCEL_TASK } from "../constants";

const initialState = {
  allTasks: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TASK: {
      const { id, taskInfo } = action.data
      return {
        ...state,
        allTasks: [...state.allTasks, { id, taskInfo }]
      };
    }
    case EDIT_TASK: {
      const { id, taskInfo } = action.data
      state.allTasks[taskInfo[0]] = taskInfo[1]
      return {
        ...state,
        allTasks: state.allTasks
      };
    }
    case COMPLETE_TASK: {
      const { id, taskInfo } = action.data
      state.allTasks[taskInfo[0]].taskInfo.isComplete = taskInfo[1]
      return {
        ...state,
        allTasks: state.allTasks
      };
    }
    case CANCEL_TASK: {
      const { id } = action.data
      return {
        ...state,
        allTasks: state.allTasks.filter((task) => task.id != id)
      };
    }
    default:
      return state;
  }
}
