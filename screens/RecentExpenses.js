import { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/data";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses() {
  const [isFetching, setisFetching] = useState(true); //initially true bc we know that the app is loading at the beginning
  const [error, setError] = useState();
  const expensesCtx = useContext(ExpensesContext);

  
  useEffect(() => {
    async function getExpenses() {
      setisFetching(true);
      try {
        const expenses = await fetchExpenses(); //get the expenses from the server
        expensesCtx.setExpenses(expenses); //update the expenses in the context to be displayes immediately on the app !
      } catch (error) {
        setError("An error occurred while fetching the expenses!");
      }
      setisFetching(false);
    }
    getExpenses();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} onConfirm={() => setError(null)} />;
  }
  
  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return expense.date >= date7DaysAgo && expense.date <= today;
  });
  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText="No Expenses for the last 7 days !"
    />
  );
}

export default RecentExpenses;
