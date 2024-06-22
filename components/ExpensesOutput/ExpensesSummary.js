import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function ExpensesSummary({expenses, periodName}) {
    const expensesSum = expenses.reduce((sum, expense) => {
        return sum + expense.amount
    }, 0); //first argument is the callback function, second argument is the initial value of the sum
    //the reducer function takes two arguments, the first is the accumulator, the second is the current value

    return ( //toFixed() method formats a number to print exactly 2 decimal places.
        <View style={styles.container}>
        <Text style={styles.period}>{periodName}</Text>
        <Text style={styles.sum}>${expensesSum.toFixed(2)}</Text>
      </View>
    )
}


export default ExpensesSummary;

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: GlobalStyles.colors.primary50,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    period: {
        fontSize: 12,
        color: GlobalStyles.colors.primary400
    },
    
    sum: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GlobalStyles.colors.primary500
    }
})