import { useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { storeExpense, updateExpense, deleteExpense } from "../util/http";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({ route, navigation }) {
  const [isSubmitting, setisSubmitting] = useState(false); //initially we are not submitting anything
  const [error, setError] = useState(); //initially we don't have any error
  const expenseCtx = useContext(ExpensesContext);

  //the route prop is passed by the navigation component in ExpenseItem.js
  const editedExpenseId = route.params?.expenseId; //i used the ? operator to avoid an error if the route.params object is undefined.
  const isEditing = !!editedExpenseId; //i used the !! operator to convert the editExpenseId to a boolean value.
  //the title will be dependent on whether the user is editing an expense or adding a new one.

  const selectedExpense = expenseCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  ); //true or false

  useLayoutEffect(() => {
    //useLayoutEffect is used to update the title of the screen dynamically
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setisSubmitting(true);
    try {
      await deleteExpense(editedExpenseId); //i used await here to be updated in the screen immediately
      //these two lines can't be executed if the above line throws an error
      expenseCtx.deleteExpense(editedExpenseId);
      navigation.goBack(); //no need to set the isSubmitting to false bc we are navigating away from the screen
    } catch (error) {
      setError("An error occurred while deleting the expense!");
      setisSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setisSubmitting(true);
    try {
      if (isEditing) {
        expenseCtx.updateExpense(editedExpenseId, expenseData);
        updateExpense(editedExpenseId, expenseData); //no need to await bc we don't need the response
      } else {
        const id = await storeExpense(expenseData); //function from util/http.js
        expenseCtx.addExpense({ ...expenseData, id: id }); //function from store/expenses-context.js
      }
      navigation.goBack();
    } catch (error) {
      setError("An error occurred while saving the expense!");
      setisSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} onConfirm={() => setError(null)} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        submitButtonLabel={isEditing ? "Update" : "Add"}
        defaultValues={selectedExpense}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
