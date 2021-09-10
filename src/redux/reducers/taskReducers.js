import { ADD_TASK, CANCEL_TASK } from "../constants";

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
