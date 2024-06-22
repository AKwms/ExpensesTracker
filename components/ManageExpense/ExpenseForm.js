import { View, StyleSheet, Text, Alert } from "react-native";
import { useState } from "react";
import Input from "./Input";
import Button from "../UI/Button";
import { GlobalStyles } from "../../constants/styles";

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  //you can create a state for each input field + a function handler for each
  // const [amountValue, setAmountValue] = useState(""); //Although the keyboardType is set to decimal-pad, the value is still a string
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true, //you can use defaultValues ? true : false
    }, //now the expense of the selected expense will be displayed in the form
    date: {
      value: defaultValues ? defaultValues.date.toISOString().slice(0, 10) : "",
      isValid: true,
    }, //the YYYY-MM-DD format are the first 10 characters of the ISO string.
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true,
    },
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    //inputIdentifier must be before enteredValue !
    setInputs((currentInputs) => {
      return {
        ...currentInputs, //initially, the state is an empty object
        [inputIdentifier]: { value: enteredValue, isValid: true }, //if the amount changes, only the amount value will be updated .
      };
    });
  }

  function submitHandler() {
    const expenseData = {
      amount: +inputs.amount.value, //the + sign converts the string to a number, you can use perseInt() or parseFloat() instead
      date: new Date(inputs.date.value), //converts the string to a date object
      description: inputs.description.value, //keep it as a string
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      // Alert.alert('Invalid input', 'Please check your input values');
      setInputs((curInputs) => {
        return {
          amount: { value: curInputs.amount.value, isValid: amountIsValid },
          date: { value: curInputs.date.value, isValid: dateIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      return;
    }

    onSubmit(expenseData);
  }

  const formIsInvalid =
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid;


  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label="Amount"
          invalid={!inputs.amount.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "amount"), //bind used here to define the inputIdentifier as 'amount'
            value: inputs.amount.value, //in case there's a reset button
          }}
        />
        <Input
          style={styles.rowInput}
          label="Date"
          invalid={!inputs.date.isValid}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: inputChangedHandler.bind(this, "date"),
            value: inputs.date.value,
          }}
        />
      </View>
      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          // autoCapitalize: 'none'
          // autoCorrect: false // default is true
          onChangeText: inputChangedHandler.bind(this, "description"),
          value: inputs.description.value,
        }}
      />
            {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 24,
  },

  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowInput: {
    flex: 1,
  },

  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});

export default ExpenseForm;
