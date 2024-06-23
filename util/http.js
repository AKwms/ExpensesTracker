import axios from "axios";

const BASE_URL = "https://rn-course-udemy-default-rtdb.firebaseio.com";

export async function storeExpense(expenseData) {
  //https://rn-course-udemy-default-rtdb.firebaseio.com this part taken from firebase realtime database.
  //expenses.json (like a folder) is the endpoint where we want to store the data.
  const response = await axios.post(BASE_URL + "/expenses.json", expenseData); //npm install axios
  const id = response.data.name; //this is the id of the expense
  return id;
}

export async function fetchExpenses() {
  const response = await axios.get(BASE_URL + "/expenses.json");

  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date), //firebase stores date as string
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }
  return expenses;
}

export function updateExpense(id, expenseData) {
  return axios.put(BASE_URL + `/expenses/${id}.json`, expenseData);
}

export function deleteExpense(id) {
  return axios.delete(BASE_URL + `/expenses/${id}.json`);
}
