import { createContext, useReducer } from "react";

const DUMMY_EXPENSES = [
  {
    id: "e1",
    description: "A pair of shoes",
    amount: 59.99,
    date: new Date("2024-6-21"),
  },
  {
    id: "e2",
    description: "A pair of trousers",
    amount: 89.29,
    date: new Date("2024-01-05"),
  },
  {
    id: "e3",
    description: "Some bananas",
    amount: 5.99,
    date: new Date("2023-12-01"),
  },
  {
    id: "e4",
    description: "A book",
    amount: 14.99,
    date: new Date("2024-02-19"),
  },
  {
    id: "e5",
    description: "Another book",
    amount: 18.59,
    date: new Date("2024-06-18"),
  },
  {
    id: "e6",
    description: "A smartwatch",
    amount: 199.99,
    date: new Date("2024-06-15"),
  },
  {
    id: "e7",
    description: "A coffee mug",
    amount: 8.99,
    date: new Date("2024-06-05"),
  },
  {
    id: "e8",
    description: "Wireless headphones",
    amount: 59.99,
    date: new Date("2024-06-15"),
  },
  {
    id: "e9",
    description: "USB flash drive",
    amount: 16.49,
    date: new Date("2024-04-22"),
  },
  {
    id: "e10",
    description: "Desk lamp",
    amount: 22.99,
    date: new Date("2024-05-18"),
  },
  {
    id: "e11",
    description: "Notebook",
    amount: 3.49,
    date: new Date("20224-06-01"),
  },
  {
    id: "e12",
    description: "Water bottle",
    amount: 11.99,
    date: new Date("2023-07-03"),
  },
];

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {}, //the same id before and after updating.
});

function expensesReducer(state, action) { //state is an array of expenses
  switch (action.type) {
    case "ADD":
      const id = new Date().toString() + Math.random().toString(); //Generates a unique ID for a new expense by combining the current date string with a random number string
      return [{ ...action.payload, id }, ...state]; //action.payload contains the new expense data that is being added (like description, amount, and date).

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
  const [expensesState, dispatch] = useReducer(expensesReducer, DUMMY_EXPENSES);

  function addExpense(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  const value = {
    expenses: expensesState,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export default ExpensesContextProvider;