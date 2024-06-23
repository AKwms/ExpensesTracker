import { createContext, useReducer } from "react";


export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  setExpenses: (expenses) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {}, //the same id before and after updating.
});

function expensesReducer(state, action) { //state is an array of expenses
  switch (action.type) {
    case "ADD":
      //no need to generate the id bc the firebase will generate it for us
      // const id = new Date().toString() + Math.random().toString(); //Generates a unique ID for a new expense by combining the current date string with a random number string
      return [action.payload, ...state]; //action.payload contains the new expense data that is being added (like description, amount, and date).

    case "SET":
      const inverted = action.payload.reverse(); //reverse the order of the expenses bc in firebase the newest expense is at the end of the array
      return inverted;

    case "UPDATE":
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id //for example index = 2
      );
      const updatableExpenses = state[updatableExpenseIndex]; //updatableExpenses stores the data of expense that needs to be updated
      const updatedItem = { ...updatableExpenses, ...action.payload.data }; //This line creates a new expense object (updatedItem) by combining the existing expense (updatableExpenses) with the updated data (action.payload.data).
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;

    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);

    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  function addExpense(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  const value = {
    expenses: expensesState,
    setExpenses: setExpenses,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export default ExpensesContextProvider;